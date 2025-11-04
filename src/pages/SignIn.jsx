// 로그인 페이지
// src/pages/SignIn.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import  useAuth  from '../hooks/useAuth';
import { loginApi } from '@/api/auth'; // 👈 API 함수 import

export function SignIn() {
  const [id, setId] = useState(''); // 👈 'id' state 사용 (정상)
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 전역 로그인 함수

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 🌟 [수정] loginApi가 { userId, password } 객체 1개를 받도록 수정
      const data = await loginApi({
          userId: id, // 👈 'id' state를 'userId' 키에 담아 전송
          password: password
      }); 
      
      // data는 { success: true, token: "..." } 객체입니다.
      // 🌟 [수정] AuthContext의 login 함수 호출
      // (백엔드가 유저 정보를 따로 반환하지 않으므로, ID만 임시로 넘겨줍니다)
      login(data.token, { id: id }); // 👈 data.user 대신 { id: id } 전달

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
            {/* ... (Input 태그들은 수정할 필요 없이 정상입니다) ... */}
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
          {/* ... (소셜 로그인 버튼 및 회원가입 링크) ... */}
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