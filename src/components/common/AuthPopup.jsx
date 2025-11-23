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

// onClose props를 추가로 받습니다.
export function AuthPopup({ show, isMandatory, onClose }) {
  const navigate = useNavigate();

  /** 로그인 버튼 → 팝업 닫고 로그인 화면으로 이동 */
  const handleLoginClick = () => {
    // 1. 부모에게 닫기 요청
    if (onClose) onClose(false);
    
    // 2. 네비게이션 실행
    navigate('/login');
  };

  /** 팝업 닫기(X버튼/배경클릭) → 팝업 닫고 Home 이동 */
  const handlePopupClose = (isOpen) => {
    if (!isOpen) {
      // 1. 부모에게 닫기 요청 (필수)
      if (onClose) onClose(false);
      
      // 2. 홈으로 이동
      navigate('/');
    }
  };

  return (
    <Dialog
      open={show}
      onOpenChange={handlePopupClose} // Shadcn Dialog가 닫힐 때 호출
      modal={true}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        // isMandatory일 때 배경 클릭 막기
        onInteractOutside={(e) => isMandatory && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>로그인이 필요합니다</DialogTitle>
          <DialogDescription>
            로그인 후 이용가능합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button
            onClick={handleLoginClick}
            className="bg-lime-500 hover:bg-lime-600"
          >
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}