/**
 * 메인 애플리케이션 진입점
 */

import router from './router.js';
import store from './store.js';
import { initSecurity } from './utils/security.js';
import { products } from '../data/products.js';
import { renderHeader, renderNavigation } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { showSuccess } from './components/toast.js';

// 페이지 임포트
import { renderHomePage } from './pages/home.js';
import { renderProductsPage } from './pages/products.js';
import { renderProductDetailPage, renderCartPage } from './pages/detail-cart.js';
import { renderLoginPage, renderRegisterPage, renderMyPage } from './pages/auth.js';

// ===== 앱 초기화 =====
class App {
  constructor() {
    this.initialized = false;
  }
  
  async init() {
    if (this.initialized) return;
    
    console.log('🚀 Vape Shop 앱 시작...');
    
    // 보안 초기화
    initSecurity();
    console.log('✅ 보안 초기화 완료');
    
    // 상품 데이터 로드
    store.setProducts(products);
    console.log(`✅ 상품 데이터 로드 (${products.length}개)`);
    
    // 연령 인증 체크
    this.checkAgeVerification();
    
    // 공통 컴포넌트 렌더링
    renderHeader();
    renderNavigation();
    renderFooter();
    console.log('✅ 공통 컴포넌트 렌더링');
    
    // 라우트 등록
    this.registerRoutes();
    console.log('✅ 라우트 등록 완료');
    
    // 라우터 시작
    router.start();
    console.log('✅ 라우터 시작');
    
    // 전역 이벤트 리스너
    this.setupGlobalListeners();
    
    this.initialized = true;
    console.log('✅ 앱 초기화 완료!');
    
    // 로딩 오버레이 제거
    this.hideLoading();
  }
  
  registerRoutes() {
    // 홈
    router.register('/', (params) => {
      renderHomePage();
      window.scrollTo(0, 0);
    });
    
    // 상품 목록
    router.register('/products', (params) => {
      renderProductsPage(params);
      renderNavigation(); // 네비게이션 업데이트
      window.scrollTo(0, 0);
    });
    
    // 상품 상세
    router.register('/product/:id', (params) => {
      renderProductDetailPage(params);
      window.scrollTo(0, 0);
    });
    
    // 장바구니
    router.register('/cart', () => {
      renderCartPage();
      window.scrollTo(0, 0);
    });
    
    // 결제
    router.register('/checkout', () => {
      if (!authManager.isLoggedIn()) {
        showError('로그인이 필요합니다');
        router.navigate('/login');
        return;
      }
      this.renderCheckoutPage();
      window.scrollTo(0, 0);
    });
    
    // 위시리스트
    router.register('/wishlist', () => {
      this.renderWishlistPage();
      window.scrollTo(0, 0);
    });
    
    // 로그인
    router.register('/login', () => {
      if (authManager.isLoggedIn()) {
        router.navigate('/');
        return;
      }
      renderLoginPage();
      window.scrollTo(0, 0);
    });
    
    // 회원가입
    router.register('/register', () => {
      if (authManager.isLoggedIn()) {
        router.navigate('/');
        return;
      }
      renderRegisterPage();
      window.scrollTo(0, 0);
    });
    
    // 마이페이지
    router.register('/mypage', () => {
      if (!authManager.isLoggedIn()) {
        router.navigate('/login');
        return;
      }
      renderMyPage();
      window.scrollTo(0, 0);
    });
    
    // 404
    router.register('/404', () => {
      this.render404Page();
    });
  }
  
  setupGlobalListeners() {
    // 스토어 변경 감지
    store.subscribe('user', () => {
      renderHeader();
    });
    
    store.subscribe('cart', () => {
      renderHeader();
    });
    
    // 라우트 변경 감지
    window.addEventListener('route:change', () => {
      this.hideLoading();
    });
  }
  
  checkAgeVerification() {
    const isVerified = store.isAgeVerified();
    
    if (!isVerified) {
      this.showAgeVerification();
    }
  }
  
  showAgeVerification() {
    const overlay = document.getElementById('ageVerification');
    overlay.style.display = 'flex';
    
    document.getElementById('ageYes')?.addEventListener('click', () => {
      store.setAgeVerified(true);
      overlay.style.display = 'none';
      showSuccess('연령 인증이 완료되었습니다');
    });
    
    document.getElementById('ageNo')?.addEventListener('click', () => {
      alert('만 19세 미만은 이용할 수 없습니다.\n창을 닫습니다.');
      window.close();
    });
  }
  
  showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'flex';
  }
  
  hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
  }
  
  renderWishlistPage() {
    const app = document.getElementById('app');
    const wishlist = store.getWishlist();
    
    app.innerHTML = `
      <div class="container py-8">
        <h1 class="text-3xl font-bold mb-8">❤️ 위시리스트</h1>
        ${wishlist.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">❤️</div>
            <h3 class="empty-title">위시리스트가 비어있습니다</h3>
            <p class="empty-description">마음에 드는 상품을 담아보세요!</p>
            <button class="btn btn-primary" onclick="router.navigate('/products')">쇼핑하러 가기</button>
          </div>
        ` : `
          <div class="grid grid-cols-4" id="wishlistGrid"></div>
        `}
      </div>
    `;
    
    if (wishlist.length > 0) {
      import('./components/productCard.js').then(({ renderProductGrid }) => {
        renderProductGrid(wishlist, document.getElementById('wishlistGrid'));
      });
    }
  }
  
  renderCheckoutPage() {
    const app = document.getElementById('app');
    const cartItems = store.getCartItems();
    const total = store.getCartTotal();
    const user = authManager.getCurrentUser();
    
    if (cartItems.length === 0) {
      router.navigate('/cart');
      return;
    }
    
    app.innerHTML = `
      <div class="container py-8">
        <h1 class="text-3xl font-bold mb-8">주문/결제</h1>
        
        <div class="grid grid-cols-3 gap-8">
          <div style="grid-column: span 2;">
            <!-- 배송 정보 -->
            <div class="card p-6 mb-6">
              <h2 class="text-xl font-bold mb-4">배송 정보</h2>
              <form id="checkoutForm">
                <div class="input-group">
                  <label class="input-label required">받는 분</label>
                  <input type="text" class="input" id="receiverName" value="${user.name}" required>
                </div>
                <div class="input-group">
                  <label class="input-label required">휴대폰</label>
                  <input type="tel" class="input" id="receiverPhone" value="${user.phone}" required>
                </div>
                <div class="input-group">
                  <label class="input-label required">우편번호</label>
                  <input type="text" class="input" id="postalCode" placeholder="12345" required>
                </div>
                <div class="input-group">
                  <label class="input-label required">주소</label>
                  <input type="text" class="input" id="address" placeholder="주소를 입력하세요" required>
                </div>
                <div class="input-group">
                  <label class="input-label">상세주소</label>
                  <input type="text" class="input" id="addressDetail" placeholder="상세주소를 입력하세요">
                </div>
                <div class="input-group">
                  <label class="input-label">배송 메모</label>
                  <textarea class="input textarea" id="deliveryMemo" placeholder="배송 시 요청사항을 입력하세요"></textarea>
                </div>
              </form>
            </div>
            
            <!-- 결제 수단 -->
            <div class="card p-6">
              <h2 class="text-xl font-bold mb-4">결제 수단</h2>
              <div class="flex flex-col gap-3">
                <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                  <input type="radio" name="payment" value="card" checked>
                  <span>💳 신용/체크카드</span>
                </label>
                <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                  <input type="radio" name="payment" value="bank">
                  <span>🏦 무통장입금</span>
                </label>
                <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                  <input type="radio" name="payment" value="phone">
                  <span>📱 휴대폰 결제</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 주문 요약 -->
          <div>
            <div class="card p-6">
              <h2 class="text-xl font-bold mb-4">주문 요약</h2>
              <div class="mb-4">
                ${cartItems.map(item => `
                  <div class="flex justify-between mb-2 text-sm">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                  </div>
                `).join('')}
              </div>
              <div class="divider"></div>
              <div class="flex justify-between mb-2">
                <span>상품 금액</span>
                <span>${formatPrice(total)}</span>
              </div>
              <div class="flex justify-between mb-4">
                <span>배송비</span>
                <span>${total >= 50000 ? '무료' : formatPrice(3000)}</span>
              </div>
              <div class="divider"></div>
              <div class="flex justify-between items-center mb-6">
                <span class="font-bold">총 결제금액</span>
                <span class="text-2xl font-bold text-brand">${formatPrice(total >= 50000 ? total : total + 3000)}</span>
              </div>
              <button class="btn btn-primary btn-full btn-lg" id="paymentBtn">
                ${formatPrice(total >= 50000 ? total : total + 3000)} 결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('paymentBtn')?.addEventListener('click', () => {
      this.processPayment();
    });
  }
  
  async processPayment() {
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
      showError('배송 정보를 모두 입력해주세요');
      return;
    }
    
    this.showLoading();
    
    // 결제 시뮬레이션 (2초 대기)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderData = {
      receiverName: document.getElementById('receiverName').value,
      receiverPhone: document.getElementById('receiverPhone').value,
      postalCode: document.getElementById('postalCode').value,
      address: document.getElementById('address').value,
      addressDetail: document.getElementById('addressDetail').value,
      deliveryMemo: document.getElementById('deliveryMemo').value,
      payment: document.querySelector('input[name="payment"]:checked').value
    };
    
    const order = store.createOrder(orderData);
    
    this.hideLoading();
    showSuccess('주문이 완료되었습니다!');
    
    // 주문 완료 페이지로 이동
    router.navigate('/');
  }
  
  render404Page() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="empty-state" style="padding: var(--space-20) var(--space-4);">
        <div class="empty-icon">😵</div>
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <h3 class="empty-title">페이지를 찾을 수 없습니다</h3>
        <p class="empty-description">요청하신 페이지가 존재하지 않습니다</p>
        <button class="btn btn-primary" onclick="router.navigate('/')">홈으로 가기</button>
      </div>
    `;
  }
}

// authManager import 추가
import authManager from './auth.js';
import { showError } from './components/toast.js';
import { formatPrice } from './utils/helpers.js';

// 앱 인스턴스 생성 및 시작
const app = new App();

// DOM이 준비되면 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
} else {
  app.init();
}

// 전역 접근을 위해 window에 등록 (디버깅용)
window.app = app;
window.router = router;
window.store = store;

export default app;
