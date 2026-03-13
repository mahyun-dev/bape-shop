/**
 * 모달 컴포넌트
 */

export function createModal(options) {
  const {
    title = '',
    content = '',
    confirmText = '확인',
    cancelText = '취소',
    onConfirm = null,
    onCancel = null,
    showCancel = true,
    size = 'medium'
  } = options;
  
  const modalId = `modal-${Date.now()}`;
  const container = document.getElementById('modalContainer');
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal';
  
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-content" style="${size === 'large' ? 'max-width: 800px' : ''}">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" data-action="close">✕</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        ${showCancel ? `<button class="btn btn-ghost" data-action="cancel">${cancelText}</button>` : ''}
        <button class="btn btn-primary" data-action="confirm">${confirmText}</button>
      </div>
    </div>
  `;
  
  container.appendChild(modal);
  
  // 이벤트 리스너
  modal.querySelector('[data-action="close"]')?.addEventListener('click', () => {
    if (onCancel) onCancel();
    closeModal(modalId);
  });
  
  modal.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
    if (onCancel) onCancel();
    closeModal(modalId);
  });
  
  modal.querySelector('[data-action="confirm"]')?.addEventListener('click', () => {
    if (onConfirm) onConfirm();
    closeModal(modalId);
  });
  
  modal.querySelector('.modal-backdrop')?.addEventListener('click', () => {
    if (onCancel) onCancel();
    closeModal(modalId);
  });
  
  // 모달 표시
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  return modalId;
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 250);
  }
}

export function confirm(title, message) {
  return new Promise((resolve) => {
    createModal({
      title,
      content: `<p>${message}</p>`,
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false)
    });
  });
}

export function alert(title, message) {
  return new Promise((resolve) => {
    createModal({
      title,
      content: `<p>${message}</p>`,
      confirmText: '확인',
      showCancel: false,
      onConfirm: () => resolve(true)
    });
  });
}

export default {
  createModal,
  closeModal,
  confirm,
  alert
};
