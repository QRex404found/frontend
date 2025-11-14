// src/contexts/AuthContext.jsx (이 코드로 파일 전체를 덮어쓰세요)

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
    // ⬇️ [수정 1] userId -> id
    return { id: null, username: null };
  }

  const decoded = parseJwt(token);

  if (!decoded || !decoded.sub || decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
    // ⬇️ [수정 2] userId -> id
    return { id: null, username: null };
  }

  // ⬇️ [수정 3] userId -> id (토큰의 'sub'가 ID임)
  return { id: decoded.sub, username: decoded.username || null };
};

// 3. Context 생성 (기본값)
export const AuthContext = createContext({
  isLoggedIn: false,
  // ⬇️ [수정 4] userId -> id
  user: { id: null, username: null }, 
  login: (token, userInfo) => {}, // ⬅️ userInfo 인자 추가
  logout: () => {},
  setUser: (userInfo) => {},
  isChecked: false,
});

export const AuthProvider = ({ children }) => {
  const initialUser = getInitialUser();

  // ⬇️ [수정 5] initialUser.userId -> initialUser.id
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser.id);
  const [user, setUser] = useState(initialUser);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(true);
  }, []);

  // ⬇️ [수정 6] login 함수가 (token, userInfo) 두 인자를 모두 처리하도록 수정
  const login = useCallback((token, userInfo) => {
    localStorage.setItem('jwtToken', token);
    setIsLoggedIn(true);

    if (userInfo) {
      // (Case 1) 일반 로그인: SignIn.jsx가 보내준 { id: '...' } 객체를 그대로 사용
      setUser(userInfo);
    } else {
      // (Case 2) 소셜 로그인: 토큰을 해독하여 { id: '...' } 객체를 생성
      const decoded = parseJwt(token);
      if (decoded && decoded.sub) {
        setUser({ id: decoded.sub, username: decoded.username || null });
      }
    }
  }, []); // ⬅️ 의존성 배열은 비워둠

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    // ⬇️ [수정 7] userId -> id
    setUser({ id: null, username: null }); 
  }, []);

  const updateProfile = useCallback((newUserInfo) => {
    setUser(newUserInfo);
  }, []);

  const contextValue = {
    isLoggedIn,
    user,
    isChecked,
    login,
    logout,
    setUser: updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;