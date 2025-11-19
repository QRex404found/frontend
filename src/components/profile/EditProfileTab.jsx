import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { updateProfileApi } from "@/api/auth";
import { toast } from "sonner";

export default function EditProfileTab({ onClose }) {
  // 1. setUser를 가져옵니다 (이름 변경 시 즉시 반영하기 위해)
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    if (password && password !== verifyPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      //  서버에서 새 JWT 토큰을 반환함
      const res = await updateProfileApi({
        newName: name,
        newPassword: password || null,
        verifyPassword: verifyPassword || null,
      });

      const newToken = res.data.token; // UserResponse.token
      if (newToken) {
        //  토큰 저장
        localStorage.setItem("accessToken", newToken);

        //  새 토큰에서 username 추출
        const payload = JSON.parse(atob(newToken.split(".")[1]));

        // username 변경을 즉시 UI 반영
        setUser({
          userId: payload.sub,
          username: payload.username,
        });
      }

      toast.success("회원정보가 수정되었습니다.");

      setPassword("");
      setVerifyPassword("");

    } catch (error) {
      console.error(error);
      toast.error("회원정보 수정에 실패했습니다.");
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
