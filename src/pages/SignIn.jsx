// 로그인 페이지
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import  useAuth  from '../hooks/useAuth';
import { loginApi } from '@/api/auth'; // 👈 API 함수 import

export function SignIn() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 전역 로그인 함수

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. 백엔드 로그인 API 호출
      const data = await loginApi(id, password); 
      
      // 2. 로그인 성공 시 AuthContext 업데이트 (토큰 저장)
      login(data.token, data.user); 

      // 3. 메인 페이지로 이동
      navigate('/');
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다. ID와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">계정에 로그인</CardTitle>
          <p className="text-sm text-gray-500">
            계정에 로그인하려면 아래에 ID와 비밀번호를 입력하세요.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="id"
                type="text"
                placeholder="ID"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
          {/* 소셜 로그인 버튼 (Figma PDF 4페이지 참고) */}
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              {/* Google 아이콘 */}
              <img src="/google-icon.svg" alt="Google" className="w-4 h-4" />
              Google로 로그인
            </Button>
            <Button className="bg-[#fee500] hover:bg-[#e6cd00] text-black flex items-center gap-2">
              {/* Kakao 아이콘 */}
              <img src="/kakao-icon.svg" alt="Kakao" className="w-4 h-4" />
              Kakao로 로그인
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{' '}
            <button onClick={() => navigate('/signup')} className="underline">
              회원가입
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}