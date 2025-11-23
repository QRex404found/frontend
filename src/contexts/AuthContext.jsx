// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
// 👇 경로가 맞는지 꼭 확인하세요! (components 폴더 위치)
import { AuthPopup } from '@/components/common/AuthPopup'; 

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

  const userId = decoded.sub ?? decoded.id;

  if (userId == null) { 
    localStorage.removeItem('jwtToken');
    return { id: null, username: null };
  }

  return { id: userId, username: decoded.username || null };
};

// 3. Context 생성
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
  
  // ✅ 팝업 상태 관리 추가 (좀비 팝업 해결의 핵심)
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

  useEffect(() => {
    setIsChecked(true);

    // ✅ 이벤트 리스너 등록: api/index.js에서 보낸 신호를 받음
    const handleTokenExpired = () => {
      logout(); // 로그아웃 처리
      setIsAuthPopupOpen(true); // 팝업 열기
    };

    window.addEventListener('qrex-token-expired', handleTokenExpired);

    return () => {
      window.removeEventListener('qrex-token-expired', handleTokenExpired);
    };
  }, []); // 의존성 배열 비움 (마운트 시 1회 실행)

  const login = useCallback((token, userInfo) => {
    localStorage.setItem('jwtToken', token);
    setIsLoggedIn(true);
    // ✅ 로그인 성공 시 팝업이 떠있다면 닫기 (로그인 시 팝업 뜨는 오류 방지)
    setIsAuthPopupOpen(false);

    if (userInfo) {
      setUser(userInfo);
    } else {
      const decoded = parseJwt(token);
      console.log('AuthContext: 해독된 토큰 페이로드:', decoded); 

      const userId = decoded?.sub ?? decoded?.id;
      
      if (userId != null) {
        console.log('AuthContext: 사용자 ID 설정:', userId);
        setUser({ id: userId, username: decoded.username || null });
      } else {
        console.error('AuthContext: 토큰에서 사용자 ID를 찾을 수 없습니다.');
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
    <AuthContext.Provider value={contextValue}>
      {children}
      
      {/* ✅ 여기서 AuthPopup을 중앙 제어합니다 */}
      {/* onClose가 있어야 좀비 팝업이 되지 않고 닫힙니다 */}
      <AuthPopup 
        show={isAuthPopupOpen} 
        isMandatory={true} 
        onClose={() => setIsAuthPopupOpen(false)} 
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;