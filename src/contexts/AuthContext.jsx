// src/contexts/AuthContext.jsx

// ✅ 1. useCallback을 import 합니다.
import React, { createContext, useState, useEffect, useCallback } from 'react';

// 1. JWT 토큰을 해독(decode)하는 헬퍼 함수
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null; // 유효하지 않은 토큰은 null 반환
  }
};

// 2. localStorage에서 토큰을 읽어 초기 유저 상태를 설정하는 함수
const getInitialUser = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    return { userId: null, username: null };
  }

  const decoded = parseJwt(token);

  // (백엔드 수정이 적용되었다는 가정 하에 username까지 확인)
  if (!decoded || !decoded.sub || decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
    return { userId: null, username: null };
  }

  return { userId: decoded.sub, username: decoded.username || null };
};

// 3. Context 생성 (기본값)
export const AuthContext = createContext({
  isLoggedIn: false,
  user: { userId: null, username: null }, 
  login: (token) => {},
  logout: () => {},
  setUser: (userInfo) => {},
  isChecked: false,
});

export const AuthProvider = ({ children }) => {
  const initialUser = getInitialUser();

  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser.userId);
  const [user, setUser] = useState(initialUser);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(true);
  }, []);

  // ✅ 2. (핵심) login 함수를 useCallback으로 감싸줍니다.
  // 이 함수는 이제 AuthProvider가 리렌더링되어도 재생성되지 않습니다.
  const login = useCallback((token) => {
    localStorage.setItem('jwtToken', token);
    setIsLoggedIn(true);

    const decoded = parseJwt(token);
    if (decoded && decoded.sub) {
      setUser({ userId: decoded.sub, username: decoded.username || null });
    }
  }, []); // ⬅️ 의존성 배열이 비어있으므로, 절대 다시 생성되지 않습니다.

  // ✅ 3. (핵심) logout 함수도 useCallback으로 감싸줍니다.
  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setUser({ userId: null, username: null }); 
  }, []);

  // ✅ 4. (핵심) 프로필 수정 함수도 useCallback으로 감싸줍니다.
  const updateProfile = useCallback((newUserInfo) => {
    setUser(newUserInfo);
  }, []);

  const contextValue = {
    isLoggedIn,
    user,
    isChecked,
    login, // ⬅️ useCallback으로 감싸진 안정적인 함수
    logout, // ⬅️ useCallback으로 감싸진 안정적인 함수
    setUser: updateProfile, // ⬅️ useCallback으로 감싸진 안정적인 함수
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;