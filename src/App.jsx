// src/App.jsx (이 코드로 파일 전체를 덮어쓰세요)

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
// ⬇️ [수정 1] OAuthCallback 페이지 임포트
import { OAuthCallback } from './pages/OAuthCallback.jsx';

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

      <Toaster
        toastOptions={{
          className: "qrex-toast",
        }}
      />
    </div>
  );
}

export default App;
