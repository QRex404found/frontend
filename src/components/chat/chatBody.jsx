// src/components/chat/ChatBody.jsx

import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import apiClient from "@/api/index";

export default function ChatBody({ isOpen, user }) {
  // ⭐ userId 결정 (비로그인 → guest)
  const userId = user?.id || user?.userId || "guest";
  const storageKey = `qrex_chat_${userId}`;

  // ------------------------------------------------------------------------------------------------
  // 1) sessionStorage에서 메시지 불러오기
  // ------------------------------------------------------------------------------------------------
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            role: "assistant",
            text: "안녕하세요! QRex 보안 에이전트입니다. 무엇을 도와드릴까요? 🛡️",
          },
        ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const viewportRef = useRef(null);

  // ------------------------------------------------------------------------------------------------
  // 스크롤 항상 맨 아래 유지
  // ------------------------------------------------------------------------------------------------
  const scrollToBottom = () => {
    setTimeout(() => {
      const viewport = document.querySelector("[data-radix-scroll-area-viewport]");
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  // ------------------------------------------------------------------------------------------------
  // 2) 메시지가 바뀔 때마다 sessionStorage에 저장
  // ------------------------------------------------------------------------------------------------
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  // ------------------------------------------------------------------------------------------------
  // 계정이 바뀌었을 때 다른 계정의 기록을 불러오도록 처리
  // ------------------------------------------------------------------------------------------------
  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          id: 1,
          role: "assistant",
          text: "안녕하세요! QRex 보안 에이전트입니다. 무엇을 도와드릴까요? 🛡️",
        },
      ]);
    }
  }, [storageKey]);

  // ------------------------------------------------------------------------------------------------
  // 메시지 전송
  // ------------------------------------------------------------------------------------------------
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiClient.get("/ai/chat", {
        params: { message: trimmed, userId },
      });

      let aiText = "";

      if (typeof response.data === "object" && response.data !== null) {
        aiText = response.data.response || JSON.stringify(response.data);
      } else {
        aiText = response.data;
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: aiText,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // 🚨 [추가된 핵심 로직] AI가 데이터를 수정했다고 응답하면 이벤트를 발생시킴
      // Analysis.jsx가 이 이벤트를 듣고 목록을 새로고침합니다.
      if (
        aiText.includes("변경") || 
        aiText.includes("수정") || 
        aiText.includes("바꿨") ||
        aiText.includes("완료")
      ) {
          console.log("🔔 [ChatBody] 변경 감지! 화면 갱신 신호 보냄 📡");
          // DB 반영 시간을 살짝 고려해 0.5초 뒤 실행
          setTimeout(() => {
            window.dispatchEvent(new Event("analysis-updated"));
          }, 500);
      }

    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          text: "죄송합니다. AI 서버와 연결할 수 없습니다. 😢",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ------------------------------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          <div className="flex flex-col justify-end min-h-full gap-5 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <img
                    src="/qrex_profile.png"
                    alt="Q-Rex"
                    className="object-contain w-10 h-10 mr-2 bg-white border rounded-full shadow-sm"
                  />
                )}

                <div
                  className={`
                    max-w-[75%] px-4 py-2 text-sm rounded-2xl whitespace-pre-wrap 
                    ${
                      msg.role === "user"
                        ? "bg-lime-500 text-white rounded-br-none"
                        : "bg-[#E2E8F0] text-black rounded-bl-none"
                    }
                  `}
                >
                  {typeof msg.text === "object"
                    ? JSON.stringify(msg.text)
                    : msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-end justify-start">
                <img
                  src="/qrex_profile.png"
                  alt="Q-Rex"
                  className="object-contain w-10 h-10 mr-2 bg-white border rounded-full shadow-sm"
                />
                <div className="bg-[#E2E8F0] text-gray-500 px-4 py-2 text-sm rounded-2xl rounded-bl-none flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  답변 생성 중...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="px-4 py-3 bg-white border-t">
        <div className="flex items-center w-full bg-[#F1F5F9] rounded-full px-4 py-[6px] shadow-sm focus-within:ring-2 focus-within:ring-lime-200 transition-all">
          <input
            className="flex-grow text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
            placeholder={isLoading ? "답변을 기다리는 중..." : "메시지를 입력하세요..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`ml-2 h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
              isLoading || !input.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-lime-500 hover:bg-lime-600"
            }`}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}