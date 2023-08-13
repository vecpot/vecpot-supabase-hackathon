from fastapi import APIRouter
from starlette.requests import Request

from search_logic import search_documents

router = APIRouter(
    prefix='/search',
)


@router.get("")
async def search(request: Request, query: str, top_k: int = 10, organization_id: str = None):
    uuid_header = request.headers.get('uuid')
    return search_documents(query, top_k, namespace=organization_id)

@router.get("/result-only")
async def search(request: Request, query: str, top_k: int = 10, organization_id: str = None):
    uuid_header = request.headers.get('uuid')
    return search_documents(query, top_k, namespace=organization_id, result_only=True)
