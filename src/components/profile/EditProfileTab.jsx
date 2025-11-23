import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { updateProfileApi } from "@/api/auth";
import { toast } from "sonner";

// [수정] { onClose } 제거 (쓰지 않는 변수라 에러 발생)
export default function EditProfileTab() { 
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  // Global user 상태가 업데이트되면 현재 탭의 input 값도 동기화
  useEffect(() => {
    if (user?.username) {
      setName(user.username);
    }
  }, [user?.username]);

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
      const res = await updateProfileApi({
        newName: name,
        newPassword: password || null,
        verifyPassword: verifyPassword || null,
      });

      console.log("Update Profile Response:", res);

      const newToken = res?.data?.token || res?.token;

      if (newToken) {
        localStorage.setItem("accessToken", newToken);

        try {
          // 토큰 디코딩 (atob는 브라우저 환경에서 정상 작동)
          const payload = JSON.parse(atob(newToken.split(".")[1]));

          setUser({
            ...user,            
            userId: payload.sub, 
            username: name,      
          });
          
          toast.success("회원정보가 수정되었습니다.");
        } catch (e) {
          console.error("토큰 디코딩 실패:", e);
          setUser({ ...user, username: name });
          toast.success("수정 완료 (새로고침 권장)");
        }
      } else {
        setUser({ ...user, username: name });
        toast.success("회원정보가 수정되었습니다.");
      }

      setPassword("");
      setVerifyPassword("");

    } catch (error) {
      console.error("Profile Update Update Error:", error);
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