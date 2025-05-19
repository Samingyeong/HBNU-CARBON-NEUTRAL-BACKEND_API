"""
MongoDB 데이터베이스 연결 및 설정
"""

import motor.motor_asyncio
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import gridfs
import urllib.parse

# 환경 변수 로드
load_dotenv()

# MongoDB 연결 정보
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "recycling_db")

# MongoDB Atlas 연결 옵션
client_options = {
    "retryWrites": True,
    "w": "majority",
    "connectTimeoutMS": 30000,
    "socketTimeoutMS": 30000,
    "serverSelectionTimeoutMS": 30000,
}

# 비동기 클라이언트 (FastAPI 엔드포인트용)
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
database = client[DB_NAME]

# 동기 클라이언트 (GridFS 및 일부 작업용)
sync_client = MongoClient(MONGO_URL)
sync_db = sync_client[DB_NAME]
fs = gridfs.GridFS(sync_db)

# 컬렉션
images_collection = database.images
analyses_collection = database.analyses

# 데이터베이스 초기화 함수
async def init_db():
    """
    데이터베이스 초기화 함수
    인덱스 생성 등의 초기 설정을 수행합니다.
    """
    # 이미지 ID에 인덱스 생성
    await database.images.create_index("image_id", unique=True)

    # 분석 결과에 이미지 ID 인덱스 생성
    await database.analyses.create_index("image_id")

    # 생성 시간에 인덱스 생성 (최근 이미지 조회용)
    await database.images.create_index("created_at")
