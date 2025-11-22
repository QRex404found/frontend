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

    // Google One-Tap 자동 팝업 억제
    try {
      window.google?.accounts?.id?.cancel?.();
      window.google?.accounts?.id?.disableAutoSelect?.();
    } catch (e) {
      console.warn("Google cleanup skipped:", e);
    }

    // Kakao SDK 자동 팝업/자동 로그아웃 억제
    try {
      if (window.Kakao?.Auth) {
        // logout(), unlink()는 절대 호출하지 말 것
        window.Kakao.Auth.setAccessToken(null);
      }
    } catch (e) {
      console.warn("Kakao cleanup skipped:", e);
    }

    try {
      // 1) 백엔드에 탈퇴 요청
      await deleteAccountApi();

      // 2) 로컬 토큰 삭제
      removeToken();

      // 3) 전역 auth 상태 로그아웃
      logout?.();

      // 4) 마이페이지 탭 닫기
      onClose?.();

      // 5) 성공 toast
      toast.success("계정이 성공적으로 삭제되었습니다.");

      // 6) 홈으로 이동
      navigate("/", { replace: true });

    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("계정 삭제 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="p-3 space-y-2 text-sm bg-white border rounded-md">
      <div className="flex items-center gap-2 text-red-600">
        <span className="text-xl">
          ⚠
        </span>

        <p className="text-base font-medium">
          Warning
        </p>
      </div>

      <p className="leading-normal text-gray-700">
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
