import axios from 'axios';

// 🚀 [수정됨] API 기본 URL을 로컬호스트와 백엔드 포트(8080)로 설정
const API_BASE_URL = 'https://api.qrex.kro.kr/api';
//const API_BASE_URL = 'https://172.30.1.40:8080/api';

// ✅ Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL, // ← 호스트 IP
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
    // 401 또는 403 에러 발생 시 경고
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('⚠️ 인증 오류: 토큰이 없거나 만료됨');
    }
    return Promise.reject(error);
  }
);

export default apiClient;