import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Header } from './components/common/Header.jsx';
import { Home } from './pages/Home.jsx';
import { SignIn } from './pages/SignIn.jsx';
import { SignUp } from './pages/SignUp.jsx';
import { Analysis } from './pages/Analysis.jsx';
import { Community } from './pages/Community.jsx';
import { MyPost } from './pages/MyPost.jsx';
import AnalyzingQR from './pages/AnalyzingQR.jsx';
import { OAuthCallback } from './pages/OAuthCallback.jsx';

import QrexChatWidget from '@/components/chat/QrexChatWidget.jsx';
import { Toaster } from "sonner";

import { AuthPopup } from '@/components/common/AuthPopup';
import useAuth from '@/hooks/useAuth';

function App() {
  const [forceAuthPopup, setForceAuthPopup] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const handler = () => {
      // 1) 강제 팝업
      setForceAuthPopup(true);

      // 2) 로그인 상태 해제
      logout?.();

      // 3) 채팅 세션 삭제
      Object.keys(sessionStorage)
        .filter(key => key.startsWith("qrex_chat_"))
        .forEach(key => sessionStorage.removeItem(key));

      // 4) 채팅 닫기 신호 보내기
      window.dispatchEvent(new Event("qrex-chat-close"));
    };

    window.addEventListener("qrex-token-expired", handler);
    return () => window.removeEventListener("qrex-token-expired", handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* 🔥 강제 로그인 팝업 */}
      {forceAuthPopup && (
        <AuthPopup show={true} isMandatory={true} />
      )}

      <main className="flex-grow p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analyzing-qr" element={<AnalyzingQR />} />
          <Route path="/community" element={<Community />} />
          <Route path="/mypost" element={<MyPost />} />
          <Route path="/login/callback" element={<OAuthCallback />} />
        </Routes>
      </main>

      {/* 챗봇 */}
      <QrexChatWidget />

      <Toaster toastOptions={{ className: "qrex-toast" }} />
    </div>
  );
}

export default App;
