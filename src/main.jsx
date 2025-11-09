// 애플리케이션 엔트리 포인트
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; 
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 1. 라우터를 최상위에 설정 - 🔴 basename="/" 명시 추가 */}
    <BrowserRouter basename="/">
      {/* 2. 인증 제공자(Provider)로 앱을 감싸 전역 로그인 상태 관리 */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);