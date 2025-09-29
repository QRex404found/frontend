// src/utils/tokenUtils.js

const TOKEN_KEY = 'qrex_auth_token'; // localStorage에 저장될 키

/**
 * 토큰을 localStorage에 저장합니다.
 * @param {string} token - 저장할 JWT 토큰
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * localStorage에서 저장된 토큰을 가져옵니다.
 * @returns {string | null} 저장된 토큰 또는 null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * localStorage에서 토큰을 제거합니다 (로그아웃 시).
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * JWT 토큰을 디코딩하여 내부 페이로드(사용자 정보)를 추출합니다.
 * @param {string | null} token - 디코딩할 JWT 토큰
 * @returns {object | null} 디코딩된 사용자 정보 객체 또는 실패 시 null
 */
export const decodeToken = (token) => {
    if (!token) return null;
    
    try {
        // 실제 프로젝트에서는 'jwt-decode' 라이브러리를 import하여 사용합니다.
        // 예시로 Base64 디코딩 로직을 사용합니다.
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error("잘못된 토큰 형식입니다.");
            return null;
        }
        
        // Base64URL 디코딩 및 JSON 파싱
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);

    } catch (e) {
        console.error("토큰 디코딩 실패:", e);
        return null;
    }
};