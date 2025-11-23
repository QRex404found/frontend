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
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';

    // 🚨 [수정됨] 게시글 조회(/community/posts)는 무시하면 안 됩니다!
    // 여기서 예외로 두면, 커뮤니티 이용 중 토큰 만료 시 로그아웃이 안 됩니다.
    // 로그인(/auth/login) 요청만 예외로 둡니다.
    const isIgnoredRequest = requestUrl.includes('/auth/login');

    // 401(인증 만료)이고, 로그인 요청이 아닐 때 -> 로그아웃 트리거
    if (status === 401 && !isIgnoredRequest) {
      console.warn('⚠️ 인증 오류: 토큰이 없거나 만료됨 (로그아웃 실행)');

      if (typeof window !== 'undefined') {
        // AuthContext와 ChatWidget이 이 이벤트를 듣습니다.
        window.dispatchEvent(new Event('qrex-token-expired'));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;