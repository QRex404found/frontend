import axios from 'axios';

// 🚀 API 기본 URL
const API_BASE_URL = 'https://api.qrex.kro.kr/api';
// const API_BASE_URL = 'https://192.168.0.15:8080/api';

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

    // 토큰이 있으면 자동으로 Authorization 헤더 추가
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

    // 🚨 [수정됨] 403(권한없음)은 제외하고, 401(토큰만료)일 때만 로그아웃 이벤트 발생
    // 이렇게 해야 게시글 삭제 등으로 인한 403 에러 시 로그아웃되지 않습니다.
    if (status === 401) {
      console.warn('⚠️ 인증 오류: 토큰이 없거나 만료됨');

      // 🔹 여기서는 "이벤트만" 쏜다. (다른 의존성 전혀 없음)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('qrex-token-expired'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;