/**
 * Header 컴포넌트
 */

import store from '../store.js';
import router from '../router.js';
import authManager from '../auth.js';
import { categories } from '../../data/products.js';
import { debounce } from '../utils/helpers.js';

export function renderHeader() {
  const header = document.getElementById('header');
  const user = authManager.getCurrentUser();
  const cartCount = store.getCartCount();
  
  header.innerHTML = `
    <!-- Header Top -->
    <div class="header-top">
      <div class="container">
        <div class="header-top-content">
          <div class="text-sm">
            ⚡ 신규 회원 가입 시 10% 할인 쿠폰 즉시 지급!
          </div>
          <div class="flex gap-4 text-sm">
            ${user ? `
              <span>👤 ${user.name}님</span>
              <a href="/mypage" data-link>마이페이지</a>
              <a href="#" id="logoutBtn">로그아웃</a>
            ` : `
              <a href="/login" data-link>로그인</a>
              <a href="/register" data-link>회원가입</a>
            `}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Header Main -->
    <div class="header-main">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <a href="/" class="logo" data-link>VAPE LAB</a>
          
          <!-- Search Bar -->
          <div class="search-bar">
            <input 
              type="text" 
              class="search-input" 
              id="searchInput"
              placeholder="상품을 검색하세요..." 
              autocomplete="off"
            />
            <button class="search-btn" id="searchBtn">
              🔍
            </button>
          </div>
          
          <!-- Header Actions -->
          <div class="header-actions">
            <a href="/wishlist" class="header-icon-btn" data-link>
              <span style="font-size: 24px;">❤️</span>
              <span class="text-xs">위시리스트</span>
            </a>
            <a href="/cart" class="header-icon-btn" data-link style="position: relative;">
              <span style="font-size: 24px;">🛒</span>
              <span class="text-xs">장바구니</span>
              ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 이벤트 리스너
  setupHeaderEvents();
  
  // 스토어 구독 - 장바구니 변경 시 헤더 업데이트
  store.subscribe('cart', () => {
    renderHeader();
  });
  
  store.subscribe('user', () => {
    renderHeader();
  });
}

function setupHeaderEvents() {
  // 로그아웃
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      authManager.logout();
      router.navigate('/');
    });
  }
  
  // 검색
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  if (searchInput && searchBtn) {
    const handleSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        router.navigate(`/products?search=${encodeURIComponent(query)}`);
      }
    };
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
  
  // 링크 클릭 처리 (SPA 라우팅)
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('href');
      router.navigate(path);
    });
  });
}

export function renderNavigation() {
  const nav = document.getElementById('navigation');
  
  nav.innerHTML = `
    <div class="container">
      <div class="nav-list">
        ${categories.map(cat => `
          <a href="/products?category=${cat.id}" class="nav-item" data-link data-category="${cat.id}">
            ${cat.name}
          </a>
        `).join('')}
      </div>
    </div>
  `;
  
  // 현재 카테고리 하이라이트
  const currentCategory = router.getQueryParam('category') || 'all';
  const activeItem = nav.querySelector(`[data-category="${currentCategory}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
  
  // 링크 클릭 처리
  nav.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('href');
      router.navigate(path);
    });
  });
}

export default {
  renderHeader,
  renderNavigation
};
