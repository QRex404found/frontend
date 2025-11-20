import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, QrCode, Users, FileText, ArrowRight } from 'lucide-react';

// 로컬 영상
import videoBg from '@/assets/background.mp4';

// Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


// ----------------------------------------------------------------------
// Feature 카드 데이터
// ----------------------------------------------------------------------
const features = [
  {
    id: 'analysis',
    icon: QrCode,
    title: '데이터 기반 분석',
    desc: 'QR 코드 스캔 결과를 기반으로 위협도 및 패턴을 시각화하여 제공합니다.',
    button: '분석 기능 체험하기'
  },
  {
    id: 'community',
    icon: Users,
    title: '함께 만드는 지식',
    desc: 'QR 보안에 대한 질문과 경험을 공유하는 커뮤니티로 함께 성장하세요.',
    button: '커뮤니티 둘러보기'
  },
  {
    id: 'mypost',
    icon: FileText,
    title: '내 기록 한눈에 보기',
    desc: '내가 생성한 모든 QR 분석 이력을 체계적으로 관리할 수 있습니다.',
    button: '내 게시물 관리'
  }
];


// ----------------------------------------------------------------------
// 메인 Home 컴포넌트
// ----------------------------------------------------------------------
export function Home() {
  const infoSectionRef = useRef(null);

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='w-full'>

      {/* ====================================================== */}
      {/* SECTION 1 — 비디오 히어로 */}
      {/* ====================================================== */}
      <div className="relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]
        -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8 
        h-[calc(100vh-80px)] overflow-hidden"
      >
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 object-cover w-full h-full"
        />

        {/* 미니멀 화살표 */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={scrollToInfo}
                  className="
    p-2 bg-transparent 
    text-white 
    opacity-80 hover:opacity-100 
    transition-all duration-300
  "
                >
                  <ChevronDown
                    size={40}
                    strokeWidth={1.5}
                    className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                  />
                </button>

              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/80 text-white border-white/10 backdrop-blur-md"
              >
                <p>Learn About QRex!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>



      {/* ====================================================== */}
      {/* SECTION 2 — ABOUT (Apple 스타일) */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="w-full bg-white text-slate-900 py-40 px-6">
        <div className="max-w-6xl mx-auto">

          {/* 메인 메시지 (타이포 중심) */}
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
              QR 데이터를 <span className="text-lime-600">더 안전하게.</span><br />
              더 정확하게.
            </h2>
            <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
              QRex는 QR 코드에 담긴 정보를 분석하고,
              위험 요소를 감지하며, 사용자 보호를 위한
              데이터를 기반으로 한 인사이트를 제공합니다.
            </p>
          </div>

          {/* 브랜드 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-28 items-center mb-40">

            <div>
              <h3 className="text-3xl font-semibold mb-6">
                단순 스캔을 넘어선 지능형 보안 분석
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                QRex는 QR 코드의 URL을 단순히 열어보는 것이 아니라,
                패턴 분석, 위험도 탐지, 데이터 기반 리포트를 제공하는
                새로운 형태의 QR 보안 플랫폼입니다.
              </p>

              <button className="px-8 py-4 bg-lime-500 text-white font-semibold rounded-xl hover:bg-lime-600 transition-colors">
                QRex 시작하기
              </button>
            </div>

            <div className="flex justify-center">
              <QrCode className="w-40 h-40 text-lime-600" strokeWidth={1.1} />
            </div>
          </div>

          {/* Minimal CTA */}
          <div className="border border-slate-200 rounded-3xl p-16 text-center hover:border-lime-500 transition-colors">
            <h3 className="text-3xl font-semibold mb-6">
              QR 분석을 더 단순하고 안전하게.
            </h3>
            <p className="text-slate-500 text-lg mb-10">
              지금 QRex를 사용해서 안전한 QR 경험을 시작하세요.
            </p>

            <button className="px-10 py-4 font-semibold bg-lime-500 text-white rounded-xl hover:bg-lime-600 transition-colors">
              지금 사용해보기
            </button>
          </div>

        </div>
      </div>


    </div>
  );
}
