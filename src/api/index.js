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
    const requestUrl = error?.config?.url; // 👈 요청한 URL 확인

    // 🚨 중요: 로그인 요청('/auth/login')이 "아닐 때만" 401 체크
    // 로그인 할 때 비번 틀린 건 그냥 SignIn.jsx의 catch 문으로 넘겨야 함
    const isLoginRequest = requestUrl && requestUrl.includes('/auth/login');

    if (status === 401 && !isLoginRequest) {
      console.warn('⚠️ 인증 오류: 토큰이 없거나 만료됨');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('qrex-token-expired'));
      }
    }

    // 403, 404, 그리고 로그인 실패(401) 등은 컴포넌트로 에러를 넘김
    return Promise.reject(error);
  }
);

export default apiClient;