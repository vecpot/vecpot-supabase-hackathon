from transformers import pipeline
import openai
import torch

from configurations import ModelConfigs

model_configs = ModelConfigs()

openai.api_key = model_configs.openai_api_key

qa_model = pipeline('question-answering', model=model_configs.qa_model)


def openai_embedding(query):
    emb_vector = openai.Embedding.create(
        input=query, engine='text-embedding-ada-002')['data'][0]['embedding']
    emb_vector = torch.Tensor(emb_vector)
    return emb_vector

def openai_gen_answer(contexts, query):
    contexts = [f"Context {i}: {context}" for i, context in enumerate(contexts)]
    context = "\n".join(contexts)
    context = f"Based on the context below\"\n\nContext: {context}\n\n---\n\nPlease provide concise answer and more details for this questions: {query}"

    answer = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": context}
        ]
    )
    
    return answer["choices"][0]["message"]["content"]