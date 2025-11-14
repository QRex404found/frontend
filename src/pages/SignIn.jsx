// src/pages/SignIn.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/useAuth";
import { loginApi } from "@/api/auth";
import { toast } from "sonner";

export function SignIn() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ 1. user 객체도 함께 가져옵니다.
  const { login, isLoggedIn, user } = useAuth(); 
  const shown = useRef(false);

  useEffect(() => {
    const info = location.state?.toast;
    if (info && !shown.current) {
      shown.current = true;
      info.type === "success" ? toast.success(info.message) : toast.error(info.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ✅ 2. 페이지 이동(navigation)을 위한 useEffect 수정
  useEffect(() => {
    // ⭐️ (핵심) 로그인이 되었고, user.userId 값도 실제로 들어왔는지 "둘 다" 확인합니다.
    if (isLoggedIn && user?.userId) {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]); // ✅ 3. user를 의존성 배열에 추가합니다.


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginApi({ userId: id, password });
      login(data.token); 
      // navigate("/"); // 여기서 이동하지 않습니다.
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    }
  };

  return (
    // ... (이하 폼 UI는 동일)
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">계정에 로그인</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">

          <form onSubmit={handleSubmit} className="grid gap-4">
            <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" required />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">로그인</Button>
          </form>

          <div className="flex flex-col gap-2 pt-2">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <a 
                  href="https://www.qrex.kro.kr/login/oauth2/authorization/google"
                  className="flex items-center justify-center w-full gap-2"
                >
                <img src="/google-icon.svg" className="w-4 h-4" />
                Google로 로그인
              </a>
            </Button>
            <Button asChild className="bg-[#fee500] hover:bg-[#e6cd00] text-black flex items-center gap-2">
              <a 
                  href="https://www.qrex.kro.kr/login/oauth2/authorization/kakao"
                  className="flex items-center justify-center w-full gap-2"
                >
                <img src="/kakao-icon.svg" className="w-4 h-4" />
                Kakao로 로그인
              </a>
            </Button>
          </div>

          <div className="text-sm text-center">
            계정이 없으신가요?{" "}
            <button onClick={() => navigate("/signup")} className="underline">
              회원가입
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}