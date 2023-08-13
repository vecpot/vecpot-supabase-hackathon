from fastapi import APIRouter
from starlette.requests import Request

router = APIRouter(
    prefix='/health',
)


@router.get("")
def health_check(request: Request):
    return {"health": "ok"}