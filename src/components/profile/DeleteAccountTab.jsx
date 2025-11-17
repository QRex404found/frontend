import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAccountApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { removeToken } from "@/utils/tokenUtils";
import { CheckCircle2 } from "lucide-react";

export default function DeleteAccountTab({ onClose }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    try {
      // 1. 백엔드 탈퇴 요청 (여기서 DB 데이터는 삭제됨)
      await deleteAccountApi();

      // ⭐️ [절대 수정 금지] 
      // 여기서 removeToken()이나 logout()을 절대 호출하지 마세요!
      // 토큰이 사라지면 앱이 그걸 감지하고 로그인 창으로 납치해갑니다.
      // 토큰은 그냥 둡니다. (어차피 서버에선 이미 죽은 토큰입니다)

      // 2. 화면만 교체합니다.
      setIsDeleted(true);

    } catch (error) {
      console.error("Delete failed:", error);
      alert("탈퇴 처리에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 사용자가 "로그인 화면으로 가기" 버튼을 눌렀을 때 실행
  const handleFinalExit = () => {
    // 3. 사용자가 떠나겠다고 마음먹었을 때, 비로소 토큰을 지웁니다.
    removeToken(); 
    if (logout) logout();
    
    // 4. 그리고 이동합니다.
    navigate('/login', { replace: true });
  };

  // ✅ 탈퇴 완료 화면
  if (isDeleted) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 space-y-4 text-center border rounded-md bg-gray-50">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">탈퇴가 완료되었습니다.</h3>
          <p className="text-sm text-gray-500">
            그동안 이용해 주셔서 감사합니다.<br/>
            언제든 다시 돌아오시길 기다리겠습니다.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleFinalExit} 
          className="mt-4"
        >
          로그인 화면으로 가기
        </Button>
      </div>
    );
  }

  // 기존 화면
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