/**
 * 헬퍼 유틸리티 함수
 */

// 날짜 포맷팅
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// 상대 시간 표시 (몇 분 전, 몇 시간 전 등)
export function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000); // 초 단위
  
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
  return `${Math.floor(diff / 31536000)}년 전`;
}

// 숫자 포맷팅 (천 단위 콤마)
export function formatNumber(number) {
  return new Intl.NumberFormat('ko-KR').format(number);
}

// 가격 포맷팅
export function formatPrice(price) {
  return `${formatNumber(price)}원`;
}

// 할인율 계산
export function calculateDiscountPercent(originalPrice, salePrice) {
  return Math.round((1 - salePrice / originalPrice) * 100);
}

// 디바운스
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 쓰로틀
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 딥 클론
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// UUID 생성 (간단한 버전)
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 쿼리 스트링 파싱
export function parseQueryString(search = window.location.search) {
  const params = new URLSearchParams(search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

// 쿼리 스트링 생성
export function buildQueryString(params) {
  return new URLSearchParams(params).toString();
}

// 배열 청크 (페이지네이션용)
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// 배열 섞기 (Fisher-Yates)
export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 객체에서 특정 키만 선택
export function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

// 객체에서 특정 키 제외
export function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

// 로컬 스토리지 용량 확인
export function getStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2); // KB 단위
}

// 이미지 레이지 로딩
export function lazyLoadImages(selector = 'img[data-src]') {
  const images = document.querySelectorAll(selector);
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// 스크롤 최상단 이동 (부드럽게)
export function scrollToTop(smooth = true) {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

// 특정 요소로 스크롤
export function scrollToElement(selector, offset = 0) {
  const element = document.querySelector(selector);
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
}

// 클립보드 복사
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('클립보드 복사 실패:', err);
    return false;
  }
}

// 파일 크기 포맷팅
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 랜덤 문자열 생성
export function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// CSS 클래스 토글
export function toggleClass(element, className, force) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  if (element) {
    element.classList.toggle(className, force);
  }
}

// 여러 요소에 이벤트 리스너 추가
export function addEventListeners(selectors, eventType, handler, options) {
  const elements = typeof selectors === 'string' 
    ? document.querySelectorAll(selectors) 
    : selectors;
    
  elements.forEach(element => {
    element.addEventListener(eventType, handler, options);
  });
}

// 커스텀 이벤트 발생
export function emit(eventName, detail = {}) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

// 커스텀 이벤트 리스너
export function on(eventName, handler) {
  window.addEventListener(eventName, handler);
}

// 커스텀 이벤트 리스너 제거
export function off(eventName, handler) {
  window.removeEventListener(eventName, handler);
}

// 모바일 여부 확인
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 터치 디바이스 여부 확인
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Sleep 함수
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 전화번호 포맷팅
export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
}

// 카드번호 포맷팅
export function formatCardNumber(card) {
  const cleaned = card.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
  }
  return card;
}

export default {
  formatDate,
  timeAgo,
  formatNumber,
  formatPrice,
  calculateDiscountPercent,
  debounce,
  throttle,
  deepClone,
  generateId,
  parseQueryString,
  buildQueryString,
  chunk,
  shuffle,
  pick,
  omit,
  getStorageSize,
  lazyLoadImages,
  scrollToTop,
  scrollToElement,
  copyToClipboard,
  formatFileSize,
  randomString,
  toggleClass,
  addEventListeners,
  emit,
  on,
  off,
  isMobile,
  isTouchDevice,
  sleep,
  formatPhoneNumber,
  formatCardNumber
};
