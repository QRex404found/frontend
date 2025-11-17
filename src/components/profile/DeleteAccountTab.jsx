import React from "react";
import { Button } from "@/components/ui/button";
import { deleteAccountApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { removeToken } from "@/utils/tokenUtils";
import { toast } from "sonner";

export default function DeleteAccountTab({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    // 1. 탈퇴 확인
    if (!window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    try {
      // 2. 백엔드에 탈퇴 요청
      await deleteAccountApi();

      // 3. 로컬 토큰 삭제
      removeToken();

      // 4. 앱 로그아웃 상태 업데이트
      if (logout) logout();

      // 5. 마이페이지 탭 닫기 (props로 전달받은 경우)
      if (onClose) onClose();

      // 6. 성공 메시지 띄우기
      toast.success("Your account has been successfully deleted.");

      // 7. 홈 화면으로 즉시 이동
      navigate('/', { replace: true });

    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("An error occurred while deleting your account.");
    }
  };

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