/**
 * 입력 검증 유틸리티
 */

import { validateEmail, validatePhone, sanitizeInput } from './security.js';

// 필수 필드 검증
export function validateRequired(value, fieldName = '필드') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return {
      isValid: false,
      message: `${fieldName}은(는) 필수 입력 항목입니다.`
    };
  }
  return { isValid: true };
}

// 최소 길이 검증
export function validateMinLength(value, minLength, fieldName = '필드') {
  if (value.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName}은(는) 최소 ${minLength}자 이상이어야 합니다.`
    };
  }
  return { isValid: true };
}

// 최대 길이 검증
export function validateMaxLength(value, maxLength, fieldName = '필드') {
  if (value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName}은(는) 최대 ${maxLength}자까지 입력 가능합니다.`
    };
  }
  return { isValid: true };
}

// 숫자 범위 검증
export function validateRange(value, min, max, fieldName = '값') {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) {
    return {
      isValid: false,
      message: `${fieldName}은(는) ${min}에서 ${max} 사이여야 합니다.`
    };
  }
  return { isValid: true };
}

// 이메일 검증 (with message)
export function validateEmailField(email) {
  if (!email) {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }
  if (!validateEmail(email)) {
    return { isValid: false, message: '올바른 이메일 형식이 아닙니다.' };
  }
  return { isValid: true };
}

// 전화번호 검증 (with message)
export function validatePhoneField(phone) {
  if (!phone) {
    return { isValid: false, message: '전화번호를 입력해주세요.' };
  }
  if (!validatePhone(phone)) {
    return { isValid: false, message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)' };
  }
  return { isValid: true };
}

// 비밀번호 확인 검증
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: '비밀번호가 일치하지 않습니다.'
    };
  }
  return { isValid: true };
}

// 주민등록번호 뒷자리로 성인 인증 (선택적)
export function validateAdultBirthdate(birthdate) {
  // birthdate: YYYY-MM-DD 형식
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < 19) {
    return {
      isValid: false,
      message: '만 19세 이상만 이용 가능합니다.'
    };
  }
  return { isValid: true };
}

// 우편번호 검증
export function validatePostalCode(code) {
  const re = /^\d{5}$/;
  if (!re.test(code)) {
    return {
      isValid: false,
      message: '올바른 우편번호 형식이 아닙니다. (5자리 숫자)'
    };
  }
  return { isValid: true };
}

// 카드번호 검증 (Luhn 알고리즘)
export function validateCardNumber(number) {
  const cleaned = number.replace(/\s|-/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return {
      isValid: false,
      message: '올바른 카드번호 형식이 아닙니다.'
    };
  }
  
  // Luhn 알고리즘
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return {
      isValid: false,
      message: '유효하지 않은 카드번호입니다.'
    };
  }
  
  return { isValid: true };
}

// 종합 폼 검증
export function validateForm(formData, rules) {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const result = rule.validate(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        break;
      }
    }
  });
  
  return { isValid, errors };
}

// 실시간 입력 검증 (debounce)
export function createDebouncedValidator(validator, delay = 300) {
  let timeoutId;
  
  return function(value, callback) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const result = validator(value);
      callback(result);
    }, delay);
  };
}

export default {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateRange,
  validateEmailField,
  validatePhoneField,
  validatePasswordMatch,
  validateAdultBirthdate,
  validatePostalCode,
  validateCardNumber,
  validateForm,
  createDebouncedValidator
};
