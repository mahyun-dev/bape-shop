/**
 * SPA 라우터
 */

import { parseQueryString, emit } from './utils/helpers.js';

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.currentParams = {};
    
    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname + window.location.search);
    });
  }
  
  // 라우트 등록
  register(path, handler) {
    this.routes[path] = handler;
  }
  
  // 라우트 이동
  navigate(path, data = {}) {
    window.history.pushState(data, '', path);
    this.handleRoute(path);
  }
  
  // 라우트 교체 (히스토리에 추가하지 않음)
  replace(path, data = {}) {
    window.history.replaceState(data, '', path);
    this.handleRoute(path);
  }
  
  // 뒤로가기
  back() {
    window.history.back();
  }
  
  // 라우트 처리
  async handleRoute(fullPath) {
    const [pathname, search] = fullPath.split('?');
    const params = search ? parseQueryString('?' + search) : {};
    
    this.currentRoute = pathname;
    this.currentParams = params;
    
    // 라우트 변경 이벤트 발생
    emit('route:change', { path: pathname, params });
    
    // 정확한 매치 찾기
    if (this.routes[pathname]) {
      await this.routes[pathname](params);
      return;
    }
    
    // 동적 라우트 매칭 (/product/:id 형태)
    for (const route in this.routes) {
      const regex = this.pathToRegex(route);
      const match = pathname.match(regex);
      
      if (match) {
        const paramNames = this.getParamNames(route);
        const routeParams = {};
        
        paramNames.forEach((name, index) => {
          routeParams[name] = match[index + 1];
        });
        
        await this.routes[route]({ ...params, ...routeParams });
        return;
      }
    }
    
    // 404 처리
    if (this.routes['/404']) {
      await this.routes['/404'](params);
    } else {
      console.error('404: 페이지를 찾을 수 없습니다.', pathname);
    }
  }
  
  // 경로를 정규식으로 변환
  pathToRegex(path) {
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '([^\\/]+)');
    return new RegExp(`^${pattern}$`);
  }
  
  // 동적 파라미터 이름 추출
  getParamNames(path) {
    const matches = path.match(/:(\w+)/g);
    return matches ? matches.map(m => m.slice(1)) : [];
  }
  
  // 현재 라우트 가져오기
  getCurrentRoute() {
    return this.currentRoute;
  }
  
  // 현재 파라미터 가져오기
  getCurrentParams() {
    return { ...this.currentParams };
  }
  
  // 쿼리 파라미터 가져오기
  getQueryParam(key) {
    return this.currentParams[key];
  }
  
  // 초기 라우트 시작
  start() {
    const initialPath = window.location.pathname + window.location.search;
    this.handleRoute(initialPath || '/');
  }
}

// 싱글톤 인스턴스 생성
const router = new Router();

export default router;
