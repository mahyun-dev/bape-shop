/**
 * 홈 페이지
 */

import { getBestProducts, getNewProducts, getHotProducts } from '../../data/products.js';
import { renderProductGrid } from '../components/productCard.js';
import router from '../router.js';

export function renderHomePage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">전자담배 샵</h1>
        <p class="hero-subtitle">프리미엄 전자담배의 새로운 기준</p>
        <button class="btn btn-lg" id="heroShopBtn" style="background: white; color: var(--primary-color);">
          쇼핑하러 가기 →
        </button>
      </div>
    </section>
    
    <!-- New Products -->
    <section class="section">
      <div class="container">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">🆕 신상품</h2>
          <a href="/products?filter=new" class="text-primary font-medium" data-link>전체보기 →</a>
        </div>
        <div class="grid grid-cols-4" id="newProducts"></div>
      </div>
    </section>
    
    <!-- Hot Products -->
    <section class="section" style="background: var(--bg-secondary);">
      <div class="container">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">🔥 인기상품</h2>
          <a href="/products?filter=hot" class="text-primary font-medium" data-link>전체보기 →</a>
        </div>
        <div class="grid grid-cols-4" id="hotProducts"></div>
      </div>
    </section>
    
    <!-- Best Products -->
    <section class="section">
      <div class="container">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">⭐ 베스트상품</h2>
          <a href="/products?filter=best" class="text-primary font-medium" data-link>전체보기 →</a>
        </div>
        <div class="grid grid-cols-4" id="bestProducts"></div>
      </div>
    </section>
    
    <!-- Features -->
    <section class="section" style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%);">
      <div class="container text-center">
        <h2 class="text-3xl font-bold mb-8 text-white">왜 전자담배 샵을 선택해야 할까요?</h2>
        <div class="grid grid-cols-4 gap-8">
          <div class="card p-6">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">🚚</div>
            <h3 class="text-xl font-bold mb-2">빠른 배송</h3>
            <p class="text-secondary text-sm">주문 후 1-2일 내 배송</p>
          </div>
          <div class="card p-6">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">🔒</div>
            <h3 class="text-xl font-bold mb-2">안전한 결제</h3>
            <p class="text-secondary text-sm">SSL 보안 인증서 적용</p>
          </div>
          <div class="card p-6">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">📦</div>
            <h3 class="text-xl font-bold mb-2">무료 배송</h3>
            <p class="text-secondary text-sm">5만원 이상 구매 시</p>
          </div>
          <div class="card p-6">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">💯</div>
            <h3 class="text-xl font-bold mb-2">품질 보증</h3>
            <p class="text-secondary text-sm">100% 정품 보장</p>
          </div>
        </div>
      </div>
    </section>
  `;
  
  // 상품 렌더링
  renderProductGrid(getNewProducts(4), document.getElementById('newProducts'));
  renderProductGrid(getHotProducts(4), document.getElementById('hotProducts'));
  renderProductGrid(getBestProducts(4), document.getElementById('bestProducts'));
  
  // 이벤트 리스너
  document.getElementById('heroShopBtn')?.addEventListener('click', () => {
    router.navigate('/products');
  });
  
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(link.getAttribute('href'));
    });
  });
}
