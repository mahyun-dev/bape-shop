/**
 * 토스트 알림 컴포넌트
 */

let toastId = 0;

export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const id = `toast-${toastId++}`;
  const toast = document.createElement('div');
  toast.id = id;
  toast.className = `toast toast-${type}`;
  
  const icon = getToastIcon(type);
  
  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // 자동 제거
  setTimeout(() => {
    removeToast(id);
  }, duration);
  
  return id;
}

function getToastIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  return `<span style="font-size: 20px; font-weight: bold;">${icons[type] || icons.info}</span>`;
}

export function removeToast(id) {
  const toast = document.getElementById(id);
  if (toast) {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
}

export function showSuccess(message, duration) {
  return showToast(message, 'success', duration);
}

export function showError(message, duration) {
  return showToast(message, 'error', duration);
}

export function showWarning(message, duration) {
  return showToast(message, 'warning', duration);
}

export function showInfo(message, duration) {
  return showToast(message, 'info', duration);
}

export default {
  showToast,
  removeToast,
  showSuccess,
  showError,
  showWarning,
  showInfo
};
