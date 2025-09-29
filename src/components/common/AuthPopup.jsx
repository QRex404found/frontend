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

/**
 * 로그인 필요 시 표시되는 팝업 컴포넌트입니다.
 * @param {boolean} show - 팝업을 표시할지 여부
 * @param {boolean} isMandatory - 팝업을 닫을 수 없는 필수 로그인 팝업인지 여부
 */
export function AuthPopup({ show, isMandatory }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Dialog open={show} onOpenChange={() => {
      // isMandatory가 true면 팝업을 닫을 수 없습니다.
      if (!isMandatory) {
        // onOpenChange 이벤트는 open 상태가 변경될 때마다 발생
        // show가 false로 바뀌면 팝업이 닫힙니다.
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>로그인이 필요합니다</DialogTitle>
          <DialogDescription>
            이 기능을 사용하려면 먼저 로그인해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          {/* isMandatory가 false일 때만 취소 버튼을 표시할 수 있습니다. */}
          {!isMandatory && (
            <Button variant="outline">취소</Button>
          )}
          <Button onClick={handleLoginClick}>로그인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}