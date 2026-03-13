/**
 * 로컬스토리지 기반 상태 관리 스토어
 */

import { secureSetItem, secureGetItem } from './utils/security.js';
import { emit } from './utils/helpers.js';

class Store {
  constructor() {
    this.state = {
      user: null,
      cart: [],
      wishlist: [],
      products: [],
      orders: [],
      isAgeVerified: false
    };
    
    this.listeners = {};
    this.init();
  }
  
  // 초기화
  init() {
    this.loadFromStorage();
  }
  
  // 로컬스토리지에서 데이터 로드
  loadFromStorage() {
    try {
      const savedUser = secureGetItem('user');
      const savedCart = secureGetItem('cart');
      const savedWishlist = secureGetItem('wishlist');
      const savedOrders = secureGetItem('orders');
      const ageVerified = localStorage.getItem('age_verified');
      
      if (savedUser) this.state.user = savedUser;
      if (savedCart) this.state.cart = savedCart;
      if (savedWishlist) this.state.wishlist = savedWishlist;
      if (savedOrders) this.state.orders = savedOrders;
      if (ageVerified === 'true') this.state.isAgeVerified = true;
    } catch (e) {
      console.error('데이터 로드 오류:', e);
    }
  }
  
  // 로컬스토리지에 저장
  saveToStorage(key, value) {
    if (key === 'isAgeVerified') {
      localStorage.setItem('age_verified', value.toString());
    } else {
      secureSetItem(key, value);
    }
  }
  
  // 상태 업데이트
  setState(key, value) {
    this.state[key] = value;
    this.saveToStorage(key, value);
    this.notifyListeners(key, value);
    emit(`store:${key}`, value);
  }
  
  // 상태 가져오기
  getState(key) {
    return this.state[key];
  }
  
  // 전체 상태 가져오기
  getAllState() {
    return { ...this.state };
  }
  
  // 상태 변화 리스너 등록
  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
    
    // 구독 취소 함수 반환
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    };
  }
  
  // 리스너에게 알림
  notifyListeners(key, value) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => callback(value));
    }
  }
  
  // ===== 사용자 관련 ===== //
  
  // 로그인
  login(user) {
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      loginAt: new Date().toISOString()
    };
    this.setState('user', userData);
    emit('user:login', userData);
  }
  
  // 로그아웃
  logout() {
    this.setState('user', null);
    emit('user:logout');
  }
  
  // 로그인 여부 확인
  isLoggedIn() {
    return this.state.user !== null;
  }
  
  // 현재 사용자 정보
  getCurrentUser() {
    return this.state.user;
  }
  
  // 사용자 정보 업데이트
  updateUser(updates) {
    if (this.state.user) {
      const updatedUser = { ...this.state.user, ...updates };
      this.setState('user', updatedUser);
    }
  }
  
  // ===== 장바구니 관련 ===== //
  
  // 장바구니에 상품 추가
  addToCart(product, quantity = 1) {
    const existingItem = this.state.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // 이미 있으면 수량만 증가
      this.updateCartQuantity(product.id, existingItem.quantity + quantity);
    } else {
      // 새로 추가
      const cartItem = {
        ...product,
        quantity,
        addedAt: new Date().toISOString()
      };
      const newCart = [...this.state.cart, cartItem];
      this.setState('cart', newCart);
      emit('cart:added', cartItem);
    }
  }
  
  // 장바구니에서 상품 제거
  removeFromCart(productId) {
    const newCart = this.state.cart.filter(item => item.id !== productId);
    this.setState('cart', newCart);
    emit('cart:removed', productId);
  }
  
  // 장바구니 수량 업데이트
  updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const newCart = this.state.cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    this.setState('cart', newCart);
    emit('cart:updated', { productId, quantity });
  }
  
  // 장바구니 비우기
  clearCart() {
    this.setState('cart', []);
    emit('cart:cleared');
  }
  
  // 장바구니 아이템 수
  getCartCount() {
    return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  // 장바구니 총액
  getCartTotal() {
    return this.state.cart.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }
  
  // 장바구니 아이템 목록
  getCartItems() {
    return [...this.state.cart];
  }
  
  // ===== 위시리스트 관련 ===== //
  
  // 위시리스트에 추가
  addToWishlist(product) {
    const exists = this.state.wishlist.find(item => item.id === product.id);
    if (exists) return;
    
    const wishItem = {
      ...product,
      addedAt: new Date().toISOString()
    };
    const newWishlist = [...this.state.wishlist, wishItem];
    this.setState('wishlist', newWishlist);
    emit('wishlist:added', wishItem);
  }
  
  // 위시리스트에서 제거
  removeFromWishlist(productId) {
    const newWishlist = this.state.wishlist.filter(item => item.id !== productId);
    this.setState('wishlist', newWishlist);
    emit('wishlist:removed', productId);
  }
  
  // 위시리스트 토글
  toggleWishlist(product) {
    const exists = this.state.wishlist.find(item => item.id === product.id);
    if (exists) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }
  
  // 위시리스트에 있는지 확인
  isInWishlist(productId) {
    return this.state.wishlist.some(item => item.id === productId);
  }
  
  // 위시리스트 목록
  getWishlist() {
    return [...this.state.wishlist];
  }
  
  // ===== 주문 관련 ===== //
  
  // 주문 생성
  createOrder(orderData) {
    const order = {
      id: `ORD${Date.now()}`,
      ...orderData,
      items: [...this.state.cart],
      totalAmount: this.getCartTotal(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const newOrders = [...this.state.orders, order];
    this.setState('orders', newOrders);
    this.clearCart();
    emit('order:created', order);
    
    return order;
  }
  
  // 주문 목록
  getOrders() {
    return [...this.state.orders].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  
  // 특정 주문 조회
  getOrder(orderId) {
    return this.state.orders.find(order => order.id === orderId);
  }
  
  // 주문 상태 업데이트
  updateOrderStatus(orderId, status) {
    const newOrders = this.state.orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    this.setState('orders', newOrders);
    emit('order:updated', { orderId, status });
  }
  
  // ===== 상품 관련 ===== //
  
  // 상품 목록 설정
  setProducts(products) {
    this.setState('products', products);
  }
  
  // 상품 목록 가져오기
  getProducts() {
    return [...this.state.products];
  }
  
  // 특정 상품 조회
  getProduct(productId) {
    return this.state.products.find(p => p.id === productId);
  }
  
  // 카테고리별 상품 필터링
  getProductsByCategory(category) {
    if (!category || category === 'all') {
      return this.state.products;
    }
    return this.state.products.filter(p => p.category === category);
  }
  
  // 상품 검색
  searchProducts(query) {
    if (!query) return this.state.products;
    
    const lowerQuery = query.toLowerCase();
    return this.state.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
    );
  }
  
  // ===== 연령 인증 ===== //
  
  // 연령 인증 설정
  setAgeVerified(verified) {
    this.setState('isAgeVerified', verified);
  }
  
  // 연령 인증 여부 확인
  isAgeVerified() {
    return this.state.isAgeVerified;
  }
  
  // ===== 데이터 초기화 ===== //
  
  // 전체 데이터 초기화 (회원탈퇴 등)
  clearAllData() {
    localStorage.clear();
    sessionStorage.clear();
    this.state = {
      user: null,
      cart: [],
      wishlist: [],
      products: [],
      orders: [],
      isAgeVerified: false
    };
    emit('store:cleared');
  }
}

// 싱글톤 인스턴스 생성
const store = new Store();

export default store;
