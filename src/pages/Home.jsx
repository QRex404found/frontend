import React from 'react';
import videoBg from '@/assets/background.mp4'; 

export function Home() {
  return (
    // [반응형 컨테이너]
    // 1. App.jsx의 패딩(p-4, p-8)을 무시하고 꽉 채우기 위한 음수 마진(-margin) 유지
    // 2. 높이는 (전체 화면 - 헤더 80px)로 고정하여 스크롤 없이 딱 맞춤
    <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8 h-[calc(100vh-80px)] overflow-hidden">
      
      {/* 🎥 배경 비디오 */}
      <video
        src={videoBg}
        autoPlay
        loop
        muted
        playsInline // 모바일 호환 필수
        // [반응형 핵심] object-cover
        // 화면 비율이 달라져도 영상을 찌그러뜨리지 않고
        // 화면을 꽉 채우도록(Crop) 자동으로 조절합니다.
        className="absolute top-0 left-0 object-cover w-full h-full"
      />

    </div>
  );
}