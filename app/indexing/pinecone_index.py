import logging
import torch
import pinecone
from typing import Dict, List

logger = logging.getLogger(__name__)

class PineconeIndex:
    instance = None
    
    @staticmethod
    def create(api_key: str, environment: str, index_name: str):
        
        if PineconeIndex.instance is not None:
            raise RuntimeError("Index is already initialized")

        PineconeIndex.instance = PineconeIndex(
            api_key=api_key,
            environment=environment,
            index_name=index_name
        )

    @staticmethod
    def get() -> 'PineconeIndex':
        if PineconeIndex.instance is None:
            raise RuntimeError("Index is not initialized")
        else:            
            return PineconeIndex.instance

    def __init__(self, api_key: str, environment: str, index_name: str) -> None:
        pinecone.init(
            api_key=api_key,
            environment=environment
        )
        # pinecone.whoami()
        
        if index_name in pinecone.list_indexes():
            # raise RuntimeError("Index is already created")
            pass
        else:
            pinecone.create_index(
                index_name,
                dimension=1536,
                metric='cosine',
                metadata_config={}
            )
            
        self.index = pinecone.Index(index_name)

    def update(self, paragraphs: List, embeddings: torch.FloatTensor, namespace: str):
        if not namespace:
            raise RuntimeError("namespace is 'None'")
        
        embeddings = embeddings.tolist()
        assert len(paragraphs) == len(embeddings)
        
        ids, docs = [], []
        for para in paragraphs:
            ids.append(para.id)
            docs.append(para.document.dict())
        
        # to_upsert = []
        for i in range(len(ids)):
            upsert_data = [(str(ids[i]), embeddings[i], docs[i])]
            # to_upsert.append(upsert_data)
        
            self.index.upsert(vectors=upsert_data, namespace=str(namespace))

    def remove(self, ids: List, namespace: str):
        if not namespace:
            raise RuntimeError("namespace is 'None'")
        
        for i in range(len(ids)):
            self.index.delete(ids=str(ids[i]), namespace=str(namespace))


    def search(self, queries: torch.FloatTensor, top_k: int, namespace: str, *args, **kwargs):
        if not namespace:
            raise RuntimeError("namespace is 'None'")
        
        if queries.ndim == 1:
            queries = queries.unsqueeze(0)
            
        results = self.index.query(
            vector=queries.tolist(),
            top_k=top_k,
            namespace=str(namespace),
            include_values=True
        )
        
        return results

    def clear(self, namespace: str):
        if not namespace:
            raise RuntimeError("namespace is 'None'")
        
        self.index.delete(deleteAll='true', namespace=namespace)

    def clear_all(self):
        for ns in self.index.describe_index_stats()["namespaces"].keys():
            self.index.delete(deleteAll='true', namespace=ns)
