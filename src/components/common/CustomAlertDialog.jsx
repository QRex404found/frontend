import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import React from 'react';

/**
 * 범용적 경고 및 알림 다이얼로그 컴포넌트
 * @param {boolean} isOpen - 다이얼로그 열림/닫힘 상태
 * @param {string} type - 'success', 'failure', 'warning', 'error' 중 하나
 * @param {string} title - 다이얼로그 제목
 * @param {string} description - 다이얼로그 내용
 * @param {function} onClose - 다이얼로그 닫기 요청 시 호출
 * @param {function} onAction - 버튼 클릭 시 호출되는 액션 핸들러 (버튼 클릭 시 항상 닫힘)
 * @param {string} actionButtonText - 주 버튼 텍스트 (예: '확인', '홈으로')
 */
export function CustomAlertDialog({
  isOpen,
  type = 'warning',
  title = '알림',
  description = '처리 중 문제가 발생했습니다.',
  onClose,
  onAction,
  actionButtonText = '확인',
}) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: 'text-green-500', title: '성공' };
      case 'failure':
      case 'error':
        return { icon: XCircle, color: 'text-red-500', title: '실패' };
      case 'warning':
      default:
        return { icon: AlertTriangle, color: 'text-yellow-500', title: '경고' };
    }
  };

  const { icon: Icon, color, title: defaultTitle } = getIcon();

  const handleActionClick = () => {
    if (onAction) {
      onAction();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-2xl">
        <DialogHeader className="text-center items-center space-y-4">
          <Icon className={`h-12 w-12 ${color}`} />
          <DialogTitle className="text-2xl font-bold">{title || defaultTitle}</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex justify-center">
          <Button
            type="button"
            className={`w-full h-10 text-lg font-bold ${
              type === 'success' ? 'bg-green-500 hover:bg-green-600' : 
              type === 'failure' || type === 'error' ? 'bg-red-500 hover:bg-red-600' :
              'bg-gray-500 hover:bg-gray-600'
            }`}
            onClick={handleActionClick}
          >
            {actionButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
