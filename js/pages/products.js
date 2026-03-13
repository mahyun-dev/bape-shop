/**
 * 상품 목록 페이지
 */

import { products, getProductsByCategory, searchProducts } from '../../data/products.js';
import { renderProductGrid } from '../components/productCard.js';
import router from '../router.js';

export function renderProductsPage(params) {
  const app = document.getElementById('app');
  const category = params.category || 'all';
  const search = params.search || '';
  const filter = params.filter || '';
  
  let displayProducts = [];
  let pageTitle = '전체 상품';
  
  // 필터링
  if (search) {
    displayProducts = searchProducts(search);
    pageTitle = `"${search}" 검색 결과`;
  } else if (filter === 'new') {
    displayProducts = products.filter(p => p.isNew);
    pageTitle = '신상품';
  } else if (filter === 'hot') {
    displayProducts = products.filter(p => p.isHot);
    pageTitle = '인기상품';
  } else if (filter === 'best') {
    displayProducts = [...products].sort((a, b) => b.rating - a.rating);
    pageTitle = '베스트상품';
  } else {
    displayProducts = getProductsByCategory(category);
    if (category !== 'all') {
      const categoryNames = {
        device: '기기',
        disposable: '일회용',
        pod: '팟',
        liquid: '액상',
        coil: '코일',
        battery: '배터리',
        accessory: '액세서리'
      };
      pageTitle = categoryNames[category] || '전체 상품';
    }
  }
  
  app.innerHTML = `
    <div class="container py-8">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <div class="breadcrumb-item">
          <a href="/" class="breadcrumb-link" data-link>홈</a>
        </div>
        <div class="breadcrumb-item">
          <span>${pageTitle}</span>
        </div>
      </div>
      
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold mb-2">${pageTitle}</h1>
          <p class="text-secondary">총 ${displayProducts.length}개의 상품</p>
        </div>
        
        <!-- Sort -->
        <select class="input" id="sortSelect" style="width: 200px;">
          <option value="newest">최신순</option>
          <option value="popular">인기순</option>
          <option value="price-low">낮은 가격순</option>
          <option value="price-high">높은 가격순</option>
          <option value="rating">평점순</option>
        </select>
      </div>
      
      <!-- Products Grid -->
      <div class="grid grid-cols-4" id="productsGrid"></div>
    </div>
  `;
  
  // 초기 렌더링
  renderProducts(displayProducts);
  
  // 정렬 이벤트
  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    const sorted = sortProducts(displayProducts, e.target.value);
    renderProducts(sorted);
  });
  
  // 링크 처리
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(link.getAttribute('href'));
    });
  });
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  renderProductGrid(products, grid);
}

function sortProducts(products, sortType) {
  const sorted = [...products];
  
  switch (sortType) {
    case 'newest':
      return sorted.sort((a, b) => b.isNew - a.isNew);
    case 'popular':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}
