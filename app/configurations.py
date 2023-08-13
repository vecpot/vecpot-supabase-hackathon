import os
from pathlib import Path

from pydantic import BaseSettings

class PathConfigs(BaseSettings):
    # storage_path = Path(f'/home/{os.getlogin()}/.gerev/storage/')
    storage_path = Path('/opt/storage/')
    sqlite_tasks_path = storage_path / 'tasks.sqlite3'
    sqlite_indexing_path = storage_path / 'indexing.sqlite3'
    
class PostgresConfigs(BaseSettings):
    postgres_username = str(os.getenv("POSTGRES_USER"))
    postgres_password = str(os.getenv("POSTGRES_PASSWORD"))
    postgres_port = str(os.getenv("POSTGRES_PORT"))
    postgres_db = str(os.getenv("POSTGRES_DB"))
    postgres_server = str(os.getenv("POSTGRES_SERVER"))
    sql_alchemy_database_url = (
        f"postgresql://{postgres_username}:{postgres_password}@{postgres_server}:{postgres_port}/{postgres_db}"
    )

class PineconeConfigs(BaseSettings):
    api_key = str(os.getenv("PINECONE_API_KEY"))
    environment = "asia-southeast1-gcp-free"
    index_name = "vecpot-test-1"
    
class ModelConfigs(BaseSettings):
    openai_api_key = str(os.getenv("OPENAI_API_KEY"))
    qa_model = "deepset/tinyroberta-squad2"