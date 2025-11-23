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

  /** 로그인 버튼 → 로그인 화면으로 이동 */
  const handleLoginClick = () => {
    // [수정됨] 페이지 이동 전 팝업 닫기 요청
    if (onClose) onClose();
    navigate('/login', { replace: true });
  };

  const handlePopupClose = (isOpen) => {
    if (!isOpen) {
      // [수정됨] 팝업 닫기 상태 변경
      if (onClose) onClose();
      
      // 필수 팝업이 아닐 경우에만 홈으로 이동 (기존 로직 유지)
      // 만약 팝업 닫기만 원하면 navigate 부분은 주석 처리해도 됩니다.
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