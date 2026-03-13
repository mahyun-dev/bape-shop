/**
 * 인증 관리 모듈
 */

import store from './store.js';
import { validateEmail, validatePasswordStrength, isLoginAttemptAllowed } from './utils/security.js';
import { generateId } from './utils/helpers.js';

class AuthManager {
  constructor() {
    this.users = this.loadUsers();
  }
  
  // 로컬스토리지에서 사용자 목록 로드
  loadUsers() {
    const saved = localStorage.getItem('users_db');
    return saved ? JSON.parse(saved) : [];
  }
  
  // 사용자 목록 저장
  saveUsers() {
    localStorage.setItem('users_db', JSON.stringify(this.users));
  }
  
  // 회원가입
  register(userData) {
    const { email, password, name, phone, birthdate } = userData;
    
    // 이메일 중복 체크
    if (this.users.find(u => u.email === email)) {
      return {
        success: false,
        message: '이미 사용 중인 이메일입니다.'
      };
    }
    
    // 이메일 검증
    if (!validateEmail(email)) {
      return {
        success: false,
        message: '올바른 이메일 형식이 아닙니다.'
      };
    }
    
    // 비밀번호 강도 검증
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return {
        success: false,
        message: '비밀번호는 최소 8자 이상, 영문/숫자/특수문자 중 3가지 이상 조합이어야 합니다.'
      };
    }
    
    // 나이 검증 (만 19세 이상)
    const age = this.calculateAge(birthdate);
    if (age < 19) {
      return {
        success: false,
        message: '만 19세 이상만 가입 가능합니다.'
      };
    }
    
    // 사용자 생성
    const newUser = {
      id: generateId(),
      email,
      password: this.hashPassword(password), // 실제로는 더 강력한 해싱 필요
      name,
      phone,
      birthdate,
      createdAt: new Date().toISOString(),
      points: 0,
      grade: 'bronze'
    };
    
    this.users.push(newUser);
    this.saveUsers();
    
    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: this.sanitizeUser(newUser)
    };
  }
  
  // 로그인
  login(email, password) {
    // Rate Limiting 체크
    if (!isLoginAttemptAllowed(email)) {
      return {
        success: false,
        message: '로그인 시도 횟수가 초과되었습니다. 5분 후 다시 시도해주세요.'
      };
    }
    
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      return {
        success: false,
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
      };
    }
    
    if (user.password !== this.hashPassword(password)) {
      return {
        success: false,
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
      };
    }
    
    // 로그인 성공
    const sanitizedUser = this.sanitizeUser(user);
    store.login(sanitizedUser);
    
    return {
      success: true,
      message: '로그인되었습니다.',
      user: sanitizedUser
    };
  }
  
  // 로그아웃
  logout() {
    store.logout();
    return {
      success: true,
      message: '로그아웃되었습니다.'
    };
  }
  
  // 비밀번호 변경
  changePassword(userId, currentPassword, newPassword) {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      };
    }
    
    if (user.password !== this.hashPassword(currentPassword)) {
      return {
        success: false,
        message: '현재 비밀번호가 일치하지 않습니다.'
      };
    }
    
    const passwordCheck = validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
      return {
        success: false,
        message: '비밀번호는 최소 8자 이상, 영문/숫자/특수문자 중 3가지 이상 조합이어야 합니다.'
      };
    }
    
    user.password = this.hashPassword(newPassword);
    this.saveUsers();
    
    return {
      success: true,
      message: '비밀번호가 변경되었습니다.'
    };
  }
  
  // 회원 정보 수정
  updateProfile(userId, updates) {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      };
    }
    
    // 허용된 필드만 업데이트
    const allowedFields = ['name', 'phone', 'address', 'addressDetail', 'postalCode'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });
    
    this.saveUsers();
    
    // 스토어의 사용자 정보도 업데이트
    store.updateUser(this.sanitizeUser(user));
    
    return {
      success: true,
      message: '회원 정보가 수정되었습니다.',
      user: this.sanitizeUser(user)
    };
  }
  
  // 회원 탈퇴
  deleteAccount(userId, password) {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      };
    }
    
    if (user.password !== this.hashPassword(password)) {
      return {
        success: false,
        message: '비밀번호가 일치하지 않습니다.'
      };
    }
    
    this.users = this.users.filter(u => u.id !== userId);
    this.saveUsers();
    store.clearAllData();
    
    return {
      success: true,
      message: '회원 탈퇴가 완료되었습니다.'
    };
  }
  
  // 간단한 비밀번호 해싱 (실제로는 bcrypt 등 사용 필요)
  hashPassword(password) {
    // 데모용 간단한 해싱 (실제 프로덕션에서는 절대 사용 금지)
    return btoa(password + 'salt_key_here');
  }
  
  // 나이 계산
  calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
  
  // 민감한 정보 제거
  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
  
  // 현재 로그인한 사용자 조회
  getCurrentUser() {
    return store.getCurrentUser();
  }
  
  // 로그인 여부 확인
  isLoggedIn() {
    return store.isLoggedIn();
  }
}

// 싱글톤 인스턴스 생성
const authManager = new AuthManager();

export default authManager;
