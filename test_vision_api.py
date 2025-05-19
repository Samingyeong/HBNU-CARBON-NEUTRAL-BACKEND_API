"""
Google Vision API 테스트 스크립트
샘플 이미지를 사용하여 Vision API의 다양한 기능을 테스트합니다.
"""

import os
import io
import requests
from dotenv import load_dotenv
from google.cloud import vision
from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt

# 환경 변수 로드
load_dotenv()

# 서비스 계정 키 파일 경로 직접 설정 (테스트용)
credentials_path = "carbon-project-hanbat-5cbc71a30dff.json"
print(f"서비스 계정 키 파일 경로: {credentials_path}")

# 환경 변수 직접 설정 (테스트용)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path

# 샘플 이미지 URL (공개 도메인 이미지)
SAMPLE_IMAGES = [
    {
        "url": "https://storage.googleapis.com/cloud-samples-data/vision/label/setagaya.jpeg",
        "name": "city_street.jpeg",
        "description": "도시 거리 이미지"
    },
    {
        "url": "https://storage.googleapis.com/cloud-samples-data/vision/text/screen.jpg",
        "name": "text_sample.jpg",
        "description": "텍스트가 포함된 이미지"
    },
    {
        "url": "https://storage.googleapis.com/cloud-samples-data/vision/face/faces.jpeg",
        "name": "faces.jpeg",
        "description": "얼굴이 포함된 이미지"
    },
    {
        "url": "https://storage.googleapis.com/cloud-samples-data/vision/landmark/eiffel_tower.jpg",
        "name": "landmark.jpg",
        "description": "랜드마크 이미지"
    },
    {
        "url": "https://storage.googleapis.com/cloud-samples-data/vision/object_localization/puppies.jpg",
        "name": "objects.jpg",
        "description": "객체가 포함된 이미지"
    }
]

# 샘플 이미지 다운로드 함수
def download_sample_images():
    """샘플 이미지를 다운로드하고 samples 디렉토리에 저장합니다."""
    os.makedirs("samples", exist_ok=True)

    for image in SAMPLE_IMAGES:
        file_path = os.path.join("samples", image["name"])

        # 이미지가 이미 존재하는지 확인
        if os.path.exists(file_path):
            print(f"이미지가 이미 존재합니다: {file_path}")
            continue

        # 이미지 다운로드
        try:
            response = requests.get(image["url"])
            response.raise_for_status()

            with open(file_path, "wb") as f:
                f.write(response.content)

            print(f"이미지 다운로드 완료: {file_path}")
        except Exception as e:
            print(f"이미지 다운로드 실패: {image['url']} - {str(e)}")

# Vision API 클라이언트 초기화
def init_vision_client():
    """Vision API 클라이언트를 초기화합니다."""
    try:
        client = vision.ImageAnnotatorClient()
        return client
    except Exception as e:
        print(f"Vision API 클라이언트 초기화 실패: {str(e)}")
        return None

# 이미지 로드 함수
def load_image(file_path):
    """이미지 파일을 로드합니다."""
    with open(file_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    return image, content

# 라벨 감지 테스트
def test_label_detection(client, image_path):
    """이미지에서 라벨을 감지합니다."""
    print(f"\n=== 라벨 감지 테스트: {image_path} ===")

    image, _ = load_image(image_path)
    response = client.label_detection(image=image)
    labels = response.label_annotations

    print("감지된 라벨:")
    for label in labels:
        print(f"- {label.description} (신뢰도: {label.score:.2f})")

    return labels

# 텍스트 감지 테스트
def test_text_detection(client, image_path):
    """이미지에서 텍스트를 감지합니다."""
    print(f"\n=== 텍스트 감지 테스트: {image_path} ===")

    image, _ = load_image(image_path)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if texts:
        print(f"감지된 전체 텍스트: {texts[0].description[:100]}...")
        print(f"감지된 텍스트 수: {len(texts)}")
    else:
        print("감지된 텍스트 없음")

    return texts

# 객체 감지 테스트
def test_object_detection(client, image_path):
    """이미지에서 객체를 감지합니다."""
    print(f"\n=== 객체 감지 테스트: {image_path} ===")

    image, _ = load_image(image_path)
    response = client.object_localization(image=image)
    objects = response.localized_object_annotations

    print(f"감지된 객체 수: {len(objects)}")
    for obj in objects:
        print(f"- {obj.name} (신뢰도: {obj.score:.2f})")

    return objects

# 탄소 발자국 분석 시뮬레이션
def simulate_carbon_footprint_analysis(labels, objects):
    """라벨과 객체를 기반으로 탄소 발자국 분석을 시뮬레이션합니다."""
    print("\n=== 탄소 발자국 분석 시뮬레이션 ===")

    # 간단한 탄소 지표 (실제 앱에서는 더 정교한 모델 사용)
    carbon_indicators = {
        "car": 120,  # 예시 CO2 값 (g/km)
        "vehicle": 100,
        "truck": 200,
        "factory": 500,
        "plastic": 80,
        "paper": 30,
        "tree": -20,  # 탄소 감소 항목은 음수 값
        "forest": -100,
        "plant": -10,
        "solar panel": -50,
        "wind turbine": -80,
    }

    # 탄소 영향 분석
    carbon_impact = []
    total_score = 0

    # 라벨 확인
    if labels:
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

    # 객체 확인
    if objects:
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

    # 전체 평가
    if total_score < -50:
        assessment = "매우 긍정적 - 탄소 감소"
    elif total_score < 0:
        assessment = "긍정적 - 약간의 탄소 감소"
    elif total_score < 50:
        assessment = "중립적 - 제한된 탄소 영향"
    elif total_score < 150:
        assessment = "부정적 - 중간 수준의 탄소 발자국"
    else:
        assessment = "매우 부정적 - 높은 탄소 발자국"

    print(f"총 탄소 점수: {total_score:.2f}")
    print(f"평가: {assessment}")

    if carbon_impact:
        print("\n탄소 영향 세부 정보:")
        for impact in carbon_impact:
            print(f"- {impact['item']}: {impact['carbon_value']} (신뢰도: {impact['confidence']:.2f}, 가중 영향: {impact['weighted_impact']:.2f})")
    else:
        print("탄소 영향 세부 정보 없음")

    return {
        "carbon_impact_details": carbon_impact,
        "total_carbon_score": total_score,
        "assessment": assessment
    }

# 메인 함수
def main():
    """메인 테스트 함수"""
    print("Google Vision API 테스트 시작")

    # 샘플 이미지 다운로드
    download_sample_images()

    # Vision API 클라이언트 초기화
    client = init_vision_client()
    if not client:
        print("Vision API 클라이언트 초기화 실패. 종료합니다.")
        return

    # 각 샘플 이미지에 대해 테스트 실행
    for image in SAMPLE_IMAGES:
        image_path = os.path.join("samples", image["name"])
        print(f"\n\n========== {image['description']} 테스트 ==========")

        # 라벨 감지
        labels = test_label_detection(client, image_path)

        # 텍스트 감지
        texts = test_text_detection(client, image_path)

        # 객체 감지
        objects = test_object_detection(client, image_path)

        # 탄소 발자국 분석 시뮬레이션
        carbon_analysis = simulate_carbon_footprint_analysis(labels, objects)

        print("\n")

    print("Google Vision API 테스트 완료")

if __name__ == "__main__":
    main()
