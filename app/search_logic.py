import datetime
import json
import logging
import re
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from typing import List
from typing import Optional

import nltk

from data_source.api.basic_document import DocumentType, FileType
from data_source.api.utils import get_confluence_user_image
from db_engine import Session
from indexing.pinecone_index import PineconeIndex
from models import qa_model, openai_embedding, openai_gen_answer
from schemas import Paragraph, Document
from util import threaded_method


nltk.download('punkt')
logger = logging.getLogger(__name__)


@dataclass
class TextPart:
    content: str
    bold: bool


@dataclass
class SearchResult:
    type: DocumentType
    score: float
    content: List[TextPart]
    author: str
    title: str
    url: str
    location: str
    data_source: str
    time: datetime
    file_type: FileType
    status: str
    is_active: bool
    author_image_url: Optional[str]
    author_image_data: Optional[str]
    paragraphs: Paragraph
    child: Optional['SearchResult'] = None


@dataclass
class Candidate:
    content: str
    score: float = 0.0
    document: Document = None
    answer_start: int = -1
    answer_end: int = -1
    parent: 'Candidate' = None

    def _text_anchor(self, url, text) -> str:
        if '#' not in url:
            url += '#'
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        words = text.split()
        url += ':~:text='
        if len(words) > 7:
            url += urllib.parse.quote(' '.join(words[:3])).replace('-', '%2D')
            url += ','
            url += urllib.parse.quote(' '.join(words[-3:])).replace('-', '%2D')
        else:
            url += urllib.parse.quote(text).replace('-', '%2D')
        return url

    @threaded_method
    def to_search_result(self) -> SearchResult:
        parent_result = None

        if self.parent is not None:
            parent_result = self.parent.to_search_result()
            parent_result.score = max(parent_result.score, self.score)
        elif self.document.parent_id is not None:
            parent_result = Candidate(content="", score=self.score, document=self.document.parent).to_search_result()

        answer = TextPart(self.content[self.answer_start: self.answer_end], True)
        content = [answer]

        if self.answer_end < len(self.content) - 1:
            words = self.content[self.answer_end:].split()
            suffix = ' '.join(words[:20])
            content.append(TextPart(suffix, False))

        data_uri = None
        if self.document.data_source.type.name == 'confluence':
            config = json.loads(self.document.data_source.config)
            data_uri = get_confluence_user_image(self.document.author_image_url, config['token'])

        result = SearchResult(score=self.score, #(self.score + 12) / 24 * 100,
                              content=content,
                              author=self.document.author,
                              author_image_url=self.document.author_image_url,
                              author_image_data=data_uri,
                              title=self.document.title,
                              url=self._text_anchor(self.document.url, answer.content),
                              time=self.document.timestamp,
                              location=self.document.location,
                              data_source=self.document.data_source.type.name,
                              type=self.document.type,
                              file_type=self.document.file_type,
                              status=self.document.status,
                              is_active=self.document.is_active,
                              paragraphs=self.document.paragraphs)

        if parent_result is not None:
            parent_result.child = result
            return parent_result
        else:
            return result

def _assign_answer_sentence(candidate: Candidate, answer: str):
    paragraph_sentences = re.split(r'([\.\!\?\:\-] |[\"“\(\)])', candidate.content)
    sentence = None
    for i, paragraph_sentence in enumerate(paragraph_sentences):
        if answer in paragraph_sentence:
            sentence = paragraph_sentence
            break
    else:
        sentence = answer
    start = candidate.content.find(sentence)
    end = start + len(sentence)
    candidate.answer_start = start
    candidate.answer_end = end


def _find_answers_in_candidates(candidates: List[Candidate], query: str) -> List[Candidate]:
    contexts = [candidate.content for candidate in candidates]
    answers = qa_model(question=[query] * len(contexts), context=contexts)

    if type(answers) == dict:
        answers = [answers]

    for candidate, answer in zip(candidates, answers):
        _assign_answer_sentence(candidate, answer['answer'])

    return candidates

def get_answer_from_gpt(search_results, query):
    contexts = []
    for result in search_results:
        paragraphs = result.paragraphs
        for para in paragraphs:
            contexts.append(para.content)
            
    answer = openai_gen_answer(contexts, query)
    return answer
    

def search_documents(query: str, top_k: int, namespace: str, result_only:bool = False) -> List[SearchResult]:
    # Encode the query
    query_embedding = openai_embedding(query=query)
    
    index = PineconeIndex.get()
    results = index.search(queries=query_embedding, top_k=top_k, namespace=namespace)
    sorted_results = sorted(results["matches"], key=lambda x: x["id"])
    results_ids = [int(match["id"]) for match in sorted_results]
    
    # Get the paragraphs from the database
    with Session() as session:
        paragraphs = session.query(Paragraph).filter(Paragraph.id.in_(results_ids)).all() # O(max(n,k))
        
        if len(paragraphs) == 0:
            return []
        
        candidates = []
        result_sidx = 0
        para_sidx = 0
        while result_sidx < len(results_ids) and para_sidx < len(paragraphs):
            if (results_ids[result_sidx] == paragraphs[para_sidx].id):
                candidates.append(
                    Candidate(
                        content=paragraphs[para_sidx].content, 
                        document=paragraphs[para_sidx].document, 
                        score=sorted_results[result_sidx]["score"]
                    )
                )
                result_sidx += 1
                para_sidx += 1
                continue
            else:
                result_sidx += 1
        
        candidates = _find_answers_in_candidates(candidates, query)

        logger.info(f'Parsing {len(candidates)} candidates to search results...')

        for possible_child in candidates:
            if possible_child.document.parent_id is not None:
                for possible_parent in candidates:
                    if possible_parent.document.id == possible_child.document.parent_id:
                        possible_child.parent = possible_parent
                        candidates.remove(possible_parent)
                        break

        with ThreadPoolExecutor(max_workers=10) as executor:
            result = list(executor.map(lambda c: c.to_search_result(), candidates))
            result.sort(key=lambda r: r.score, reverse=True)
            
            if result_only:
                return result
            
            answer = get_answer_from_gpt(search_results=result, query=query)
            return {"result": result, "answer": answer}