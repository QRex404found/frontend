import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 🔑 토큰 관리 유틸 함수
import { getToken, setToken, removeToken } from '../utils/tokenUtils';

// 1. AuthContext 생성
export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
  isChecked: false,
});

// 2. AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); //
  const [user, setUser] = useState(null); 
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  // 앱 로드 시 토큰 확인
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        // TODO: 토큰 유효성 검증 API 호출 (선택 사항)
        setIsLoggedIn(true);
      } catch (error) {
        console.error("저장된 토큰이 유효하지 않습니다:", error);
        removeToken();
        setIsLoggedIn(false);
      }
    }
    setIsChecked(true);
  }, []);

  // 로그인 처리
  const login = (token, userInfo) => {
    setToken(token);
    setIsLoggedIn(true);
    setUser(userInfo);
  };

  // 로그아웃 처리
  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/', { replace: true });
  };

  // 프로필 업데이트
  const updateProfile = (newUserInfo) => {
    setUser(newUserInfo);
  };

  const contextValue = {
    isLoggedIn,
    user,
    isChecked,
    login,
    logout,
    setUser: updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 기본 내보내기는 Provider
export default AuthProvider;
