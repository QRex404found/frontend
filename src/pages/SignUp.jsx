// src/pages/SignUp.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signupApi, checkIdApi } from '@/api/auth';
import { toast } from "sonner";

export function SignUp() {
  const [form, setForm] = useState({
    name: '',
    id: '',
    password: '',
    confirmPassword: '',
  });
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.warning("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!isIdChecked) {
      toast.warning("ID 중복 확인을 먼저 완료해야 합니다.");
      return;
    }

    try {
      await signupApi({
        userName: form.name,
        userId: form.id,
        userPw: form.password,
      });

      toast.success("회원가입이 완료되었습니다!");
      navigate('/login');

    } catch (error) {
      console.error("회원가입 실패:", error);
      toast.error(error.message || "회원가입 중 오류가 발생했습니다.");
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
              <label htmlFor="name" className="font-semibold">Name</label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="활동 시 사용자에게 노출됩니다."
              />
            </div>

            {/* ID */}
            <div className="grid gap-2">
              <label htmlFor="id" className="font-semibold">ID</label>
              <div className="flex gap-2">
                <Input
                  id="id"
                  type="text"
                  value={form.id}
                  onChange={handleChange}
                  required
                  placeholder="ID"
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
              <label htmlFor="password" className="font-semibold">Password</label>
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
              className="w-full mt-4 h-10 bg-lime-500 hover:bg-lime-600 text-lg font-medium shadow-md"
            >
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
