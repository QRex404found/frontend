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

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handlePopupClose = (isOpen) => {
    // Dialog가 닫히려 할 때 (isOpen이 false가 될 때)
    if (!isOpen) {
      // 🌟 [수정] 홈('/')이 아닌 직전 화면(-1)으로 이동합니다.
      navigate(-1);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handlePopupClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>로그인이 필요합니다</DialogTitle>
          <DialogDescription>
            이 기능을 사용하려면 먼저 로그인해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          {!isMandatory && (
            // 🌟 [수정] 취소 버튼도 직전 화면(-1)으로 이동합니다.
            <Button variant="outline" onClick={() => navigate(-1)}>
              취소
            </Button>
          )}
          <Button onClick={handleLoginClick}>로그인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}