/**
 * 상품 카드 컴포넌트
 */

import store from '../store.js';
import router from '../router.js';
import { showSuccess } from './toast.js';
import { formatPrice } from '../utils/helpers.js';

export function createProductCard(product) {
  const isInWishlist = store.isInWishlist(product.id);

  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image-wrapper">
      <img 
        src="${product.image}" 
        alt="${product.name}" 
        class="product-image"
        loading="lazy"
      />
      <div class="product-badges">
        ${product.isNew ? '<span class="badge badge-new">NEW</span>' : ''}
        ${product.isHot ? '<span class="badge badge-hot">HOT</span>' : ''}
        ${product.discount > 0 ? `<span class="badge badge-error">${product.discount}%</span>` : ''}
      </div>
      <button class="product-wishlist ${isInWishlist ? 'active' : ''}" data-product-id="${product.id}">
        ${isInWishlist ? '❤️' : '🤍'}
      </button>
    </div>
    
    <div class="product-info">
      <div class="product-category">${getCategoryName(product.category)}</div>
      <h3 class="product-name">${product.name}</h3>
      
      <div class="product-rating">
        <div class="rating">
          ${createStarRating(product.rating)}
        </div>
        <span class="text-tertiary">(${product.reviewCount})</span>
      </div>
      
      <div class="product-price">
        <span class="price-current">${formatPrice(product.price)}</span>
        ${product.originalPrice ? `
          <span class="price-original">${formatPrice(product.originalPrice)}</span>
        ` : ''}
      </div>
    </div>
    
    <div class="product-actions">
      <button class="btn btn-outline btn-sm flex-1" data-action="add-cart" data-product-id="${product.id}">
        🛒 담기
      </button>
      <button class="btn btn-primary btn-sm flex-1" data-action="view-detail" data-product-id="${product.id}">
        상세보기
      </button>
    </div>
  `;

  // 이벤트 리스너
  setupProductCardEvents(card, product);

  return card;
}

function setupProductCardEvents(card, product) {
  // 위시리스트 토글
  const wishlistBtn = card.querySelector('.product-wishlist');
  wishlistBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    store.toggleWishlist(product);

    const isInWishlist = store.isInWishlist(product.id);
    wishlistBtn.innerHTML = isInWishlist ? '❤️' : '🤍';
    wishlistBtn.classList.toggle('active', isInWishlist);

    showSuccess(isInWishlist ? '위시리스트에 추가되었습니다' : '위시리스트에서 제거되었습니다', 2000);
  });

  // 장바구니 추가
  const addCartBtn = card.querySelector('[data-action="add-cart"]');
  addCartBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    store.addToCart(product);
    showSuccess('장바구니에 추가되었습니다', 2000);
  });

  // 상세보기
  const viewDetailBtn = card.querySelector('[data-action="view-detail"]');
  viewDetailBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    router.navigate(`/product/${product.id}`);
  });

  // 카드 전체 클릭 시 상세페이지로
  card.addEventListener('click', () => {
    router.navigate(`/product/${product.id}`);
  });
}

export function createStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star filled">★</span>';
  }
  if (hasHalfStar) {
    stars += '<span class="star filled">★</span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="star">★</span>';
  }

  return stars;
}

function getCategoryName(categoryId) {
  const categories = {
    device: '기기',
    disposable: '일회용',
    pod: '팟',
    liquid: '액상',
    coil: '코일',
    battery: '배터리',
    accessory: '액세서리'
  };
  return categories[categoryId] || '기타';
}

export function renderProductGrid(products, container) {
  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">📦</div>
        <h3 class="empty-title">상품이 없습니다</h3>
        <p class="empty-description">검색 조건을 변경해보세요</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

export default {
  createProductCard,
  renderProductGrid,
  createStarRating
};
