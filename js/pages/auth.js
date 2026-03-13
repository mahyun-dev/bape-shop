/**
 * 로그인 & 회원가입 페이지
 */

import authManager from '../auth.js';
import router from '../router.js';
import { showSuccess, showError } from '../components/toast.js';
import { validateEmailField, validatePasswordMatch, validatePhoneField } from '../utils/validation.js';

// ===== 로그인 페이지 =====
export function renderLoginPage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container py-16">
      <div class="card" style="max-width: 500px; margin: 0 auto; padding: var(--space-8);">
        <h1 class="text-3xl font-bold text-center mb-8">로그인</h1>
        
        <form id="loginForm">
          <div class="input-group">
            <label class="input-label required">이메일</label>
            <input type="email" class="input" id="loginEmail" placeholder="이메일을 입력하세요" required>
          </div>
          
          <div class="input-group">
            <label class="input-label required">비밀번호</label>
            <input type="password" class="input" id="loginPassword" placeholder="비밀번호를 입력하세요" required>
          </div>
          
          <div class="flex items-center mb-6">
            <input type="checkbox" id="saveEmail" class="checkbox">
            <label for="saveEmail" class="text-sm text-secondary ml-2" style="cursor: pointer;">아이디 저장</label>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full btn-lg mb-4">로그인</button>

          <div class="text-right mb-4">
            <a href="/forgot-password" class="text-sm text-primary" data-link>아이디 찾기</a>
          </div>

          <div class="text-right mb-4">
            <a href="/forgot-password" class="text-sm text-primary" data-link>비밀번호 찾기</a>
          </div>
          
          <div class="text-center text-sm">
            <span class="text-secondary">계정이 없으신가요?</span>
            <a href="/register" class="text-brand font-medium" data-link>회원가입</a>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // 저장된 이메일 불러오기
  const savedEmail = localStorage.getItem('savedEmail');
  const emailInput = document.getElementById('loginEmail');
  const saveEmailCheckbox = document.getElementById('saveEmail');
  
  if (savedEmail) {
    emailInput.value = savedEmail;
    saveEmailCheckbox.checked = true;
  }
  
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // 아이디 저장 처리
    if (saveEmailCheckbox.checked) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }
    
    const result = authManager.login(email, password);
    if (result.success) {
      showSuccess(result.message);
      router.navigate('/');
    } else {
      showError(result.message);
    }
  });
  
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(link.getAttribute('href'));
    });
  });
}

// ===== 회원가입 페이지 =====
export function renderRegisterPage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container py-16">
      <div class="card" style="max-width: 600px; margin: 0 auto; padding: var(--space-8);">
        <h1 class="text-3xl font-bold text-center mb-8">회원가입</h1>
        
        <form id="registerForm">
          <div class="input-group">
            <label class="input-label required">이메일</label>
            <input type="email" class="input" id="regEmail" placeholder="example@email.com" required>
            <span class="input-help">로그인 시 사용할 이메일입니다</span>
          </div>
          
          <div class="input-group">
            <label class="input-label required">비밀번호</label>
            <input type="password" class="input" id="regPassword" placeholder="8자 이상 입력하세요" required>
            <span class="input-help">영문, 숫자, 특수문자 중 3가지 이상 조합</span>
          </div>
          
          <div class="input-group">
            <label class="input-label required">비밀번호 확인</label>
            <input type="password" class="input" id="regPasswordConfirm" placeholder="비밀번호를 다시 입력하세요" required>
          </div>
          
          <div class="input-group">
            <label class="input-label required">이름</label>
            <input type="text" class="input" id="regName" placeholder="이름을 입력하세요" required>
          </div>
          
          <div class="input-group">
            <label class="input-label required">전화번호</label>
            <input type="tel" class="input" id="regPhone" placeholder="010-1234-5678" required>
          </div>
          
          <div class="input-group">
            <label class="input-label required">생년월일 (만 19세 이상)</label>
            <input type="date" class="input" id="regBirthdate" required max="${getMaxBirthdate()}">
            <span class="input-help">성인 인증을 위해 필요합니다</span>
          </div>
          
          <div class="input-group">
            <label class="flex items-center gap-2">
              <input type="checkbox" id="agreeTerms" required>
              <span class="text-sm">이용약관 및 개인정보처리방침에 동의합니다 (필수)</span>
            </label>
          </div>
          
          <div class="input-group">
            <label class="flex items-center gap-2">
              <input type="checkbox" id="agreeAge" required>
              <span class="text-sm">만 19세 이상입니다 (필수)</span>
            </label>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full btn-lg mb-4">회원가입</button>
          
          <div class="text-center text-sm">
            <span class="text-secondary">이미 계정이 있으신가요?</span>
            <a href="/login" class="text-brand font-medium" data-link>로그인</a>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const birthdate = document.getElementById('regBirthdate').value;
    
    // 비밀번호 확인
    if (password !== passwordConfirm) {
      showError('비밀번호가 일치하지 않습니다');
      return;
    }
    
    const result = authManager.register({
      email,
      password,
      name,
      phone,
      birthdate
    });
    
    if (result.success) {
      showSuccess(result.message);
      router.navigate('/login');
    } else {
      showError(result.message);
    }
  });
  
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(link.getAttribute('href'));
    });
  });
}

function getMaxBirthdate() {
  const today = new Date();
  const year = today.getFullYear() - 19;
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===== 마이페이지 =====
export function renderMyPage() {
  const user = authManager.getCurrentUser();
  
  if (!user) {
    router.navigate('/login');
    return;
  }
  
  const app = document.getElementById('app');
  const orders = store.getOrders();
  const wishlist = store.getWishlist();
  
  app.innerHTML = `
    <div class="container py-8">
      <h1 class="text-3xl font-bold mb-8">마이페이지</h1>
      
      <div class="grid grid-cols-3 gap-6">
        <!-- 회원 정보 -->
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-4">👤 회원 정보</h2>
          <div class="mb-3">
            <span class="text-secondary text-sm">이름</span>
            <p class="font-medium">${user.name}</p>
          </div>
          <div class="mb-3">
            <span class="text-secondary text-sm">이메일</span>
            <p class="font-medium">${user.email}</p>
          </div>
          <div class="mb-3">
            <span class="text-secondary text-sm">전화번호</span>
            <p class="font-medium">${user.phone}</p>
          </div>
          <div class="mb-3">
            <span class="text-secondary text-sm">포인트</span>
            <p class="font-medium text-brand">${user.points || 0}P</p>
          </div>
        </div>
        
        <!-- 주문 내역 -->
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-4">📦 주문 내역</h2>
          <div class="text-center py-8">
            <div class="text-5xl mb-4">{orders.length}</div>
            <p class="text-secondary">총 주문</p >
          </div>
        </div>
        
        <!-- 위시리스트 -->
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-4">❤️ 위시리스트</h2>
          <div class="text-center py-8">
            <div class="text-5xl mb-4">${wishlist.length}</div>
            <p class="text-secondary">찜한 상품</p>
          </div>
          <button class="btn btn-outline btn-full mt-4" id="viewWishlistBtn">보러가기</button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('viewWishlistBtn')?.addEventListener('click', () => {
    router.navigate('/wishlist');
  });
}
