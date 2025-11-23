import React, { createContext, useState, useEffect, useCallback } from 'react';
import { AuthPopup } from '@/components/common/AuthPopup'; 

// 1. JWT 토큰 해독 함수
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
    return null; 
  }
};

// 2. 초기 유저 상태 설정
const getInitialUser = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return { id: null, username: null };

  const decoded = parseJwt(token);
  if (!decoded || decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
    return { id: null, username: null };
  }

  const userId = decoded.sub ?? decoded.id;
  if (userId == null) { 
    localStorage.removeItem('jwtToken');
    return { id: null, username: null };
  }

  return { id: userId, username: decoded.username || null };
};

export const AuthContext = createContext({
  isLoggedIn: false,
  user: { id: null, username: null },
  login: (token, userInfo) => {},
  logout: () => {},
  setUser: (userInfo) => {},
  isChecked: false,
});

export const AuthProvider = ({ children }) => {
  const initialUser = getInitialUser();

  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser.id || initialUser.id === 0);
  const [user, setUser] = useState(initialUser);
  const [isChecked, setIsChecked] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setUser({ id: null, username: null });
    
    // [추가] 로그아웃 시 명시적으로 채팅 초기화 이벤트 발송
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('qrex-chat-reset'));
    }
  }, []);

  useEffect(() => {
    setIsChecked(true);

    // 토큰 만료 이벤트 리스너
    const handleTokenExpired = () => {
      console.log("AuthContext: 토큰 만료 감지 -> 로그아웃 및 팝업 오픈");
      logout(); 
      setIsAuthPopupOpen(true); // 만료 시 팝업 띄움
    };

    window.addEventListener('qrex-token-expired', handleTokenExpired);
    return () => {
      window.removeEventListener('qrex-token-expired', handleTokenExpired);
    };
  }, [logout]);

  const login = useCallback((token, userInfo) => {
    localStorage.setItem('jwtToken', token);
    setIsLoggedIn(true);
    setIsAuthPopupOpen(false); // 로그인 성공 시 팝업 닫기

    if (userInfo) {
      setUser(userInfo);
    } else {
      const decoded = parseJwt(token);
      const userId = decoded?.sub ?? decoded?.id;
      
      if (userId != null) {
        setUser({ id: userId, username: decoded.username || null });
      }
    }
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
    <AuthContext.Provider value={contextValue}>
      {children}
      
      <AuthPopup 
        show={isAuthPopupOpen} 
        isMandatory={true} 
        onClose={() => setIsAuthPopupOpen(false)} 
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;