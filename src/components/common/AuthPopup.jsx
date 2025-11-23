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
            로그인 후 이용가능합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">

          <Button onClick={handleLoginClick} className="bg-lime-500 hover:bg-lime-600">Login</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
