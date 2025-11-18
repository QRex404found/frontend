// src/components/chat/ChatBody.jsx
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import apiClient from "@/api/index";

export default function ChatBody({ isOpen }) {

  // ⭐ 1) sessionStorage에서 메시지 불러오기
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("qrex_chat_messages");
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

  const scrollToBottom = () => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const viewport = document.querySelector("[data-radix-scroll-area-viewport]");
    if (viewport) {
      viewportRef.current = viewport;
      scrollToBottom();
    }
  }, []);

  // 2) 메시지가 변할 때마다 저장
  useEffect(() => {
    sessionStorage.setItem("qrex_chat_messages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // 1. 사용자 메시지 화면 표시
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // ⭐️ [핵심] 대화 기억을 위한 ID 생성 로직 재추가
      let guestId = localStorage.getItem("guestId");
      if (!guestId) {
        guestId = "guest-" + Date.now();
        localStorage.setItem("guestId", guestId);
      }

      const response = await apiClient.get("/ai/chat", {
        params: {
          message: trimmed,
          // userId로 guestId를 전송 (백엔드에서 conversationId로 사용됨)
          userId: guestId
        },
      });

      // 4. AI 응답 표시
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: response.data,
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = {
        id: Date.now() + 2,
        role: "assistant",
        text: "죄송합니다. AI 서버와 연결할 수 없습니다. 😢",
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  return (
    <div className="flex flex-col h-full">

      {/* 메시지 리스트 */}
      <div className="flex-1 px-4 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          <div className="flex flex-col justify-end min-h-full gap-5 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end ${msg.role === "user" ? "justify-end" : "justify-start"
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
                    ${msg.role === "user"
                      ? "bg-lime-500 text-white rounded-br-none"
                      : "bg-[#E2E8F0] text-black rounded-bl-none"
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* 로딩 메시지 */}
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

      {/* 입력창 */}
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
            className={`ml-2 h-9 w-9 rounded-full flex items-center justify-center transition-colors ${isLoading || !input.trim()
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
