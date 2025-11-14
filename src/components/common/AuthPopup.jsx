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
            이 기능을 사용하려면 먼저 로그인해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          {/* 선택적 취소 버튼 (isMandatory=false인 경우에만 표시) */}
          {!isMandatory && (
            <Button
              variant="outline"
              onClick={() => navigate('/', { replace: true })}
            >
              취소
            </Button>
          )}

          <Button onClick={handleLoginClick}>로그인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
