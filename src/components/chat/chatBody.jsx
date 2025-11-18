// src/components/chat/ChatBody.jsx
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react"; // ⭐️ 로딩 아이콘 추가
import apiClient from "@/api/index";



// ⭐️ 부모에게서 isOpen(채팅창 열림 여부)을 prop으로 받습니다.
export default function ChatBody({ isOpen }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "안녕하세요! QRex 보안 에이전트입니다. 무엇을 도와드릴까요? 🛡️",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ⭐️ 답변 대기 상태 관리

  const viewportRef = useRef(null);

  const scrollToBottom = () => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  };

  // ⭐️ [핵심] 채팅창이 닫히면(isOpen === false) 대화 내용 초기화
  useEffect(() => {
    if (!isOpen) {
      // 약간의 지연을 주어 닫히는 애니메이션 동안은 내용이 보이게 함 (선택사항)
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 1,
            role: "assistant",
            text: "안녕하세요! QRex 보안 에이전트입니다. 무엇을 도와드릴까요? 🛡️",
          },
        ]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // 로딩 상태가 변할 때도 스크롤

  // 초기 렌더링 시 스크롤
  useEffect(() => {
    const viewport = document.querySelector("[data-radix-scroll-area-viewport]");
    if (viewport) {
      viewportRef.current = viewport;
      scrollToBottom();
    }
  }, []);

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
      // 2. apiClient를 사용하여 요청 전송
      // ✅ [수정됨] baseURL이 이미 설정되어 있으므로 경로는 '/ai/chat'만 쓰면 됩니다.
      // ✅ [수정됨] 헤더(Authorization) 설정 삭제 (apiClient가 알아서 함)
      const response = await apiClient.get("/ai/chat", {
        params: {
          message: trimmed,
        },
      });

      // 3. AI 응답 표시
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
      {/* 메시지 영역 */}
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

            {/* 로딩 인디케이터 (답변 생성 중일 때 표시) */}
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
            disabled={isLoading} // 로딩 중엔 입력 방지
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