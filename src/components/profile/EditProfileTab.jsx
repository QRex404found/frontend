import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { updateProfileApi } from "@/api/auth";
import { toast } from "sonner";

export default function EditProfileTab({ onClose }) {
  // ✅ 1. setUser를 가져옵니다 (이름 변경 시 즉시 반영하기 위해)
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const handleSave = async () => {
    // 유효성 검사
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    // 비밀번호를 입력했는데 서로 다르면 중단
    if (password && password !== verifyPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 2. 백엔드에 수정 요청 보내기
      await updateProfileApi({
        newName: name,
        newPassword: password || null, // 빈 값이면 null로 보내서 비번 변경 안 함
        verifyPassword: verifyPassword || null,
      });

      // 3. ✅ [핵심] 로그아웃/이동 코드 삭제함!
      // 대신, 현재 로그인된 유저 상태(이름)만 업데이트합니다.
      // (기존 user 객체를 복사하고 username만 새 이름으로 덮어씌움)
      setUser({ ...user, username: name });

      // 4. 성공 메시지 띄우기
      toast.success("회원정보가 수정되었습니다.");

      // 5. 비밀번호 입력창 비우기 (보안상 안전)
      setPassword("");
      setVerifyPassword("");
      
      // (선택 사항) 수정 후 팝업을 닫고 싶으면 아래 주석 해제
      // if (onClose) onClose();

    } catch (error) {
      console.error(error);
      toast.error(error.message || "회원정보 수정에 실패했습니다.");
    }
  };

  const getPasswordStateClass = () => {
    if (!password && !verifyPassword) return "";
    return password === verifyPassword ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="p-3 space-y-4 text-sm bg-white border rounded-md">
      <div className="flex flex-col gap-1">
        <label className="font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">New Password</label>
        <input
          type="password"
          placeholder="변경할 경우에만 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`border rounded-md px-3 py-2 ${getPasswordStateClass()}`}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Verify Password</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
          className={`border rounded-md px-3 py-2 ${getPasswordStateClass()}`}
        />
      </div>

      <Button onClick={handleSave} className="w-full font-medium text-white bg-lime-500 hover:bg-lime-600">
        Save changes
      </Button>
    </div>
  );
}
