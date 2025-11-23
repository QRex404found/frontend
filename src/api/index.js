import axios from 'axios';

// 🚀 API 기본 URL
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

// ✅ 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. 에러 정보 추출
    const status = error?.response?.status;     // 서버가 준 상태 코드 (401 등)
    const errorCode = error?.code;              // 아까 뜬 'ERR_NETWORK' 같은 코드
    const requestUrl = error?.config?.url || '';

    // 2. 예외 URL 설정
    const isIgnoredRequest = requestUrl.includes('/auth/login');

    // 🔍 디버깅용: 콘솔에 에러 원인을 찍어줍니다.
    console.log(`[API Error] Status: ${status}, Code: ${errorCode}, URL: ${requestUrl}`);

    // 🚨 [핵심 수정] 
    // 조건 1: status === 401 (토큰 만료)
    // 조건 2: errorCode === 'ERR_NETWORK' (Mixed Content나 서버 다운 등으로 아예 막혔을 때)
    if ((status === 401 || errorCode === 'ERR_NETWORK') && !isIgnoredRequest) {
      console.warn('⚠️ 인증 오류 또는 네트워크 차단 감지 -> 로그아웃 실행');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('qrex-token-expired'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;