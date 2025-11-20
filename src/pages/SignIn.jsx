import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/useAuth";
import { loginApi } from "@/api/auth";
import { toast } from "sonner";

import { FcGoogle } from "react-icons/fc";
import { KakaoIcon } from "@/components/icons/KakaoIcon";

export function SignIn() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoggedIn } = useAuth();
  const shown = useRef(false);

  /* 토스트 처리 */
  useEffect(() => {
    const info = location.state?.toast;
    if (info && !shown.current) {
      shown.current = true;
      info.type === "success" ? toast.success(info.message) : toast.error(info.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /* 로그인 상태면 자동 이동 */
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  /* 🔑 로그인 처리 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginApi({ userId: id, password });

      // 로그인 성공 직후 즉시 이동
      login(data.token);
      navigate("/");

    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl !font-normal">계정 로그인</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="ID"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600">
              로그인
            </Button>
          </form>

          {/* SNS 로그인 */}
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <a
                href="https://www.qrex.kro.kr/oauth2/authorization/google"
                className="flex items-center justify-center w-full gap-2"
              >
                <FcGoogle size={20} />
                Google로 로그인
              </a>
            </Button>

            <Button
              asChild
              className="bg-[#fee500] hover:bg-[#e6cd00] text-black flex items-center gap-2"
            >
              <a
                href="https://www.qrex.kro.kr/oauth2/authorization/kakao"
                className="flex items-center justify-center w-full gap-2"
              >
                <KakaoIcon className="w-4 h-4" />
                Kakao로 로그인
              </a>
            </Button>
          </div>

          <div className="text-sm text-center">
            계정이 없으신가요?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="underline"
            >
              회원가입
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
