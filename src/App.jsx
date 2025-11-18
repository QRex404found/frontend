import { Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header.jsx';
import { Home } from './pages/Home.jsx';
import { SignIn } from './pages/SignIn.jsx';
import { SignUp } from './pages/SignUp.jsx';
import { Analysis } from './pages/Analysis.jsx';
import { Community } from './pages/Community.jsx';
import { MyPost } from './pages/MyPost.jsx';
import AnalyzingQR from './pages/AnalyzingQR.jsx';
import { Toaster } from "sonner";
import { OAuthCallback } from './pages/OAuthCallback.jsx';
import QrexChatWidget from '@/components/chat/QrexChatWidget.jsx'; //챗봇 버튼+sheet 전체.

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analyzing-qr" element={<AnalyzingQR />} />
          <Route path="/community" element={<Community />} />
          <Route path="/mypost" element={<MyPost />} />
          {/* ⬇️ [수정 2] OAuth 콜백 라우트 추가 */}
          <Route path="/login/callback" element={<OAuthCallback />} />
        </Routes>
      </main>
      <QrexChatWidget />
      <Toaster
        toastOptions={{
          className: "qrex-toast",
        }}
      />
    </div>
  );
}

export default App;
