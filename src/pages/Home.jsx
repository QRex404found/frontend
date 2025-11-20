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
      {/* SECTION 2 — ABOUT */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="w-full bg-white text-slate-900 py-40 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-32">
            <h2 className="text-5xl font-semibold tracking-tight mb-6">
              QR 보안을 <span className="text-lime-600">더 스마트하게.</span>
            </h2>
            <p className="text-slate-500 text-xl max-w-3xl mx-auto">
              QRex는 QR 분석, 위험 탐지, 커뮤니티, 이력 관리까지
              한 번에 제공하는 지능형 QR 보안 플랫폼입니다.
            </p>
          </div>


          {/* What is QRex */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-40 items-center">
            <div>
              <h3 className="text-3xl font-semibold mb-6">QRex란?</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                QRex는 URL 패턴 분석, 도메인 신뢰도 검증, 파라미터 분석을 통해
                안전한 QR 경험을 제공합니다.
                커뮤니티와 개인 기록 기능으로 지속적인 활용이 가능합니다.
              </p>
              <button className="px-8 py-4 bg-lime-500 text-white rounded-xl font-semibold hover:bg-lime-600 transition">
                시작하기
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-14 flex justify-center">
              <QrCode className="w-36 h-36 text-lime-600" />
            </div>
          </div>


          {/* Feature Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
            {features.map((item) => (
              <div
                key={item.id}
                className="
                  bg-white border border-slate-200 rounded-2xl p-10
                  hover:border-lime-500 hover:shadow-md hover:-translate-y-1
                  transition-all cursor-pointer
                "
              >
                <div className="p-4 bg-slate-100 text-lime-600 rounded-xl inline-block mb-6">
                  <item.icon size={36} />
                </div>

                <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                <p className="text-slate-500 mb-6">{item.desc}</p>

                <button className="text-lime-600 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                  {item.button}
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>




          {/* ====================================================== */}
          {/* NEW UI — Detailed Section (Analysis) */}
          {/* ====================================================== */}
          <div className="mb-48">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">

              {/* LEFT — TEXT */}
              <div>
                <h3 className="text-4xl font-semibold mb-6">Analysis</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                  AI 기반 URL 패턴 분석, 파라미터 추출, 도메인 검증을 통해  
                  QR 링크가 안전한지 즉시 판단합니다.
                </p>

                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-lime-600 font-semibold mt-1">•</span>
                    악성 URL / 피싱 사이트 실시간 탐지
                  </li>
                  <li className="flex gap-3">
                    <span className="text-lime-600 font-semibold mt-1">•</span>
                    URL 파라미터 자동 구조 분석
                  </li>
                  <li className="flex gap-3">
                    <span className="text-lime-600 font-semibold mt-1">•</span>
                    도메인 신뢰도 등급 제공
                  </li>
                </ul>
              </div>

              {/* RIGHT — UI PANEL MOCK */}
              <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-lime-100 text-lime-700 rounded-xl">
                    <QrCode size={32} />
                  </div>
                  <h4 className="text-xl font-semibold">QR 코드 분석 결과</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-slate-600">
                    <span>위험도 레벨</span>
                    <span className="text-lime-600 font-semibold">LOW</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>도메인 신뢰도</span>
                    <span className="text-slate-800 font-semibold">안전함</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>파라미터 수</span>
                    <span className="text-slate-800 font-semibold">3개</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <button className="text-lime-600 font-semibold hover:underline">
                    상세 분석 보기 →
                  </button>
                </div>
              </div>

            </div>
          </div>





          {/* ====================================================== */}
          {/* NEW UI — Detailed Section (Community) */}
          {/* ====================================================== */}
          <div className="mb-48">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">

              {/* LEFT IMAGE (Mock UI) */}
              <div className="order-2 md:order-1 relative bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
                    <Users size={32} />
                  </div>
                  <h4 className="text-xl font-semibold">커뮤니티 Q&A</h4>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="font-medium text-slate-800">
                      QR 코드가 이상한 사이트로 이동해요
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      도메인 신뢰도 확인이 필요합니다.
                    </p>
                  </div>

                  <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="font-medium text-slate-800">
                      피싱 QR인지 어떻게 알 수 있나요?
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      분석 기능을 활용하면 실시간 탐지가 가능합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT TEXT */}
              <div className="order-1 md:order-2">
                <h3 className="text-4xl font-semibold mb-6">Community</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                  다양한 사용자들이 질문하고 답변하며  
                  QR 보안에 대한 지식을 함께 확장해 나갑니다.
                </p>

                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-semibold mt-1">•</span>
                    실제 사례 기반 Q&A
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-semibold mt-1">•</span>
                    보안 지식 공유 및 토론
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-semibold mt-1">•</span>
                    사용자 경험 기반 인사이트 제공
                  </li>
                </ul>
              </div>

            </div>
          </div>





          {/* ====================================================== */}
          {/* NEW UI — Detailed Section (MyPost) */}
          {/* ====================================================== */}
          <div className="mb-48">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">

              {/* LEFT TEXT */}
              <div>
                <h3 className="text-4xl font-semibold mb-6">MyPost</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                  내가 분석한 QR 결과를 리스트로 모아  
                  효율적으로 관리할 수 있습니다.
                </p>

                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-semibold mt-1">•</span>
                    분석 리포트 히스토리 저장
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-semibold mt-1">•</span>
                    제목 수정 및 삭제 기능
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-semibold mt-1">•</span>
                    상세 리포트 확인
                  </li>
                </ul>
              </div>

              {/* RIGHT MOCK UI */}
              <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                    <FileText size={32} />
                  </div>
                  <h4 className="text-xl font-semibold">My QR 기록</h4>
                </div>

                <div className="space-y-3">

                  <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="font-medium text-slate-800">
                      https://safe-site.com/login
                    </p>
                    <p className="text-slate-500 text-sm mt-1">위험도: 낮음</p>
                  </div>

                  <div className="p-4 border border-slate-100 rounded-xl">
                    <p className="font-medium text-slate-800">
                      https://unknown-domain.xyz/
                    </p>
                    <p className="text-slate-500 text-sm mt-1">위험도: 중간</p>
                  </div>

                </div>
              </div>

            </div>
          </div>




          {/* CTA */}
          <div className="border border-slate-200 rounded-3xl p-20 text-center hover:border-lime-500 transition">
            <h3 className="text-3xl font-semibold mb-6">QR 분석을 더 쉽게, 더 안전하게.</h3>
            <p className="text-slate-500 mb-10">지금 QRex를 사용해보세요.</p>

            <button className="px-10 py-4 bg-lime-500 text-white font-semibold rounded-xl hover:bg-lime-600 transition">
              지금 시작하기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
