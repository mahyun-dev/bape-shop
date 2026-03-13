/**
 * 상품 데이터 (샘플)
 */

export const categories = [
  { id: 'all', name: '전체' },
  { id: 'device', name: '기기' },
  { id: 'disposable', name: '일회용' },
  { id: 'pod', name: '팟' },
  { id: 'liquid', name: '액상' },
  { id: 'coil', name: '코일' },
  { id: 'battery', name: '배터리' },
  { id: 'accessory', name: '액세서리' }
];

export const products = [
  // 기기
  {
    id: 'dev001',
    name: '에어프로 X 스타터 키트',
    category: 'device',
    price: 89000,
    originalPrice: 99000,
    discount: 10,
    rating: 4.8,
    reviewCount: 342,
    image: 'https://placehold.co/800x800/111827/ffffff?text=AIRPRO+X+KIT',
    images: [
      'https://placehold.co/800x800/111827/ffffff?text=AIRPRO+X+KIT',
      'https://placehold.co/800x800/1f2937/ffffff?text=AIRPRO+X+SIDE',
      'https://placehold.co/800x800/374151/ffffff?text=AIRPRO+X+BOX'
    ],
    description: '입문자와 숙련자 모두에게 적합한 컴팩트 전자담배 키트입니다.',
    features: [
      '최대 출력 30W',
      '자동 흡입 인식',
      'USB-C 고속 충전',
      '0.8ohm/1.0ohm 코일 호환',
      '누수 방지 설계'
    ],
    stock: 45,
    isNew: true,
    isHot: true,
    deliveryFee: 0,
    deliveryTime: '1-2일'
  },
  {
    id: 'dev002',
    name: '클라우드 맥스 60 모드',
    category: 'device',
    price: 129000,
    originalPrice: 149000,
    discount: 13,
    rating: 4.9,
    reviewCount: 567,
    image: 'https://placehold.co/800x800/0f172a/e2e8f0?text=CLOUD+MAX+60',
    images: [
      'https://placehold.co/800x800/0f172a/e2e8f0?text=CLOUD+MAX+60',
      'https://placehold.co/800x800/1e293b/e2e8f0?text=CLOUD+MAX+CHIPSET'
    ],
    description: '듀얼 배터리 기반의 고출력 모드형 기기로 풍부한 무화량을 제공합니다.',
    features: [
      '최대 출력 60W',
      '0.96인치 OLED 화면',
      '온도 제어 모드 지원',
      '배터리 잔량 이중 표시',
      '안전 보호 칩셋 탑재'
    ],
    stock: 32,
    isNew: false,
    isHot: true,
    deliveryFee: 0,
    deliveryTime: '1-2일'
  },
  // 일회용
  {
    id: 'dis001',
    name: '브리즈 바 15000 퍼프',
    category: 'disposable',
    price: 23000,
    originalPrice: 29000,
    discount: 21,
    rating: 4.6,
    reviewCount: 234,
    image: 'https://placehold.co/800x800/064e3b/ecfeff?text=BREEZE+BAR+15000',
    images: [
      'https://placehold.co/800x800/064e3b/ecfeff?text=BREEZE+BAR+15000',
      'https://placehold.co/800x800/065f46/ecfeff?text=MANGO+ICE'
    ],
    description: '휴대성이 뛰어난 일회용 기기로 진한 맛 표현과 긴 사용 시간을 제공합니다.',
    features: [
      '최대 15000 퍼프',
      'USB-C 충전 지원',
      '니코틴 솔트 0.98%',
      '메쉬 코일 탑재',
      '12가지 맛 구성'
    ],
    stock: 120,
    isNew: true,
    isHot: false,
    deliveryFee: 0,
    deliveryTime: '1-2일'
  },
  {
    id: 'dis002',
    name: '네오 미니 6000 퍼프',
    category: 'disposable',
    price: 15900,
    originalPrice: 19900,
    discount: 20,
    rating: 4.7,
    reviewCount: 189,
    image: 'https://placehold.co/800x800/1d4ed8/f8fafc?text=NEO+MINI+6000',
    images: [
      'https://placehold.co/800x800/1d4ed8/f8fafc?text=NEO+MINI+6000',
      'https://placehold.co/800x800/2563eb/f8fafc?text=BLUEBERRY+MINT'
    ],
    description: '작은 크기와 안정적인 흡압감을 갖춘 가성비 일회용 전자담배입니다.',
    features: [
      '최대 6000 퍼프',
      '전용 메쉬 코어',
      '가벼운 42g',
      '즉시 사용 가능',
      '8가지 인기 맛'
    ],
    stock: 85,
    isNew: false,
    isHot: false,
    deliveryFee: 0,
    deliveryTime: '2-3일'
  },
  // 팟
  {
    id: 'pod001',
    name: '에어프로 리필 팟 3개입 (0.8ohm)',
    category: 'pod',
    price: 12900,
    originalPrice: 14900,
    discount: 13,
    rating: 4.5,
    reviewCount: 156,
    image: 'https://placehold.co/800x800/334155/e2e8f0?text=AIRPRO+POD+0.8',
    images: [
      'https://placehold.co/800x800/334155/e2e8f0?text=AIRPRO+POD+0.8',
      'https://placehold.co/800x800/475569/e2e8f0?text=ANTI+LEAK+POD'
    ],
    description: '선명한 맛 표현을 제공하는 교체형 리필 팟 세트입니다.',
    features: [
      '3개입 패키지',
      '탑필 방식',
      '투명 액상창',
      '누수 방지 실링',
      '에어프로 X 호환'
    ],
    stock: 67,
    isNew: false,
    isHot: true,
    deliveryFee: 0,
    deliveryTime: '2-3일'
  },
  // 액상
  {
    id: 'liq001',
    name: '솔트 액상 알파카 - 피치아이스 30ml',
    category: 'liquid',
    price: 17900,
    originalPrice: 22000,
    discount: 19,
    rating: 4.9,
    reviewCount: 892,
    image: 'https://placehold.co/800x800/f97316/fff7ed?text=PEACH+ICE+30ML',
    images: [
      'https://placehold.co/800x800/f97316/fff7ed?text=PEACH+ICE+30ML',
      'https://placehold.co/800x800/ea580c/fff7ed?text=NIC+9.8MG'
    ],
    description: '상큼한 복숭아 향과 시원한 쿨링이 조화로운 데일리 솔트 액상입니다.',
    features: [
      '용량 30ml',
      '니코틴 9.8mg',
      'VG/PG 50:50',
      '깔끔한 단맛 밸런스',
      '밀봉 실링 캡'
    ],
    stock: 234,
    isNew: false,
    isHot: true,
    deliveryFee: 0,
    deliveryTime: '1-2일'
  },
  {
    id: 'liq002',
    name: '솔트 액상 벨라 - 타바코 클래식 30ml',
    category: 'liquid',
    price: 18500,
    originalPrice: 23000,
    discount: 20,
    rating: 4.7,
    reviewCount: 645,
    image: 'https://placehold.co/800x800/92400e/fffbeb?text=TOBACCO+CLASSIC+30ML',
    images: [
      'https://placehold.co/800x800/92400e/fffbeb?text=TOBACCO+CLASSIC+30ML',
      'https://placehold.co/800x800/b45309/fffbeb?text=SMOOTH+FINISH'
    ],
    description: '은은한 시가 향과 깊은 바디감을 가진 클래식 계열 액상입니다.',
    features: [
      '용량 30ml',
      '니코틴 9.8mg',
      'VG/PG 50:50',
      '드라이 타바코 노트',
      '재구매율 높은 스테디셀러'
    ],
    stock: 178,
    isNew: false,
    isHot: false,
    deliveryFee: 0,
    deliveryTime: '1-2일'
  },
  // 코일
  {
    id: 'coil001',
    name: '메쉬 코일 M1 0.6ohm 5개입',
    category: 'coil',
    price: 12000,
    originalPrice: 15000,
    discount: 20,
    rating: 4.8,
    reviewCount: 1234,
    image: 'https://placehold.co/800x800/3f3f46/f4f4f5?text=M1+MESH+COIL+0.6',
    images: [
      'https://placehold.co/800x800/3f3f46/f4f4f5?text=M1+MESH+COIL+0.6',
      'https://placehold.co/800x800/52525b/f4f4f5?text=5+PACK'
    ],
    description: '빠른 예열과 안정적인 맛 표현이 장점인 메쉬 코일 패키지입니다.',
    features: [
      '5개입',
      '권장 출력 18-23W',
      '유기농 코튼 사용',
      '호환 탱크 다수',
      '번인 방지 구조'
    ],
    stock: 456,
    isNew: false,
    isHot: true,
    deliveryFee: 0,
    deliveryTime: '1-2일'
  },
  {
    id: 'bat001',
    name: '18650 배터리 3000mAh 2개입',
    category: 'battery',
    price: 15000,
    originalPrice: 18000,
    discount: 17,
    rating: 4.6,
    reviewCount: 567,
    image: 'https://placehold.co/800x800/7c2d12/fff1f2?text=18650+BATTERY+2PACK',
    images: [
      'https://placehold.co/800x800/7c2d12/fff1f2?text=18650+BATTERY+2PACK',
      'https://placehold.co/800x800/9a3412/fff1f2?text=3000mAh'
    ],
    description: '안정적인 출력 유지에 적합한 고용량 배터리 세트입니다.',
    features: [
      '3000mAh 용량',
      '고방전 지원',
      '안전 보호 회로',
      '2개입 구성',
      '보관 케이스 포함'
    ],
    stock: 289,
    isNew: false,
    isHot: false,
    deliveryFee: 0,
    deliveryTime: '1-2일'
  },
  // 액세서리
  {
    id: 'acc001',
    name: '휴대용 전자담배 파우치',
    category: 'accessory',
    price: 18900,
    originalPrice: 23900,
    discount: 22,
    rating: 4.7,
    reviewCount: 234,
    image: 'https://placehold.co/800x800/0c4a6e/f0f9ff?text=VAPE+POUCH',
    images: [
      'https://placehold.co/800x800/0c4a6e/f0f9ff?text=VAPE+POUCH',
      'https://placehold.co/800x800/075985/f0f9ff?text=SHOCKPROOF+CASE'
    ],
    description: '기기와 액상, 코일을 한 번에 수납할 수 있는 방수 파우치입니다.',
    features: [
      '생활 방수 원단',
      '분리 수납 포켓',
      '충격 완화 패드',
      '가벼운 120g',
      '지퍼 이중 잠금'
    ],
    stock: 145,
    isNew: true,
    isHot: false,
    deliveryFee: 0,
    deliveryTime: '2-3일'
  },
  // 추가 상품
  {
    id: 'pod002',
    name: '클라우드 맥스 전용 팟 2개입 (1.0ohm)',
    category: 'pod',
    price: 10900,
    originalPrice: 13900,
    discount: 24,
    rating: 4.5,
    reviewCount: 178,
    image: 'https://placehold.co/800x800/1f2937/f8fafc?text=CLOUD+POD+1.0',
    images: [
      'https://placehold.co/800x800/1f2937/f8fafc?text=CLOUD+POD+1.0',
      'https://placehold.co/800x800/374151/f8fafc?text=POD+2PACK'
    ],
    description: '클라우드 맥스 시리즈에 최적화된 교체형 팟 세트입니다.',
    features: [
      '2개입',
      '1.0ohm 저전력 코일',
      '팟당 2ml',
      '하부 누수 차단',
      '밀폐 보관 케이스 제공'
    ],
    stock: 98,
    isNew: false,
    isHot: false,
    deliveryFee: 0,
    deliveryTime: '1-2일'
  },
  {
    id: 'coil002',
    name: '세라믹 코일 C2 1.2ohm 4개입',
    category: 'coil',
    price: 13900,
    originalPrice: 17500,
    discount: 24,
    rating: 4.8,
    reviewCount: 267,
    image: 'https://placehold.co/800x800/312e81/e0e7ff?text=C2+CERAMIC+COIL',
    images: [
      'https://placehold.co/800x800/312e81/e0e7ff?text=C2+CERAMIC+COIL',
      'https://placehold.co/800x800/4338ca/e0e7ff?text=4+PACK'
    ],
    description: '짙은 향 액상에 강하고 수명이 긴 세라믹 타입 코일입니다.',
    features: [
      '4개입',
      '권장 출력 10-14W',
      '맛 유지력 향상',
      '탄맛 최소화 구조',
      '팟형 기기 최적화'
    ],
    stock: 74,
    isNew: true,
    isHot: false,
    deliveryFee: 0,
    deliveryTime: '2-3일'
  }
];

// 베스트 상품 (평점 높은 순)
export function getBestProducts(limit = 8) {
  return [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// 신상품
export function getNewProducts(limit = 8) {
  return products.filter(p => p.isNew).slice(0, limit);
}

// 인기 상품
export function getHotProducts(limit = 8) {
  return products.filter(p => p.isHot).slice(0, limit);
}

// 할인 상품
export function getDiscountProducts(limit = 8) {
  return [...products]
    .filter(p => p.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);
}

// 카테고리별 상품
export function getProductsByCategory(categoryId) {
  if (categoryId === 'all') {
    return products;
  }
  return products.filter(p => p.category === categoryId);
}

// 상품 검색
export function searchProducts(query) {
  if (!query) return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}

// 추천 상품 (랜덤)
export function getRecommendedProducts(excludeId, limit = 4) {
  const filtered = products.filter(p => p.id !== excludeId);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export default {
  categories,
  products,
  getBestProducts,
  getNewProducts,
  getHotProducts,
  getDiscountProducts,
  getProductsByCategory,
  searchProducts,
  getRecommendedProducts
};
