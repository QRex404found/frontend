import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/useAuth";
import { loginApi } from "@/api/auth";
import { toast } from "sonner";

// ✅ 1. Google 아이콘은 react-icons에서 import
import { FcGoogle } from "react-icons/fc";
// ✅ 2. Kakao 아이콘은 src/assets에서 import
import { KakaoIcon } from '@/components/icons/KakaoIcon';

export function SignIn() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    if (isLoggedIn && user?.userId) {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginApi({ userId: id, password });
      login(data.token);
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    }
  };

  return (
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
                href="https://www.qrex.kro.kr/oauth2/authorization/google"
                className="flex items-center justify-center w-full gap-2"
              >
                {/* ✅ 3. Google 아이콘을 <FcGoogle> 컴포넌트로 변경 */}
                <FcGoogle size={20} />
                Google로 로그인
              </a>
            </Button>
            <Button asChild className="bg-[#fee500] hover:bg-[#e6cd00] text-black flex items-center gap-2">
              <a
                href="https://www.qrex.kro.kr/oauth2/authorization/kakao"
                className="flex items-center justify-center w-full gap-2"
              >
                {/* ✅ 2. <img> 태그 대신 컴포넌트로 사용 */}
                <KakaoIcon className="w-4 h-4" />
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