// src/components/common/AuthPopup.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function AuthPopup({ show, isMandatory }) {
  const navigate = useNavigate();

  /** 로그인 버튼 → 로그인 화면으로 이동 */
  const handleLoginClick = () => {
    navigate('/login', { replace: true });
  };

  /**
   * X 버튼, 바깥 클릭 →
   * shadcn Dialog 특성상 뒤로가기가 먼저 발생할 수 있으므로
   * ⚠ navigate(-1) 같은 동작이 절대 일어나지 않도록
   * 무조건 홈('/')으로 강제 이동 처리
   */
  const handlePopupClose = (isOpen) => {
    if (!isOpen) {
      navigate('/', { replace: true });
    }
  };

  return (
    <Dialog open={show} onOpenChange={handlePopupClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>로그인이 필요합니다</DialogTitle>
          <DialogDescription>
            페이지 접근 권한이 없습니다. 로그인 후 이용가능합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">

          <Button onClick={handleLoginClick} className="bg-lime-500 hover:bg-lime-600">Login</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
