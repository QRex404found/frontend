import React from 'react';
// --- [수정 1] ---
// BrowserRouter as Router import를 삭제했습니다.
// 이제 App 컴포넌트는 라우팅을 직접 관리하지 않습니다.
import { Routes, Route } from 'react-router-dom';

import { Header } from './components/common/Header.jsx';
import { Home } from './pages/Home.jsx';
import { SignIn } from './pages/SignIn.jsx';
import { SignUp } from './pages/SignUp.jsx';
import { Analysis } from './pages/Analysis.jsx';
import { Community } from './pages/Community.jsx';
import { MyPost } from './pages/MyPost.jsx';
import AnalyzingQR from './pages/AnalyzingQR.jsx'; 

function App() {
  return (
    // --- [수정 2] ---
    // <Router> 태그를 삭제했습니다.
    // 이제 이 컴포넌트는 main.jsx에 있는 BrowserRouter의 자식으로 렌더링됩니다.
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
          {/* Additional routes can be added here */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
