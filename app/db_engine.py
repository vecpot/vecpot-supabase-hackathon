from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# import base document and then register all classes
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from configurations import PostgresConfigs

postgres_configs = PostgresConfigs()
engine = create_engine(
    postgres_configs.sql_alchemy_database_url,
    pool_recycle=3600,
    echo=False,
    pool_pre_ping=True
)

from schemas.base import Base

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

async_db_url = postgres_configs.sql_alchemy_database_url.replace('postgresql', 'postgresql+asyncpg', 1)
async_engine = create_async_engine(async_db_url)
async_session = sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)
