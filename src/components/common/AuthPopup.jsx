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

  /**  로그인 버튼 → 로그인 화면으로 이동 */
  const handleLoginClick = () => {
    // 팝업 닫히는 처리 이후 네비게이션 실행
    setTimeout(() => {
      navigate('/login');
    }, 10);
  };

  /**  팝업 닫기 → Home 이동 */
  const handlePopupClose = (isOpen) => {
    if (!isOpen) {
      setTimeout(() => {
        navigate('/');
      }, 10);
    }
  };

  return (
    <Dialog
      open={show}
      onOpenChange={handlePopupClose}
      modal={true} // Android 포커스 이슈 해결
    >
      <DialogContent
        className="sm:max-w-[425px]"
        // 바깥 클릭으로 닫기 방지 (불필요 끄기 가능)
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
