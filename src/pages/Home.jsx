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
      {/* SECTION 2 — ABOUT (Naver Enterprise Style + Detail Sections) */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="w-full bg-white text-slate-900 py-48 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-28">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              신뢰할 수 있는 QR 보안 플랫폼
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              QRex는 QR 분석, 위험 탐지, 사용 기록 관리까지
              신뢰할 수 있는 QR 보안 서비스를 제공합니다.
            </p>
          </div>

          {/* What is QRex */}
          <div className="mb-40">
            <h3 className="text-3xl font-bold mb-6">QRex 소개</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              QRex는 도메인 분석, URL 구조 파악, 파라미터 검증을 통해
              사용자에게 안전한 QR 경험을 제공합니다.
              커뮤니티와 기록 관리 기능을 통해 보다 체계적인 관리가 가능합니다.
            </p>
          </div>


          {/* Analysis Detail */}
          <div className="border-b pb-20 mb-28">
            <h3 className="text-3xl font-bold mb-6">Analysis</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              QR 코드를 분석하는 핵심 기능입니다.
              위험 요소를 탐지하고 도메인의 신뢰도를 판별합니다.
            </p>

            <ul className="text-slate-700 text-lg leading-relaxed list-disc pl-6 space-y-2">
              <li>악성 사이트 탐지</li>
              <li>파라미터 분석</li>
              <li>도메인 신뢰도 체크</li>
              <li>위험 레벨 자동 평가</li>
            </ul>
          </div>


          {/* Community Detail */}
          <div className="border-b pb-20 mb-28">
            <h3 className="text-3xl font-bold mb-6">Community</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              QR 보안 관련 정보를 공유하며 함께 성장할 수 있는 공간입니다.
            </p>

            <ul className="text-slate-700 text-lg leading-relaxed list-disc pl-6 space-y-2">
              <li>보안 이슈 토론</li>
              <li>질문/답변 공유</li>
              <li>실제 사례 기반 학습</li>
            </ul>
          </div>


          {/* MyPost Detail */}
          <div className="border-b pb-20 mb-28">
            <h3 className="text-3xl font-bold mb-6">MyPost</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              QR 분석 기록을 관리할 수 있는 개인 공간입니다.
            </p>

            <ul className="text-slate-700 text-lg leading-relaxed list-disc pl-6 space-y-2">
              <li>나의 QR 분석 결과 저장</li>
              <li>제목 수정/삭제 기능</li>
              <li>분석 이력 관리</li>
            </ul>
          </div>


          {/* CTA */}
          <div className="text-center mt-32">
            <button className="px-12 py-5 bg-lime-500 text-white font-semibold rounded-xl hover:bg-lime-600 transition">
              QRex 시작하기
            </button>
          </div>

        </div>
      </div>





    </div>
  );
}
