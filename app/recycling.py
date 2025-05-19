"""
재활용 분류 및 분리수거 추천 시스템
"""

class RecyclingClassifier:
    def __init__(self):
        # 재질별 분류 데이터베이스
        self.material_database = self._initialize_material_database()
        
        # 재활용 규칙 데이터베이스
        self.recycling_rules = self._initialize_recycling_rules()
        
        # 복합 재질 처리 규칙
        self.composite_rules = self._initialize_composite_rules()
    
    def _initialize_material_database(self):
        """
        재질별 분류 데이터베이스 초기화
        키워드와 해당 재질을 매핑합니다.
        """
        return {
            # 플라스틱 관련 키워드
            "plastic": {
                "category": "plastic",
                "keywords": [
                    "plastic", "pet bottle", "plastic bottle", "plastic container", 
                    "plastic bag", "plastic cup", "plastic packaging", "plastic wrap",
                    "polyethylene", "polypropylene", "polystyrene", "pvc", "vinyl",
                    "플라스틱", "페트병", "비닐", "플라스틱 용기", "플라스틱 컵"
                ],
                "recyclable": True,
                "preparation": "내용물을 비우고 헹구어 라벨을 제거하세요."
            },
            
            # 종이 관련 키워드
            "paper": {
                "category": "paper",
                "keywords": [
                    "paper", "cardboard", "carton", "box", "newspaper", "magazine",
                    "book", "paper bag", "paper cup", "paper packaging",
                    "종이", "종이컵", "종이봉투", "상자", "박스", "신문", "잡지", "책"
                ],
                "recyclable": True,
                "preparation": "테이프, 스테이플러 등 이물질을 제거하고 접어서 배출하세요."
            },
            
            # 유리 관련 키워드
            "glass": {
                "category": "glass",
                "keywords": [
                    "glass", "glass bottle", "glass jar", "glass container",
                    "유리", "유리병", "유리잔", "유리 용기"
                ],
                "recyclable": True,
                "preparation": "내용물을 비우고 헹구어 라벨과 뚜껑을 제거하세요."
            },
            
            # 금속(캔) 관련 키워드
            "metal": {
                "category": "metal",
                "keywords": [
                    "metal", "can", "aluminum", "steel", "tin", "metal container",
                    "metal cap", "metal lid", "foil",
                    "금속", "캔", "알루미늄", "철", "양철", "금속 용기", "포일"
                ],
                "recyclable": True,
                "preparation": "내용물을 비우고 헹구어 가능한 압축하세요."
            },
            
            # 음식물 쓰레기 관련 키워드
            "food_waste": {
                "category": "food_waste",
                "keywords": [
                    "food", "food waste", "organic waste", "fruit", "vegetable",
                    "meat", "fish", "leftover", "peel", "shell",
                    "음식물", "음식물 쓰레기", "과일", "채소", "고기", "생선", "음식 찌꺼기"
                ],
                "recyclable": True,
                "preparation": "물기를 최대한 제거하고 음식물 쓰레기 전용 봉투나 용기에 담아 배출하세요."
            },
            
            # 일반 쓰레기 관련 키워드
            "general_waste": {
                "category": "general_waste",
                "keywords": [
                    "trash", "garbage", "waste", "styrofoam", "disposable", "diaper",
                    "cigarette", "dust", "dirt", "broken", "damaged",
                    "쓰레기", "일반 쓰레기", "스티로폼", "일회용", "기저귀", "담배", "먼지", "흙", "깨진", "손상된"
                ],
                "recyclable": False,
                "preparation": "일반 쓰레기 종량제 봉투에 담아 배출하세요."
            },
            
            # 전자제품 관련 키워드
            "electronics": {
                "category": "electronics",
                "keywords": [
                    "electronics", "electronic device", "battery", "phone", "computer",
                    "appliance", "cable", "charger", "adapter",
                    "전자제품", "전자기기", "배터리", "전화기", "컴퓨터", "가전제품", "케이블", "충전기"
                ],
                "recyclable": True,
                "preparation": "지정된 전자제품 수거함이나 재활용 센터에 배출하세요."
            },
            
            # 의류 및 섬유 관련 키워드
            "textile": {
                "category": "textile",
                "keywords": [
                    "textile", "fabric", "cloth", "clothing", "garment", "shoe",
                    "bag", "leather", "cotton", "wool", "polyester",
                    "의류", "옷", "천", "직물", "신발", "가방", "가죽", "면", "양모", "폴리에스터"
                ],
                "recyclable": True,
                "preparation": "세탁하여 깨끗한 상태로 의류수거함에 배출하세요."
            }
        }
    
    def _initialize_recycling_rules(self):
        """
        재활용 규칙 데이터베이스 초기화
        각 재질별 재활용 가능 여부와 처리 방법을 정의합니다.
        """
        return {
            "plastic": {
                "recyclable": True,
                "bin_color": "파란색",
                "preparation_steps": [
                    "내용물을 완전히 비우고 가볍게 헹굽니다.",
                    "라벨과 뚜껑을 가능한 제거합니다.",
                    "부피를 줄이기 위해 압축합니다.",
                    "플라스틱 분리수거함에 배출합니다."
                ],
                "exceptions": [
                    "오염된 플라스틱은 일반 쓰레기로 배출합니다.",
                    "스티로폼은 별도로 분리하여 배출합니다.",
                    "비닐류는 따로 모아서 비닐 전용 수거함에 배출합니다."
                ]
            },
            "paper": {
                "recyclable": True,
                "bin_color": "초록색",
                "preparation_steps": [
                    "이물질(테이프, 스테이플러 등)을 제거합니다.",
                    "물에 젖지 않도록 합니다.",
                    "접어서 부피를 줄입니다.",
                    "종이 분리수거함에 배출합니다."
                ],
                "exceptions": [
                    "오염된 종이(기름, 음식물 등)는 일반 쓰레기로 배출합니다.",
                    "영수증, 코팅된 종이는 일반 쓰레기로 배출합니다.",
                    "종이팩(우유팩, 주스팩)은 별도로 분리하여 배출합니다."
                ]
            },
            "glass": {
                "recyclable": True,
                "bin_color": "갈색",
                "preparation_steps": [
                    "내용물을 완전히 비우고 가볍게 헹굽니다.",
                    "라벨과 뚜껑을 제거합니다.",
                    "깨지지 않도록 주의하여 유리 분리수거함에 배출합니다."
                ],
                "exceptions": [
                    "깨진 유리는 신문지 등으로 싸서 일반 쓰레기로 배출합니다.",
                    "내열유리, 도자기, 거울은 일반 쓰레기로 배출합니다."
                ]
            },
            "metal": {
                "recyclable": True,
                "bin_color": "노란색",
                "preparation_steps": [
                    "내용물을 완전히 비우고 가볍게 헹굽니다.",
                    "가능한 압축하여 부피를 줄입니다.",
                    "금속 분리수거함에 배출합니다."
                ],
                "exceptions": [
                    "페인트나 유해물질이 묻은 캔은 일반 쓰레기로 배출합니다."
                ]
            },
            "food_waste": {
                "recyclable": True,
                "bin_color": "갈색",
                "preparation_steps": [
                    "물기를 최대한 제거합니다.",
                    "이물질(비닐, 뼈, 조개껍데기 등)을 제거합니다.",
                    "음식물 쓰레기 전용 봉투나 용기에 담아 배출합니다."
                ],
                "exceptions": [
                    "큰 뼈, 조개껍데기, 견과류 껍데기는 일반 쓰레기로 배출합니다.",
                    "과일 씨앗, 옥수수 속대는 일반 쓰레기로 배출합니다."
                ]
            },
            "general_waste": {
                "recyclable": False,
                "bin_color": "검정색",
                "preparation_steps": [
                    "종량제 봉투에 담아 배출합니다."
                ],
                "exceptions": []
            },
            "electronics": {
                "recyclable": True,
                "bin_color": "별도 수거함",
                "preparation_steps": [
                    "개인정보가 포함된 기기는 초기화합니다.",
                    "배터리는 별도로 분리합니다.",
                    "전자제품 수거함이나 재활용 센터에 배출합니다."
                ],
                "exceptions": [
                    "대형 가전제품은 구청에 연락하여 수거 요청합니다."
                ]
            },
            "textile": {
                "recyclable": True,
                "bin_color": "별도 수거함",
                "preparation_steps": [
                    "세탁하여 깨끗한 상태로 준비합니다.",
                    "의류수거함에 배출합니다."
                ],
                "exceptions": [
                    "오염되거나 훼손된 의류는 일반 쓰레기로 배출합니다."
                ]
            }
        }
    
    def _initialize_composite_rules(self):
        """
        복합 재질 처리 규칙 초기화
        여러 재질이 혼합된 경우의 처리 방법을 정의합니다.
        """
        return {
            "plastic+paper": {
                "description": "플라스틱과 종이가 결합된 제품",
                "examples": ["종이 라벨이 붙은 플라스틱 병", "플라스틱 창이 있는 종이 봉투", "종이 상자에 담긴 플라스틱 제품"],
                "separation_method": "가능한 경우 플라스틱과 종이 부분을 분리하여 각각 해당 분리수거함에 배출합니다.",
                "steps": [
                    "플라스틱과 종이 부분을 손으로 분리합니다.",
                    "분리된 플라스틱은 플라스틱 분리수거함에 배출합니다.",
                    "분리된 종이는 종이 분리수거함에 배출합니다.",
                    "분리가 어려운 경우, 주된 재질에 따라 배출합니다."
                ]
            },
            "plastic+metal": {
                "description": "플라스틱과 금속이 결합된 제품",
                "examples": ["금속 뚜껑이 있는 플라스틱 용기", "금속 부품이 있는 플라스틱 장난감"],
                "separation_method": "가능한 경우 플라스틱과 금속 부분을 분리하여 각각 해당 분리수거함에 배출합니다.",
                "steps": [
                    "플라스틱과 금속 부분을 손으로 분리합니다.",
                    "분리된 플라스틱은 플라스틱 분리수거함에 배출합니다.",
                    "분리된 금속은 금속 분리수거함에 배출합니다.",
                    "분리가 어려운 경우, 주된 재질에 따라 배출합니다."
                ]
            },
            "paper+metal": {
                "description": "종이와 금속이 결합된 제품",
                "examples": ["금속 스프링이 있는 노트", "금속 클립이 있는 서류"],
                "separation_method": "가능한 경우 종이와 금속 부분을 분리하여 각각 해당 분리수거함에 배출합니다.",
                "steps": [
                    "종이와 금속 부분을 손으로 분리합니다.",
                    "분리된 종이는 종이 분리수거함에 배출합니다.",
                    "분리된 금속은 금속 분리수거함에 배출합니다.",
                    "분리가 어려운 경우, 주된 재질에 따라 배출합니다."
                ]
            },
            "glass+metal": {
                "description": "유리와 금속이 결합된 제품",
                "examples": ["금속 뚜껑이 있는 유리병", "금속 테두리가 있는 거울"],
                "separation_method": "가능한 경우 유리와 금속 부분을 분리하여 각각 해당 분리수거함에 배출합니다.",
                "steps": [
                    "유리와 금속 부분을 손으로 분리합니다.",
                    "분리된 유리는 유리 분리수거함에 배출합니다.",
                    "분리된 금속은 금속 분리수거함에 배출합니다.",
                    "분리가 어려운 경우, 주된 재질에 따라 배출합니다."
                ]
            },
            "plastic+glass": {
                "description": "플라스틱과 유리가 결합된 제품",
                "examples": ["플라스틱 뚜껑이 있는 유리병", "플라스틱 테두리가 있는 유리 액자"],
                "separation_method": "가능한 경우 플라스틱과 유리 부분을 분리하여 각각 해당 분리수거함에 배출합니다.",
                "steps": [
                    "플라스틱과 유리 부분을 손으로 분리합니다.",
                    "분리된 플라스틱은 플라스틱 분리수거함에 배출합니다.",
                    "분리된 유리는 유리 분리수거함에 배출합니다.",
                    "분리가 어려운 경우, 주된 재질에 따라 배출합니다."
                ]
            },
            "multi_material": {
                "description": "세 가지 이상의 재질이 결합된 복합 제품",
                "examples": ["장난감", "전자제품", "가구"],
                "separation_method": "가능한 경우 각 재질별로 분리하여 해당 분리수거함에 배출합니다.",
                "steps": [
                    "분해 가능한 경우 각 재질별로 분리합니다.",
                    "분리된 각 재질은 해당 분리수거함에 배출합니다.",
                    "분리가 어려운 경우, 대형 폐기물 수거 서비스를 이용하거나 재활용 센터에 문의합니다."
                ]
            }
        }
    
    def classify_materials_from_vision_results(self, labels, objects):
        """
        Vision API 결과에서 재질을 분류합니다.
        """
        detected_materials = {}
        
        # 라벨 분석
        for label in labels:
            label_text = label.description.lower()
            
            # 각 재질 카테고리 확인
            for material_key, material_info in self.material_database.items():
                for keyword in material_info["keywords"]:
                    if keyword.lower() in label_text:
                        if material_key not in detected_materials:
                            detected_materials[material_key] = {
                                "confidence": label.score,
                                "items": [label_text],
                                "info": material_info
                            }
                        else:
                            # 이미 감지된 재질이면 신뢰도가 더 높은 경우 업데이트
                            if label.score > detected_materials[material_key]["confidence"]:
                                detected_materials[material_key]["confidence"] = label.score
                            
                            # 항목 추가
                            if label_text not in detected_materials[material_key]["items"]:
                                detected_materials[material_key]["items"].append(label_text)
        
        # 객체 분석
        for obj in objects:
            obj_name = obj.name.lower()
            
            # 각 재질 카테고리 확인
            for material_key, material_info in self.material_database.items():
                for keyword in material_info["keywords"]:
                    if keyword.lower() in obj_name:
                        if material_key not in detected_materials:
                            detected_materials[material_key] = {
                                "confidence": obj.score,
                                "items": [obj_name],
                                "info": material_info
                            }
                        else:
                            # 이미 감지된 재질이면 신뢰도가 더 높은 경우 업데이트
                            if obj.score > detected_materials[material_key]["confidence"]:
                                detected_materials[material_key]["confidence"] = obj.score
                            
                            # 항목 추가
                            if obj_name not in detected_materials[material_key]["items"]:
                                detected_materials[material_key]["items"].append(obj_name)
        
        return detected_materials
    
    def identify_composite_materials(self, detected_materials):
        """
        감지된 재질 중 복합 재질을 식별합니다.
        """
        composite_pairs = []
        
        # 감지된 재질이 2개 이상인 경우 복합 재질 확인
        if len(detected_materials) >= 2:
            material_keys = list(detected_materials.keys())
            
            # 모든 가능한 재질 쌍 확인
            for i in range(len(material_keys)):
                for j in range(i + 1, len(material_keys)):
                    material1 = material_keys[i]
                    material2 = material_keys[j]
                    
                    # 복합 재질 키 생성 (알파벳 순으로 정렬)
                    composite_key = "+".join(sorted([material1, material2]))
                    
                    # 해당 복합 재질에 대한 규칙이 있는지 확인
                    if composite_key in self.composite_rules:
                        composite_pairs.append({
                            "materials": [material1, material2],
                            "composite_key": composite_key,
                            "rule": self.composite_rules[composite_key]
                        })
                    elif "multi_material" in self.composite_rules:
                        # 특정 복합 재질 규칙이 없으면 일반 복합 재질 규칙 적용
                        composite_pairs.append({
                            "materials": [material1, material2],
                            "composite_key": "multi_material",
                            "rule": self.composite_rules["multi_material"]
                        })
        
        # 3개 이상의 재질이 감지된 경우 multi_material 규칙 추가
        if len(detected_materials) >= 3 and "multi_material" in self.composite_rules:
            composite_pairs.append({
                "materials": list(detected_materials.keys()),
                "composite_key": "multi_material",
                "rule": self.composite_rules["multi_material"]
            })
        
        return composite_pairs
    
    def generate_recycling_recommendations(self, detected_materials, composite_materials):
        """
        재활용 권장사항을 생성합니다.
        """
        recommendations = {
            "recyclable_materials": [],
            "non_recyclable_materials": [],
            "composite_materials": [],
            "general_instructions": "재활용품은 깨끗하게 씻어서 분리배출해 주세요.",
            "detailed_steps": []
        }
        
        # 재활용 가능/불가능 재질 분류
        for material_key, material_data in detected_materials.items():
            material_info = {
                "type": material_key,
                "items": material_data["items"],
                "confidence": material_data["confidence"],
                "bin_color": self.recycling_rules[material_key]["bin_color"] if material_key in self.recycling_rules else "알 수 없음",
                "preparation_steps": self.recycling_rules[material_key]["preparation_steps"] if material_key in self.recycling_rules else []
            }
            
            if material_data["info"]["recyclable"]:
                recommendations["recyclable_materials"].append(material_info)
            else:
                recommendations["non_recyclable_materials"].append(material_info)
        
        # 복합 재질 권장사항 추가
        for composite in composite_materials:
            recommendations["composite_materials"].append({
                "materials": composite["materials"],
                "description": composite["rule"]["description"],
                "separation_method": composite["rule"]["separation_method"],
                "steps": composite["rule"]["steps"]
            })
            
            # 상세 단계에 복합 재질 분리 방법 추가
            for step in composite["rule"]["steps"]:
                if step not in recommendations["detailed_steps"]:
                    recommendations["detailed_steps"].append(step)
        
        # 일반 재활용 단계 추가
        for material in recommendations["recyclable_materials"]:
            for step in material["preparation_steps"]:
                if step not in recommendations["detailed_steps"]:
                    recommendations["detailed_steps"].append(step)
        
        return recommendations
    
    def analyze_image_for_recycling(self, labels, objects):
        """
        이미지 분석 결과를 바탕으로 재활용 분석을 수행합니다.
        """
        # 재질 분류
        detected_materials = self.classify_materials_from_vision_results(labels, objects)
        
        # 복합 재질 식별
        composite_materials = self.identify_composite_materials(detected_materials)
        
        # 재활용 권장사항 생성
        recommendations = self.generate_recycling_recommendations(detected_materials, composite_materials)
        
        return {
            "detected_materials": detected_materials,
            "composite_materials": composite_materials,
            "recommendations": recommendations
        }

# 한국어 재질 이름 변환 함수
def get_korean_material_name(material_type):
    """
    재질 유형의 한국어 이름을 반환합니다.
    """
    material_names = {
        "plastic": "플라스틱",
        "paper": "종이",
        "glass": "유리",
        "metal": "금속/캔",
        "food_waste": "음식물 쓰레기",
        "general_waste": "일반 쓰레기",
        "electronics": "전자제품",
        "textile": "의류/섬유"
    }
    
    return material_names.get(material_type, material_type)
