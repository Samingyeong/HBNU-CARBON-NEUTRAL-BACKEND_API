"""
이미지 저장 및 분석 서비스
"""

from fastapi import UploadFile, HTTPException
from bson import ObjectId
from datetime import datetime
import uuid
from google.cloud import vision
import io
from . import database
from .recycling import RecyclingClassifier

# Vision API 클라이언트
vision_client = vision.ImageAnnotatorClient()

async def save_image_to_db(file: UploadFile, content: bytes, user_id: str = None, category: str = None):
    """
    이미지를 MongoDB에 저장합니다.

    Args:
        file: 업로드된 파일 객체
        content: 이미지 바이너리 데이터
        user_id: 사용자 ID (선택 사항)
        category: 이미지 카테고리 (선택 사항)

    Returns:
        저장된 이미지 문서
    """
    try:
        # 고유 ID 생성
        image_id = str(uuid.uuid4())

        # 이미지를 GridFS에 저장
        file_id = database.fs.put(
            content,
            filename=file.filename,
            content_type=file.content_type,
            image_id=image_id
        )

        # 현재 날짜 및 시간 정보
        current_datetime = datetime.now()

        # 이미지 메타데이터 저장
        image_doc = {
            "image_id": image_id,
            "file_id": str(file_id),
            "filename": file.filename,
            "content_type": file.content_type,
            "user_id": user_id,
            "category": category,
            "date": current_datetime.date().isoformat(),
            "time": current_datetime.time().isoformat(),
            "created_at": current_datetime
        }

        await database.images_collection.insert_one(image_doc)

        # _id 필드를 문자열로 변환
        image_doc["_id"] = str(image_doc["_id"])

        return image_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 저장 중 오류 발생: {str(e)}")

async def analyze_image_with_vision(content: bytes):
    """
    Google Vision API를 사용하여 이미지를 분석합니다.

    Args:
        content: 이미지 바이너리 데이터

    Returns:
        라벨 및 객체 감지 결과
    """
    try:
        # Vision API 이미지 생성
        image = vision.Image(content=content)

        # 라벨 및 객체 감지 수행
        label_response = vision_client.label_detection(image=image)
        object_response = vision_client.object_localization(image=image)

        labels = label_response.label_annotations
        objects = object_response.localized_object_annotations

        return labels, objects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 분석 중 오류 발생: {str(e)}")

async def analyze_recycling(labels, objects):
    """
    재활용 분류기를 사용하여 이미지를 분석합니다.

    Args:
        labels: 감지된 라벨 목록
        objects: 감지된 객체 목록

    Returns:
        재활용 분석 결과
    """
    try:
        # 재활용 분류기 초기화
        recycling_classifier = RecyclingClassifier()

        # 재활용 분석 수행
        recycling_analysis = recycling_classifier.analyze_image_for_recycling(labels, objects)

        return recycling_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"재활용 분석 중 오류 발생: {str(e)}")

async def save_analysis_result(image_id, recycling_analysis, labels, objects):
    """
    분석 결과를 MongoDB에 저장합니다.

    Args:
        image_id: 이미지 ID
        recycling_analysis: 재활용 분석 결과
        labels: 감지된 라벨 목록
        objects: 감지된 객체 목록

    Returns:
        저장된 분석 결과 문서
    """
    try:
        # 분석 결과 저장
        analysis_doc = {
            "image_id": image_id,
            "analysis_type": "recycling",
            "analysis_result": recycling_analysis,
            "detected_labels": [
                {"description": label.description, "score": label.score}
                for label in labels
            ],
            "detected_objects": [
                {"name": obj.name, "score": obj.score}
                for obj in objects
            ],
            "created_at": datetime.now()
        }

        await database.analyses_collection.insert_one(analysis_doc)

        # _id 필드를 문자열로 변환
        analysis_doc["_id"] = str(analysis_doc["_id"])

        return analysis_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"분석 결과 저장 중 오류 발생: {str(e)}")

async def get_image_by_id(image_id: str):
    """
    이미지 ID로 이미지 정보를 조회합니다.

    Args:
        image_id: 이미지 ID

    Returns:
        이미지 문서
    """
    image_doc = await database.images_collection.find_one({"image_id": image_id})
    if not image_doc:
        raise HTTPException(status_code=404, detail="이미지를 찾을 수 없습니다")

    # _id 필드를 문자열로 변환
    image_doc["_id"] = str(image_doc["_id"])

    return image_doc

async def get_analysis_by_image_id(image_id: str):
    """
    이미지 ID로 분석 결과를 조회합니다.

    Args:
        image_id: 이미지 ID

    Returns:
        분석 결과 문서
    """
    analysis_doc = await database.analyses_collection.find_one({"image_id": image_id})
    if not analysis_doc:
        return None

    # _id 필드를 문자열로 변환
    analysis_doc["_id"] = str(analysis_doc["_id"])

    return analysis_doc

async def get_image_data(image_id: str):
    """
    이미지 ID로 이미지 바이너리 데이터를 조회합니다.

    Args:
        image_id: 이미지 ID

    Returns:
        이미지 바이너리 데이터와 콘텐츠 타입
    """
    # 이미지 정보 조회
    image_doc = await database.images_collection.find_one({"image_id": image_id})
    if not image_doc:
        raise HTTPException(status_code=404, detail="이미지를 찾을 수 없습니다")

    # GridFS에서 이미지 데이터 조회
    file_id = ObjectId(image_doc["file_id"])
    if not database.fs.exists(file_id):
        raise HTTPException(status_code=404, detail="이미지 데이터를 찾을 수 없습니다")

    grid_out = database.fs.get(file_id)

    return grid_out.read(), image_doc["content_type"]

async def get_recent_images(limit: int = 10, user_id: str = None):
    """
    최근 이미지 목록을 조회합니다.

    Args:
        limit: 조회할 이미지 수
        user_id: 특정 사용자의 이미지만 조회할 경우 사용자 ID

    Returns:
        최근 이미지 목록
    """
    # 사용자 ID가 제공된 경우 해당 사용자의 이미지만 조회
    filter_query = {}
    if user_id:
        filter_query["user_id"] = user_id

    cursor = database.images_collection.find(filter_query).sort("created_at", -1).limit(limit)
    images = await cursor.to_list(length=limit)

    # _id 필드를 문자열로 변환
    for image in images:
        image["_id"] = str(image["_id"])

    return images

async def get_images_by_user_id(user_id: str, limit: int = 50):
    """
    특정 사용자의 이미지 목록을 조회합니다.

    Args:
        user_id: 사용자 ID
        limit: 조회할 최대 이미지 수

    Returns:
        사용자의 이미지 목록
    """
    if not user_id:
        raise HTTPException(status_code=400, detail="사용자 ID가 필요합니다")

    cursor = database.images_collection.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
    images = await cursor.to_list(length=limit)

    # _id 필드를 문자열로 변환
    for image in images:
        image["_id"] = str(image["_id"])

    return images

async def get_images_by_category(category: str, limit: int = 50, user_id: str = None):
    """
    특정 카테고리의 이미지 목록을 조회합니다.

    Args:
        category: 이미지 카테고리
        limit: 조회할 최대 이미지 수
        user_id: 특정 사용자의 이미지만 조회할 경우 사용자 ID

    Returns:
        카테고리별 이미지 목록
    """
    if not category:
        raise HTTPException(status_code=400, detail="카테고리가 필요합니다")

    # 필터 쿼리 구성
    filter_query = {"category": category}
    if user_id:
        filter_query["user_id"] = user_id

    cursor = database.images_collection.find(filter_query).sort("created_at", -1).limit(limit)
    images = await cursor.to_list(length=limit)

    # _id 필드를 문자열로 변환
    for image in images:
        image["_id"] = str(image["_id"])

    return images
