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

export function AuthPopup({ show, isMandatory, onClose }) {
  const navigate = useNavigate();

  // 로그인 버튼 — 팝업을 닫지 않고 직접 로그인 페이지로 이동
  const handleLoginClick = () => {
    navigate('/login'); 
  };

  // X 버튼(팝업 바깥 클릭 포함)
  const handlePopupClose = (isOpen) => {
    if (!isOpen) {
      // 전달된 onClose가 있으면 실행
      if (onClose) onClose();
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
            <Button variant="outline" onClick={() => onClose?.()}>
              취소
            </Button>
          )}

          <Button onClick={handleLoginClick}>로그인</Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
