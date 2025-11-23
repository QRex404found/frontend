import axios from 'axios';

// 🚀 API 기본 URL (https 확인 필수)
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

// ✅ 응답 인터셉터 (여기가 핵심입니다)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status; // 401 등 HTTP 상태 코드
    const errorCode = error?.code;          // 'ERR_NETWORK' 같은 에러 코드
    const requestUrl = error?.config?.url || '';

    // 로그인 요청에서 난 에러는 팝업 띄우면 안 됨 (비번 틀린 경우 등)
    const isIgnoredRequest = requestUrl.includes('/auth/login');

    console.log(`[API Debug] Status: ${status}, Code: ${errorCode}, URL: ${requestUrl}`);

    // 🚨 [수정 포인트]
    // 1. status === 401 : 진짜 토큰 만료
    // 2. errorCode === 'ERR_NETWORK' : Mixed Content 등으로 브라우저가 차단했을 때 (지금 님 상황)
    if ((status === 401 || errorCode === 'ERR_NETWORK') && !isIgnoredRequest) {
      console.warn('⚠️ 토큰 만료 또는 네트워크 차단 감지 -> 강제 로그아웃 실행');

      if (typeof window !== 'undefined') {
        // 아까 콘솔에 쳤던 그 명령어를 자동으로 실행!
        window.dispatchEvent(new Event('qrex-token-expired'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;