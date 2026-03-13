/**
 * 보안 유틸리티 모듈
 * XSS, CSRF, Injection 공격 방어
 */

// XSS 방어: HTML 이스케이프
export function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

// HTML 언이스케이프
export function unescapeHtml(text) {
  if (typeof text !== 'string') return text;
  
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };
  
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, (entity) => map[entity]);
}

// 안전한 HTML 삽입 (sanitize)
export function sanitizeHtml(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

// CSRF 토큰 생성
export function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// CSRF 토큰 검증
export function validateCSRFToken(token) {
  const storedToken = sessionStorage.getItem('csrf_token');
  return token === storedToken;
}

// CSRF 토큰 초기화
export function initCSRFToken() {
  if (!sessionStorage.getItem('csrf_token')) {
    const token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
  }
}

// 안전한 JSON 파싱
export function safeJSONParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('JSON 파싱 오류:', e);
    return defaultValue;
  }
}

// SQL Injection 방지용 문자열 검증
export function isSafeString(str) {
  // 위험한 SQL 키워드 패턴 검사
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(;|\-\-|\/\*|\*\/|xp_|sp_)/gi,
    /(union|having|group\s+by)/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(str));
}

// 입력값 검증 및 정제
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // 앞뒤 공백 제거
  let sanitized = input.trim();
  
  // 다중 공백을 단일 공백으로
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // 특수문자 제한 (필요에 따라 조정)
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized;
}

// 비밀번호 강도 검증
export function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;
  
  return {
    isValid: score >= 3 && password.length >= minLength,
    score: score,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
}

// 이메일 검증
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 전화번호 검증 (한국)
export function validatePhone(phone) {
  const re = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return re.test(phone.replace(/\s/g, ''));
}

// 안전한 로컬스토리지 저장 (암호화)
export function secureSetItem(key, value) {
  try {
    // 간단한 Base64 인코딩 (실제 프로덕션에서는 더 강력한 암호화 사용)
    const encoded = btoa(JSON.stringify(value));
    localStorage.setItem(key, encoded);
    return true;
  } catch (e) {
    console.error('저장 오류:', e);
    return false;
  }
}

// 안전한 로컬스토리지 읽기 (복호화)
export function secureGetItem(key, defaultValue = null) {
  try {
    const encoded = localStorage.getItem(key);
    if (!encoded) return defaultValue;
    
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('읽기 오류:', e);
    return defaultValue;
  }
}

// 세션 타임아웃 체크
export function checkSessionTimeout(lastActivityKey = 'last_activity') {
  const timeoutMinutes = 30;
  const lastActivity = localStorage.getItem(lastActivityKey);
  
  if (!lastActivity) {
    updateLastActivity(lastActivityKey);
    return false;
  }
  
  const now = Date.now();
  const diff = now - parseInt(lastActivity);
  const isTimeout = diff > timeoutMinutes * 60 * 1000;
  
  if (isTimeout) {
    // 세션 만료 처리
    localStorage.removeItem(lastActivityKey);
    return true;
  }
  
  updateLastActivity(lastActivityKey);
  return false;
}

// 마지막 활동 시간 업데이트
export function updateLastActivity(lastActivityKey = 'last_activity') {
  localStorage.setItem(lastActivityKey, Date.now().toString());
}

// Rate Limiting (간단한 구현)
const rateLimitMap = new Map();

export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };
  
  if (now > record.resetTime) {
    // 시간 윈도우 리셋
    record.count = 0;
    record.resetTime = now + windowMs;
  }
  
  record.count++;
  rateLimitMap.set(key, record);
  
  return record.count <= maxAttempts;
}

// 브루트포스 공격 방지
export function isLoginAttemptAllowed(userId) {
  const key = `login_attempt_${userId}`;
  return checkRateLimit(key, 5, 300000); // 5분에 5번까지
}

// DOM 기반 XSS 방어
export function createSafeElement(tagName, attributes = {}, textContent = '') {
  const element = document.createElement(tagName);
  
  // 안전한 속성만 설정
  const safeAttributes = ['class', 'id', 'data-', 'aria-', 'role', 'type', 'placeholder', 'value', 'name'];
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (safeAttributes.some(safe => key.startsWith(safe))) {
      element.setAttribute(key, escapeHtml(String(value)));
    }
  });
  
  if (textContent) {
    element.textContent = textContent;
  }
  
  return element;
}

// 클릭재킹 방지 확인
export function preventClickjacking() {
  if (window.self !== window.top) {
    // iframe 내부에 있음
    window.top.location = window.self.location;
  }
}

// 민감정보 마스킹
export function maskSensitiveData(data, type = 'phone') {
  if (!data) return '';
  
  switch (type) {
    case 'phone':
      // 010-1234-5678 -> 010-****-5678
      return data.replace(/(\d{3})-?(\d{3,4})-?(\d{4})/, '$1-****-$3');
    case 'email':
      // test@example.com -> t***@example.com
      const [local, domain] = data.split('@');
      return `${local[0]}${'*'.repeat(local.length - 1)}@${domain}`;
    case 'card':
      // 1234-5678-9012-3456 -> 1234-****-****-3456
      return data.replace(/(\d{4})-?(\d{4})-?(\d{4})-?(\d{4})/, '$1-****-****-$4');
    default:
      return data;
  }
}

// 보안 초기화
export function initSecurity() {
  // CSRF 토큰 초기화
  initCSRFToken();
  
  // 클릭재킹 방지
  preventClickjacking();
  
  // 세션 타임아웃 체크
  setInterval(() => {
    if (checkSessionTimeout()) {
      // 세션 만료 시 로그아웃 처리
      window.dispatchEvent(new CustomEvent('session:timeout'));
    }
  }, 60000); // 1분마다 체크
  
  // 활동 감지
  ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, () => updateLastActivity(), { passive: true });
  });
}

export default {
  escapeHtml,
  unescapeHtml,
  sanitizeHtml,
  generateCSRFToken,
  validateCSRFToken,
  initCSRFToken,
  safeJSONParse,
  isSafeString,
  sanitizeInput,
  validatePasswordStrength,
  validateEmail,
  validatePhone,
  secureSetItem,
  secureGetItem,
  checkSessionTimeout,
  updateLastActivity,
  checkRateLimit,
  isLoginAttemptAllowed,
  createSafeElement,
  preventClickjacking,
  maskSensitiveData,
  initSecurity
};
