import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signupApi, checkIdApi } from '@/api/auth';
import SignupResultDialog from '@/components/common/SignupResultDialog';

export function SignUp() {
  const [form, setForm] = useState({
    name: '',
    id: '',
    password: '',
    confirmPassword: '',
  });
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (id === 'id') {
      setIsIdChecked(false);
      setIdCheckMessage('');
    }
  };

  const handleIdCheck = async () => {
    if (!form.id) {
      setIdCheckMessage('ID를 입력해주세요.');
      return;
    }
    try {
      const isAvailable = await checkIdApi(form.id);

      if (isAvailable) {
        setIsIdChecked(true);
        setIdCheckMessage('사용 가능한 ID입니다.');
      } else {
        setIsIdChecked(false);
        setIdCheckMessage('이미 사용 중인 ID입니다.');
      }
    } catch (error) {
      setIsIdChecked(false);
      setIdCheckMessage('ID 확인 중 오류가 발생했습니다.');
    }
  };

  const handleDialogAction = (actionType) => {
    setDialogState({ ...dialogState, isOpen: false });

    if (actionType === 'success') {
      navigate('/login');
    } else if (actionType === 'failure') {
      setForm({ name: '', id: '', password: '', confirmPassword: '' });
      setIsIdChecked(false);
      setIdCheckMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setDialogState({
        isOpen: true,
        type: 'warning',
        title: '비밀번호 불일치',
        message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      });
      return;
    }
    if (!isIdChecked) {
      setDialogState({
        isOpen: true,
        type: 'warning',
        title: '필수 확인 누락',
        message: 'ID 중복 확인을 완료해야 회원가입을 진행할 수 있습니다.',
      });
      return;
    }

    try {
      // ✅ 백엔드 DTO(userPw)에 맞게 수정
      const response = await signupApi({
        userName: form.name,
        userId: form.id,
        userPw: form.password,
      });

      console.log('회원가입 응답:', response); // ✅ 반드시 콘솔에서 확인 가능

      setDialogState({
        isOpen: true,
        type: 'success',
        title: '회원가입 성공',
        message: '회원가입이 완료되었습니다!',
      });
    } catch (error) {
      console.error('회원가입 실패:', error); // ✅ 실패 로그 추가
      setDialogState({
        isOpen: true,
        type: 'failure',
        title: '회원가입 실패',
        message: error.message || '회원가입 중 문제가 발생했습니다.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Sign up</CardTitle>
          <p className="text-sm text-gray-500">
            Sign up to QREX and be part of a community!
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Name */}
            <div className="grid gap-2">
              <label htmlFor="name" className="font-semibold">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="hong-gil-dong"
              />
            </div>

            {/* ID (with Check Button) */}
            <div className="grid gap-2">
              <label htmlFor="id" className="font-semibold">
                ID
              </label>
              <div className="flex gap-2">
                <Input
                  id="id"
                  type="text"
                  value={form.id}
                  onChange={handleChange}
                  required
                  placeholder="@peduarte"
                />
                <Button
                  type="button"
                  onClick={handleIdCheck}
                  variant="outline"
                  className="text-sm font-bold shadow-sm"
                >
                  Check
                </Button>
              </div>
              <p
                className={`text-sm ${
                  isIdChecked ? 'text-green-500' : 'text-red-500'
                } h-4`}
              >
                {idCheckMessage}
              </p>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="******"
              />
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="font-semibold">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="******"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 h-10 bg-green-500 hover:bg-green-600 text-lg font-bold shadow-md"
            >
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 회원가입 결과 Dialog */}
      <SignupResultDialog
        isOpen={dialogState.isOpen}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        onClose={() => setDialogState({ ...dialogState, isOpen: false })}
        onAction={handleDialogAction}
      />
    </div>
  );
}
