from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from google.cloud import vision
import os
from dotenv import load_dotenv
from typing import List, Optional
import io
import asyncio

# 재활용 분류 모듈 가져오기
from app.recycling import RecyclingClassifier, get_korean_material_name
# 데이터베이스 및 이미지 서비스 가져오기
from app import database, image_service

# Load environment variables from .env file if it exists
load_dotenv()

# Get Google Cloud credentials from environment variable
credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# Initialize FastAPI app
app = FastAPI(
    title="Carbon Neutral Vision API",
    description="API for analyzing images using Google Vision API",
    version="1.0.0"
)

# Set up templates
templates = Jinja2Templates(directory="app/templates")

# 데이터베이스 초기화 이벤트 핸들러
@app.on_event("startup")
async def startup_db_client():
    await database.init_db()
    print("MongoDB 연결 및 초기화 완료")

# Get CORS settings from environment variables
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
if allowed_origins == ["*"]:
    allowed_origins = ["*"]  # Keep as a list with a wildcard

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize Vision client
try:
    vision_client = vision.ImageAnnotatorClient()
except Exception as e:
    print(f"Error initializing Vision API client: {e}")
    # We'll continue and handle errors in the endpoints

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze an image using Google Vision API to detect labels.

    - **file**: The image file to analyze

    Returns a list of labels detected in the image with confidence scores.
    """
    try:
        # Read image content
        content = await file.read()

        # Create Vision API image
        image = vision.Image(content=content)

        # Perform label detection
        response = vision_client.label_detection(image=image)
        labels = response.label_annotations

        # Return results
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "labels": [
                {"description": label.description, "score": label.score}
                for label in labels
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

@app.post("/detect-text/")
async def detect_text(file: UploadFile = File(...)):
    """
    Detect text in an image using Google Vision API.

    - **file**: The image file to analyze

    Returns the text detected in the image.
    """
    try:
        # Read image content
        content = await file.read()

        # Create Vision API image
        image = vision.Image(content=content)

        # Perform text detection
        response = vision_client.text_detection(image=image)
        texts = response.text_annotations

        # Return results
        if texts:
            return {
                "filename": file.filename,
                "content_type": file.content_type,
                "text": texts[0].description,
                "text_details": [
                    {"description": text.description, "locale": text.locale}
                    for text in texts[1:]
                ]
            }
        else:
            return {
                "filename": file.filename,
                "content_type": file.content_type,
                "text": "",
                "text_details": []
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting text: {str(e)}")

@app.post("/detect-objects/")
async def detect_objects(file: UploadFile = File(...)):
    """
    Detect objects in an image using Google Vision API.

    - **file**: The image file to analyze

    Returns a list of objects detected in the image with confidence scores.
    """
    try:
        # Read image content
        content = await file.read()

        # Create Vision API image
        image = vision.Image(content=content)

        # Perform object detection
        response = vision_client.object_localization(image=image)
        objects = response.localized_object_annotations

        # Return results
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "objects": [
                {
                    "name": obj.name,
                    "score": obj.score,
                    "bounding_poly": [
                        {"x": vertex.x, "y": vertex.y}
                        for vertex in obj.bounding_poly.normalized_vertices
                    ]
                }
                for obj in objects
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting objects: {str(e)}")

@app.post("/analyze-carbon-footprint/")
async def analyze_carbon_footprint(file: UploadFile = File(...)):
    """
    Analyze an image to estimate carbon footprint based on detected objects.

    - **file**: The image file to analyze

    Returns an analysis of potential carbon impact based on objects detected in the image.
    """
    try:
        # Read image content
        content = await file.read()

        # Create Vision API image
        image = vision.Image(content=content)

        # Perform both label and object detection for better analysis
        label_response = vision_client.label_detection(image=image)
        object_response = vision_client.object_localization(image=image)

        labels = label_response.label_annotations
        objects = object_response.localized_object_annotations

        # Simple carbon footprint estimation logic
        # This is a placeholder - in a real application, you would have a more sophisticated model
        carbon_indicators = {
            "car": 120,  # Example CO2 value in g/km
            "vehicle": 100,
            "truck": 200,
            "factory": 500,
            "plastic": 80,
            "paper": 30,
            "tree": -20,  # Negative value for carbon-reducing items
            "forest": -100,
            "plant": -10,
            "solar panel": -50,
            "wind turbine": -80,
        }

        # Analyze detected items
        carbon_impact = []
        total_score = 0

        # Check labels
        for label in labels:
            label_name = label.description.lower()
            for indicator, value in carbon_indicators.items():
                if indicator in label_name:
                    impact = {
                        "item": label.description,
                        "carbon_value": value,
                        "confidence": label.score,
                        "weighted_impact": value * label.score
                    }
                    carbon_impact.append(impact)
                    total_score += impact["weighted_impact"]

        # Check objects
        for obj in objects:
            obj_name = obj.name.lower()
            for indicator, value in carbon_indicators.items():
                if indicator in obj_name:
                    impact = {
                        "item": obj.name,
                        "carbon_value": value,
                        "confidence": obj.score,
                        "weighted_impact": value * obj.score
                    }
                    carbon_impact.append(impact)
                    total_score += impact["weighted_impact"]

        # Determine overall assessment
        if total_score < -50:
            assessment = "Very Positive - Carbon reducing"
        elif total_score < 0:
            assessment = "Positive - Slightly carbon reducing"
        elif total_score < 50:
            assessment = "Neutral - Limited carbon impact"
        elif total_score < 150:
            assessment = "Negative - Moderate carbon footprint"
        else:
            assessment = "Very Negative - High carbon footprint"

        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "carbon_impact_details": carbon_impact,
            "total_carbon_score": total_score,
            "assessment": assessment,
            "detected_labels": [
                {"description": label.description, "score": label.score}
                for label in labels
            ],
            "detected_objects": [
                {"name": obj.name, "score": obj.score}
                for obj in objects
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing carbon footprint: {str(e)}")

@app.post("/analyze-recycling/")
async def analyze_recycling(file: UploadFile = File(...)):
    """
    이미지를 분석하여 재활용 가능 여부와 분리수거 방법을 제공합니다.

    - **file**: 분석할 이미지 파일

    이미지에서 감지된 재질과 재활용 권장사항을 반환합니다.
    """
    try:
        # 이미지 콘텐츠 읽기
        content = await file.read()

        # Vision API 이미지 생성
        image = vision.Image(content=content)

        # 라벨 및 객체 감지 수행
        label_response = vision_client.label_detection(image=image)
        object_response = vision_client.object_localization(image=image)

        labels = label_response.label_annotations
        objects = object_response.localized_object_annotations

        # 재활용 분류기 초기화
        recycling_classifier = RecyclingClassifier()

        # 재활용 분석 수행
        recycling_analysis = recycling_classifier.analyze_image_for_recycling(labels, objects)

        # 결과 반환
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "recycling_analysis": recycling_analysis,
            "detected_labels": [
                {"description": label.description, "score": label.score}
                for label in labels
            ],
            "detected_objects": [
                {"name": obj.name, "score": obj.score}
                for obj in objects
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"재활용 분석 중 오류 발생: {str(e)}")

@app.post("/analyze-and-save/")
async def analyze_and_save(file: UploadFile = File(...)):
    """
    이미지를 분석하고 MongoDB에 저장합니다.

    - **file**: 분석할 이미지 파일

    이미지 분석 결과와 저장된 이미지 정보를 반환합니다.
    """
    try:
        # 이미지 콘텐츠 읽기
        content = await file.read()

        # 이미지를 MongoDB에 저장
        image_doc = await image_service.save_image_to_db(file, content)

        # 이미지 분석
        labels, objects = await image_service.analyze_image_with_vision(content)

        # 재활용 분석
        recycling_analysis = await image_service.analyze_recycling(labels, objects)

        # 분석 결과 저장
        analysis_doc = await image_service.save_analysis_result(
            image_doc["image_id"],
            recycling_analysis,
            labels,
            objects
        )

        # 결과 반환
        return {
            "image_id": image_doc["image_id"],
            "filename": image_doc["filename"],
            "content_type": image_doc["content_type"],
            "recycling_analysis": recycling_analysis,
            "detected_labels": analysis_doc["detected_labels"],
            "detected_objects": analysis_doc["detected_objects"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 분석 및 저장 중 오류 발생: {str(e)}")

@app.get("/images/{image_id}")
async def get_image_info(image_id: str):
    """
    저장된 이미지와 분석 결과를 조회합니다.

    - **image_id**: 조회할 이미지 ID

    이미지 정보와 분석 결과를 반환합니다.
    """
    try:
        # 이미지 정보 조회
        image_doc = await image_service.get_image_by_id(image_id)

        # 분석 결과 조회
        analysis_doc = await image_service.get_analysis_by_image_id(image_id)

        return {
            "image": image_doc,
            "analysis": analysis_doc
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 정보 조회 중 오류 발생: {str(e)}")

@app.get("/images/{image_id}/data")
async def get_image_data(image_id: str):
    """
    저장된 이미지 데이터를 조회합니다.

    - **image_id**: 조회할 이미지 ID

    이미지 바이너리 데이터를 반환합니다.
    """
    try:
        # 이미지 데이터 조회
        content, content_type = await image_service.get_image_data(image_id)

        return Response(content=content, media_type=content_type)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 데이터 조회 중 오류 발생: {str(e)}")

@app.get("/images/recent")
async def get_recent_images(limit: int = 10):
    """
    최근 분석된 이미지 목록을 조회합니다.

    - **limit**: 조회할 이미지 수 (기본값: 10)

    최근 이미지 목록을 반환합니다.
    """
    try:
        images = await image_service.get_recent_images(limit)
        return images
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"최근 이미지 조회 중 오류 발생: {str(e)}")
