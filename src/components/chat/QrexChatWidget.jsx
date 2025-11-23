import React, { useEffect, useState } from "react";
import ChatFloatingButton from "./chatButton";
import ChatSheet from "./chatSheet";
import ChatBody from "./chatBody";
import useAuth from "@/hooks/useAuth";

export default function QrexChatWidget() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  // 채팅 초기화 이벤트 수신
  // 토큰 만료나 로그아웃 시 채팅창을 닫지 않고 내용만 초기화하려면 
  // 별도의 닫기 로직은 필요 없다. (React 상태 변경으로 자동 갱신됨)
  useEffect(() => {
    const resetHandler = () => {
      // 만약 토큰 만료 시 채팅창을 닫고 싶다면 여기에 setOpen(false) 추가
      // 현재는 "열린 상태였어도 초기화되어 다시 보여져야 함"이므로 닫지 않음
      console.log("ChatWidget: 채팅 초기화 신호 받음");
    };

    window.addEventListener("qrex-chat-reset", resetHandler);
    return () => window.removeEventListener("qrex-chat-reset", resetHandler);
  }, []);

  return (
    <>
      <ChatFloatingButton onClick={() => setOpen(true)} />

      <ChatSheet open={open} onOpenChange={setOpen}>
        {/*  key prop 사용 
           isLoggedIn 상태가 변할 때마다(로그인/로그아웃/만료) 
           key가 변경되어 ChatBody 컴포넌트가 완전히 파괴되고 다시 생성.
           따라서 채팅 기록(state)이 자동으로 초기화.
        */}
        <ChatBody 
            key={isLoggedIn ? `user-${user?.id}` : 'guest-mode'} 
            isOpen={open} 
            user={isLoggedIn ? user : null} 
        />
      </ChatSheet>
    </>
  );
}