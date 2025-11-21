// src/components/chat/ChatBody.jsx

import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import apiClient from "@/api/index";

export default function ChatBody({ isOpen, user }) {
  const userId = user?.id || user?.userId || "guest";
  const storageKey = `qrex_chat_${userId}`;

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

  const extractUserUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const viewport = document.querySelector("[data-radix-scroll-area-viewport]");
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const extractedUrl = extractUserUrl(trimmed);
    if (extractedUrl) {
      window.dispatchEvent(
        new CustomEvent("qrex-user-url", { detail: { url: extractedUrl } })
      );
    }

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

      if (
        aiText.includes("변경") ||
        aiText.includes("수정") ||
        aiText.includes("바꿨") ||
        aiText.includes("완료") ||
        aiText.includes("작성되었습니다") ||
        aiText.includes("게시글") ||
        aiText.includes("성공적으로") ||
        aiText.includes("등록되었습니다") ||
        aiText.includes("삭제되었습니다") ||
        aiText.includes("삭제 완료")
      ) {
        console.log("🔔 [ChatBody] 업데이트 감지 → MyPost 갱신 이벤트 발생");

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

                {/*  CommentDrawer 방식 그대로 적용된 말풍선 */}
                <div
                  className={`
                    max-w-[75%]
                    px-4 py-2 text-sm rounded-2xl whitespace-pre-wrap 
                    break-all
                    [overflow-wrap:anywhere]
                    ${
                      msg.role === "user"
                        ? "bg-lime-500 text-white rounded-br-none"
                        : "bg-[#E2E8F0] text-black rounded-bl-none"
                    }
                  `}
                  style={{ wordBreak: "break-all" }}
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
                <div className="bg-[#E2E8F0] text-gray-500 px-4 py-2 text-sm rounded-2xl rounded-bl-none flex items-center break-all [overflow-wrap:anywhere]">
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
