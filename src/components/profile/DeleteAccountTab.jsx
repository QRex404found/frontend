import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAccountApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { removeToken } from "@/utils/tokenUtils";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner"; // ✅ Toaster 사용을 위해 import

export default function DeleteAccountTab({ onClose }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }

    try {
      // 1. 백엔드 탈퇴 요청
      await deleteAccountApi();

      // 2. 토큰만 조용히 삭제 (logout()은 호출 안 함 -> 자동 이동 방지)
      removeToken(); 

      // 3. ✅ [복구 완료] 원래 나오던 그 Toast 메시지를 띄웁니다!
      toast.success("Your account has been successfully deleted.");

      // 4. 화면 상태 변경 (입력창 숨기고 성공 화면 표시)
      setIsDeleted(true);

    } catch (error) {
      console.error("Delete failed:", error);
      // 에러 메시지도 Toast로 띄우면 더 통일감 있습니다
      toast.error("An error occurred while deleting your account.");
    }
  };

  const handleFinalExit = () => {
    // 5. 확인 버튼 누르면 그때 로그아웃 처리하고 이동
    if (logout) logout();
    if (onClose) onClose();
    navigate('/login', { replace: true });
  };

  // ✅ 탈퇴 성공 시 보여줄 화면
  if (isDeleted) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 space-y-4 text-center border rounded-md bg-gray-50">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Goodbye!</h3>
          <p className="text-sm text-gray-500">
            이용해 주셔서 감사합니다.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleFinalExit} 
          className="mt-4"
        >
          로그인 화면으로 돌아가기
        </Button>
      </div>
    );
  }

  // 기존 화면 (경고문 및 탈퇴 버튼)
  return (
    <div className="p-3 space-y-4 text-sm bg-white border rounded-md">
      <p className="text-base font-medium text-red-600">
        ⚠ Warning
      </p>
      <p className="leading-relaxed text-red-600">
        This action is irreversible.
        <br />
        Your account and associated data will be permanently deleted.
      </p>
      <Button
        onClick={handleDelete}
        variant="destructive"
        className="w-full text-sm font-medium"
      >
        Delete Account
      </Button>
    </div>
  );
}