import React, { createContext, useState, useEffect } from 'react';

/* (B 방식)
 * tokenUtils를 사용하지 않고 'jwtToken' 키를 직접 사용합니다.
 */

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: (token, userInfo) => {},
  logout: () => {},
  setUser: (userInfo) => {},
  isChecked: false,
});

export const AuthProvider = ({ children }) => {
  /* (핵심 수정)
   * 'jwtToken'을 "즉시" 실행해서 초기 로그인 상태를 결정합니다.
   */
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('jwtToken'),
  );
  const [user, setUser] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(true);
  }, []); // (앱 로드 시 1회만 실행됩니다)

  // 로그인 처리 (B 방식)
  const login = (token, userInfo) => {
    localStorage.setItem('jwtToken', token); // 'jwtToken' 키로 직접 저장
    setIsLoggedIn(true);
    setUser(userInfo);
  };

  // 로그아웃 처리 (B 방식)
  const logout = () => {
    localStorage.removeItem('jwtToken'); // 'jwtToken' 키로 직접 삭제
    setIsLoggedIn(false);
    setUser(null);
  };

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

export default AuthProvider;

