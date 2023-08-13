import logging
from dataclasses import dataclass
from typing import List
import torch
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi_restful.tasks import repeat_every
from starlette.responses import Response

from api.data_source import router as data_source_router
from api.search import router as search_router
from api.health import router as health_router
from data_source.api.exception import KnownException
from data_source.api.context import DataSourceContext
from data_source.api.utils import get_utc_time_now
from db_engine import Session
from indexing.background_indexer import BackgroundIndexer
from indexing.pinecone_index import PineconeIndex
from queues.index_queue import IndexQueue
from queues.task_queue import TaskQueue
from schemas import DataSource
from schemas.document import Document
from schemas.paragraph import Paragraph
from workers import Workers
from configurations import PineconeConfigs

pinecone_configs = PineconeConfigs()

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s | %(levelname)s | %(filename)s:%(lineno)d | %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger("urllib3").propagate = False

app = FastAPI()


async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except KnownException as e:
        logger.exception("Known exception")
        return Response(e.message, status_code=501)
    except Exception:
        logger.exception("Server error")
        return Response("Oops. Server error...", status_code=500)

app.middleware('http')(catch_exceptions_middleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(search_router, prefix="/api/v1")
app.include_router(data_source_router, prefix="/api/v1")
app.include_router(health_router, prefix="/api/v1")


def _check_for_new_documents(force=False):
    with Session() as session:
        data_sources: List[DataSource] = session.query(DataSource).all()
        for data_source in data_sources:
            # data source should be checked once every hour
            if (get_utc_time_now() - data_source.last_indexed_at).total_seconds() <= 60 * 60 and not force:
                continue

            logger.info(f"Checking for new docs in {data_source.type.name} (id: {data_source.id})")
            data_source_instance = DataSourceContext.get_data_source_instance(data_source_id=data_source.id)
            data_source_instance._last_index_time = data_source.last_indexed_at
            data_source_instance.index(force=force)


@app.on_event("startup")
@repeat_every(seconds=60)
def check_for_new_documents():
    _check_for_new_documents(force=False)


@app.on_event("startup")
async def startup_event():
    if not torch.cuda.is_available():
        logger.warning("CUDA is not available, using CPU. This will make indexing and search very slow!!!")
    PineconeIndex.create(
        api_key=pinecone_configs.api_key,
        environment=pinecone_configs.environment,
        index_name=pinecone_configs.index_name
    )
    DataSourceContext.init()
    BackgroundIndexer.start()
    Workers.start()


@app.on_event("shutdown")
async def shutdown_event():
    Workers.stop()
    BackgroundIndexer.stop()


@app.get("/api/v1/status")
def status():
    @dataclass
    class Status:
        docs_in_indexing: int
        docs_left_to_index: int
        docs_indexed: int

    return Status(docs_in_indexing=BackgroundIndexer.get_currently_indexing(),
                  docs_left_to_index=IndexQueue.get_instance().qsize() + TaskQueue.get_instance().qsize(),
                  docs_indexed=BackgroundIndexer.get_indexed_count())


@app.post("/clear-index")
async def clear_index():
    PineconeIndex.get().clear_all()
    with Session() as session:
        session.query(Paragraph).delete()
        session.query(Document).delete()
        session.commit()


@app.post("/check-for-new-documents")
async def check_for_new_documents_endpoint():
    _check_for_new_documents(force=True)

if __name__ == '__main__':
   import uvicorn
   uvicorn.run("main:app", host="localhost", port=8000)
