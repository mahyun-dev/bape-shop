/**
 * Footer 컴포넌트
 */

export function renderFooter() {
  const footer = document.getElementById('footer');
  
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <!-- Company Info -->
        <div>
          <h4 class="footer-section-title">전자담배 샵</h4>
          <p class="text-sm text-secondary" style="line-height: 1.6;">
            프리미엄 전자담배 샵<br>
            안전하고 신뢰할 수 있는<br>
            최고의 쇼핑 경험을 제공합니다.
          </p>
        </div>
        
        <!-- Customer Service -->
        <div>
          <h4 class="footer-section-title">고객센터</h4>
          <div class="footer-links">
            <a href="/notice" class="footer-link" data-link>공지사항</a>
            <a href="/faq" class="footer-link" data-link>자주 묻는 질문</a>
            <a href="/contact" class="footer-link" data-link>1:1 문의</a>
            <a href="/guide" class="footer-link" data-link>이용가이드</a>
          </div>
        </div>
        
        <!-- Policy -->
        <div>
          <h4 class="footer-section-title">정책</h4>
          <div class="footer-links">
            <a href="/terms" class="footer-link" data-link>이용약관</a>
            <a href="/privacy" class="footer-link" data-link>개인정보처리방침</a>
            <a href="/shipping" class="footer-link" data-link>배송/교환/반품</a>
            <a href="/adult-verify" class="footer-link" data-link>성인인증정책</a>
          </div>
        </div>
        
        <!-- Contact -->
        <div>
          <h4 class="footer-section-title">연락처</h4>
          <div class="text-sm" style="line-height: 1.8; color: var(--gray-400);">
            <p>📧 majetans@gmail.com</p>
            <p>☎️ 010-5889-9654</p>
            <p>⏰ 평일 09:00 - 18:00</p>
            <p style="font-size: var(--text-xs); margin-top: var(--space-2);">
              (주말 및 공휴일 휴무)
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p>© 2026 LuminoaDev. All rights reserved.</p>
        <p style="margin-top: var(--space-2); font-size: var(--text-xs);">
          전자담배 샵은 전자담배 전문 쇼핑몰로, 모든 상품은 안전하고 신뢰할 수 있는 공급처에서 엄선하여 제공합니다.
        </p>
        <p style="margin-top: var(--space-2);">
          🔞 본 사이트는 만 19세 이상만 이용 가능합니다.
        </p>
      </div>
    </div>
  `;
  
  // 링크 클릭 처리
  footer.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // 간단한 alert로 처리 (실제로는 페이지 구현 필요)
      alert('준비 중인 페이지입니다.');
    });
  });
}

export default {
  renderFooter
};
