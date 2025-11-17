import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

// 🎥 영상 파일 import (경로 확인 필수!)
import videoBg from '@/assets/background.mp4'; 

export function Home() {
  const navigate = useNavigate();

  return (
    // 🌟 [핵심 변경] 
    // App.jsx의 패딩(p-4 md:p-8)을 무시하고 화면을 꽉 채우기 위해 음수 마진을 사용합니다.
    // 높이는 (전체 화면 높이 - 헤더 높이 80px)로 설정하여 스크롤 없이 딱 맞춥니다.
    <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8 h-[calc(100vh-80px)] overflow-hidden">
      
      {/* 🎥 배경 비디오 (무한 반복) */}
      <video
        src={videoBg}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 object-cover w-full h-full -z-10"
      />

      {/* 🌑 어두운 오버레이 (글씨 잘 보이게) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10"></div>

      {/* ✨ 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        
        <h1 className="mb-6 text-4xl font-bold md:text-6xl drop-shadow-xl">
          QRex: Secure Your Scan
        </h1>
        
        <p className="max-w-2xl mb-8 text-lg font-light text-gray-100 md:text-2xl drop-shadow-md">
          QR 코드 피싱(Qhishing)으로부터 당신을 안전하게 지킵니다.<br className="hidden md:block"/>
          지금 바로 의심스러운 링크를 분석하고 예방하세요.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button 
            onClick={() => navigate('/analysis')} 
            className="px-10 text-lg font-bold text-white transition-all border-none rounded-full shadow-lg bg-lime-500 hover:bg-lime-600 py-7 hover:scale-105"
          >
            검사 시작하기
          </Button>
          
          <Button 
            onClick={() => navigate('/community')} 
            variant="outline"
            className="px-10 text-lg font-bold text-white transition-all border-2 border-white rounded-full shadow-lg bg-white/10 backdrop-blur-sm hover:bg-white hover:text-black py-7 hover:scale-105"
          >
            커뮤니티
          </Button>
        </div>

      </div>
    </div>
  );
}