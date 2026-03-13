/**
 * 상품 상세 페이지 & 장바구니 페이지
 */

import { products, getRecommendedProducts } from '../../data/products.js';
import store from '../store.js';
import router from '../router.js';
import { formatPrice } from '../utils/helpers.js';
import { showSuccess } from '../components/toast.js';
import { createStarRating, renderProductGrid } from '../components/productCard.js';
import { confirm } from '../components/modal.js';

// ===== 상품 상세 =====
export function renderProductDetailPage(params) {
  const product = products.find(p => p.id === params.id);
  
  if (!product) {
    router.navigate('/404');
    return;
  }
  
  const app = document.getElementById('app');
  const isInWishlist = store.isInWishlist(product.id);
  
  app.innerHTML = `
    <div class="product-detail">
      <div class="container">
        <div class="product-detail-grid">
          <!-- 상품 이미지 -->
          <div class="product-gallery">
            <img src="${product.images[0]}" alt="${product.name}" class="main-image" id="mainImage">
            <div class="thumbnail-list">
              ${product.images.map((img, i) => `
                <img src="${img}" class="thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}">
              `).join('')}
            </div>
          </div>
          
          <!-- 상품 정보 -->
          <div class="product-detail-info">
            <div class="product-meta">
              <span>⭐ ${product.rating}</span>
              <span>리뷰 ${product.reviewCount}개</span>
            </div>
            
            <h1 class="product-title">${product.name}</h1>
            
            <div class="product-price-section">
              ${product.originalPrice ? `
                <div class="text-secondary text-sm mb-2">
                  <del>${formatPrice(product.originalPrice)}</del>
                  <span class="badge badge-error ml-2">${product.discount}% 할인</span>
                </div>
              ` : ''}
              <div class="text-3xl font-bold text-brand mb-4">${formatPrice(product.price)}</div>
              
              <div class="quantity-selector">
                <label class="font-medium">수량</label>
                <div class="flex items-center gap-2">
                  <button class="quantity-btn" id="decreaseBtn">-</button>
                  <input type="number" class="quantity-input" id="quantityInput" value="1" min="1" max="${product.stock}">
                  <button class="quantity-btn" id="increaseBtn">+</button>
                </div>
              </div>
            </div>
            
            <div class="flex gap-3 mb-6">
              <button class="btn btn-outline flex-1" id="wishlistBtn">
                ${isInWishlist ? '❤️' : '🤍'} 찜하기
              </button>
              <button class="btn btn-primary flex-1" id="addCartBtn">
                🛒 장바구니
              </button>
              <button class="btn btn-primary flex-1" id="buyNowBtn">
                구매하기
              </button>
            </div>
            
            <div class="product-description" style="border-top: 1px solid var(--border-color); padding-top: var(--space-6);">
              <h3 class="font-bold mb-3">상품 설명</h3>
              <p>${product.description}</p>
              
              <h3 class="font-bold mt-6 mb-3">상품 특징</h3>
              <ul style="list-style: disc; padding-left: var(--space-6);">
                ${product.features.map(f => `<li class="mb-2">${f}</li>`).join('')}
              </ul>
              
              <div class="mt-6 p-4 bg-secondary rounded-lg text-sm">
                <p><strong>📦 배송비:</strong> ${product.deliveryFee === 0 ? '무료' : formatPrice(product.deliveryFee)}</p>
                <p class="mt-2"><strong>🚚 배송 예정:</strong> ${product.deliveryTime}</p>
                <p class="mt-2"><strong>📦 재고:</strong> ${product.stock}개</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 추천 상품 -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold mb-6">이런 상품은 어떠세요?</h2>
          <div class="grid grid-cols-4" id="recommendedProducts"></div>
        </div>
      </div>
    </div>
  `;
  
  // 추천 상품 렌더링
  const recommended = getRecommendedProducts(product.id, 4);
  renderProductGrid(recommended, document.getElementById('recommendedProducts'));
  
  setupProductDetailEvents(product);
}

function setupProductDetailEvents(product) {
  let quantity = 1;
  const quantityInput = document.getElementById('quantityInput');
  
  document.getElementById('decreaseBtn')?.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityInput.value = quantity;
    }
  });
  
  document.getElementById('increaseBtn')?.addEventListener('click', () => {
    if (quantity < product.stock) {
      quantity++;
      quantityInput.value = quantity;
    }
  });
  
  quantityInput?.addEventListener('change', (e) => {
    quantity = Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1));
    e.target.value = quantity;
  });
  
  // 썸네일 클릭
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      document.getElementById('mainImage').src = thumb.src;
    });
  });
  
  // 찜하기
  document.getElementById('wishlistBtn')?.addEventListener('click', () => {
    store.toggleWishlist(product);
    showSuccess(store.isInWishlist(product.id) ? '위시리스트에 추가되었습니다' : '위시리스트에서 제거되었습니다');
    renderProductDetailPage({ id: product.id });
  });
  
  // 장바구니
  document.getElementById('addCartBtn')?.addEventListener('click', () => {
    store.addToCart(product, quantity);
    showSuccess('장바구니에 추가되었습니다');
  });
  
  // 바로 구매
  document.getElementById('buyNowBtn')?.addEventListener('click', () => {
    store.addToCart(product, quantity);
    router.navigate('/cart');
  });
}

// ===== 장바구니 페이지 =====
export function renderCartPage() {
  const app = document.getElementById('app');
  const cartItems = store.getCartItems();
  const total = store.getCartTotal();
  
  app.innerHTML = `
    <div class="cart-page">
      <div class="container">
        <h1 class="text-3xl font-bold mb-8">장바구니</h1>
        
        <div class="cart-grid">
          <!-- 장바구니 아이템 -->
          <div>
            ${cartItems.length === 0 ? `
              <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h3 class="empty-title">장바구니가 비어있습니다</h3>
                <p class="empty-description">상품을 담아보세요!</p>
                <button class="btn btn-primary" id="goShopBtn">쇼핑하러 가기</button>
              </div>
            ` : `
              ${cartItems.map(item => `
                <div class="cart-item">
                  <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                  <div class="cart-item-info">
                    <h3 class="font-semibold mb-2">${item.name}</h3>
                    <p class="text-primary font-bold">${formatPrice(item.price)}</p>
                  </div>
                  <div class="cart-item-actions">
                    <div class="quantity-selector">
                      <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                      <input type="number" class="quantity-input" value="${item.quantity}" min="1" style="width: 60px;" readonly>
                      <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="btn btn-ghost btn-sm" data-action="remove" data-id="${item.id}">삭제</button>
                  </div>
                </div>
              `).join('')}
            `}
          </div>
          
          <!-- 주문 요약 -->
          ${cartItems.length > 0 ? `
            <div class="cart-summary">
              <h3 class="text-xl font-bold mb-4">주문 요약</h3>
              <div class="summary-row">
                <span>상품 금액</span>
                <span>${formatPrice(total)}</span>
              </div>
              <div class="summary-row">
                <span>배송비</span>
                <span>${total >= 50000 ? '무료' : formatPrice(3000)}</span>
              </div>
              <div class="summary-row summary-total">
                <span class="font-bold">총 결제금액</span>
                <span class="text-2xl font-bold text-brand">${formatPrice(total >= 50000 ? total : total + 3000)}</span>
              </div>
              <button class="btn btn-primary btn-full btn-lg mt-6" id="checkoutBtn">주문하기</button>
              <p class="text-xs text-center text-tertiary mt-4">
                ${total < 50000 ? `${formatPrice(50000 - total)} 더 담으면 무료배송!` : '무료배송 적용!'}
              </p>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  setupCartEvents();
}

function setupCartEvents() {
  document.getElementById('goShopBtn')?.addEventListener('click', () => {
    router.navigate('/products');
  });
  
  document.querySelectorAll('[data-action="decrease"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = store.getCartItems().find(i => i.id === id);
      if (item) {
        store.updateCartQuantity(id, item.quantity - 1);
        renderCartPage();
      }
    });
  });
  
  document.querySelectorAll('[data-action="increase"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = store.getCartItems().find(i => i.id === id);
      if (item) {
        store.updateCartQuantity(id, item.quantity + 1);
        renderCartPage();
      }
    });
  });
  
  document.querySelectorAll('[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const confirmed = await confirm('삭제', '장바구니에서 삭제하시겠습니까?');
      if (confirmed) {
        store.removeFromCart(id);
        renderCartPage();
        showSuccess('삭제되었습니다');
      }
    });
  });
  
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    router.navigate('/checkout');
  });
}
