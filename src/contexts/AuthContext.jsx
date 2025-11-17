// src/contexts/AuthContext.jsx (이 코드로 덮어쓰세요)

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
    return { id: null, username: null };
  }

  const decoded = parseJwt(token);

  if (!decoded || decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
    return { id: null, username: null };
  }

  // [수정] 0일 수도 있는 ID를 확인합니다. (?? = nullish coalescing 연산자)
  // decoded.sub도 없고, decoded.id도 없으면 null이 됩니다.
  // **만약 다른 키(예: userId)라면 decoded.userId ?? null 처럼 수정하세요.**
  const userId = decoded.sub ?? decoded.id;

  // [수정] userId가 0일 경우를 대비해 null/undefined만 체크합니다.
  if (userId == null) { 
    localStorage.removeItem('jwtToken');
    return { id: null, username: null };
  }

  return { id: userId, username: decoded.username || null };
};

// 3. Context 생성 (기본값)
export const AuthContext = createContext({
  isLoggedIn: false,
  user: { id: null, username: null }, // user.id 사용
  login: (token, userInfo) => {}, // userInfo 인자 받도록 수정
  logout: () => {},
  setUser: (userInfo) => {},
  isChecked: false,
});

export const AuthProvider = ({ children }) => {
  const initialUser = getInitialUser();

  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser.id || initialUser.id === 0); // 0도 true로
  const [user, setUser] = useState(initialUser);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(true);
  }, []);

  const login = useCallback((token, userInfo) => {
    localStorage.setItem('jwtToken', token);
    setIsLoggedIn(true);

    if (userInfo) {
      // (Case 1) 일반 로그인
      setUser(userInfo);
    } else {
      // (Case 2) 소셜 로그인
      const decoded = parseJwt(token);
      
      // [디버깅 1] 브라우저 콘솔에서 이 로그를 확인하세요!
      console.log('AuthContext: 해독된 토큰 페이로드:', decoded); 

      // [수정] 0일 수도 있는 ID를 확인합니다.
      // **만약 다른 키(예: userId)라면 decoded.userId ?? null 처럼 수정하세요.**
      const userId = decoded?.sub ?? decoded?.id;
      
      // [수정] 0을 false로 취급하지 않도록 검사 방식을 변경합니다.
      if (userId != null) { // (userId !== null && userId !== undefined)와 동일
        console.log('AuthContext: 사용자 ID 설정:', userId);
        setUser({ id: userId, username: decoded.username || null });
      } else {
        console.error('AuthContext: 토큰에서 사용자 ID("sub" 또는 "id")를 찾을 수 없습니다.');
      }
    }
  }, []); 

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
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