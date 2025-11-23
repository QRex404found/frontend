import axios from 'axios';

// 🚀 API 기본 URL
const API_BASE_URL = 'https://api.qrex.kro.kr/api';

// ✅ Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터 (Request Interceptor)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (Response Interceptor)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';

    // 🚨 [여기가 핵심입니다]
    // 1. 로그인 (/auth/login)
    // 2. 신고 (/report)
    // 3. 게시글 관련 모든 조회/삭제 (/community/posts) <- 이걸 추가해야 조회 시 401 에러로 튕기지 않습니다!
    const isIgnoredRequest = 
      requestUrl.includes('/auth/login') || 
      requestUrl.includes('/report') ||
      requestUrl.includes('/community/posts'); // ✅ 게시글 관련 모든 URL 예외 처리

    // 예외 URL이 "아닐 때만" 401 체크하여 로그아웃
    if (status === 401 && !isIgnoredRequest) {
      console.warn('⚠️ 인증 오류: 토큰이 없거나 만료됨 (로그아웃 실행)');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('qrex-token-expired'));
      }
    }

    // 그 외 모든 에러는 컴포넌트로 넘겨서 토스트 띄우게 함
    return Promise.reject(error);
  }
);

export default apiClient;