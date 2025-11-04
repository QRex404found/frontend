import axios from 'axios';
// 🌟 [수정] 'tokenUtils.js'의 'getToken' 함수 import를 삭제합니다.
// import { getToken } from '../utils/tokenUtils';

// 🌟 [수정] 'localhost:8080'이 아닌 실제 IP로 설정
const API_BASE_URL = 'http://172.30.133.113:8080';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// (핵심) 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 🌟 [수정] 'getToken()' 대신 'localStorage.getItem('jwtToken')'을 직접 호출합니다.
    // (AuthContext.js가 저장한 키와 동일한 키를 사용)
    const token = localStorage.getItem('jwtToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;