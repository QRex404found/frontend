import axios from 'axios';

// 🚀 API 기본 URL
// (배포 환경에 맞춰서 https 주소가 맞는지 꼭 확인하세요!)
const API_BASE_URL = 'https://api.qrex.kro.kr/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터
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

// ✅ 응답 인터셉터 (배포용 최종 버전)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';

    // 로그인 요청은 실패해도 팝업 띄우지 않음 (비밀번호 틀림 등)
    const isIgnoredRequest = requestUrl.includes('/auth/login');

    // 🚨 [최종 수정] 
    // 오직 '401 Unauthorized' (토큰 만료/위조) 일 때만 로그아웃 시킵니다.
    // (네트워크 에러 등은 그냥 에러 메시지만 띄우도록 놔둡니다)
    if (status === 401 && !isIgnoredRequest) {
      console.warn('⚠️ 토큰 만료 감지 -> 로그아웃 실행');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('qrex-token-expired'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;