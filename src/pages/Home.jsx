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
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">Analysis</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-14 max-w-3xl">
              QR 코드를 기반으로 URL 위험도, 도메인 신뢰도, 파라미터 구조 등을 분석하여  
              보안 위협을 정확하게 판단합니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">

              {/* Left Icon Column */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-lime-300 to-lime-500 blur-3xl opacity-30"></div>
                  <QrCode size={70} className="text-lime-600 relative z-10" />
                </div>
              </div>

              {/* Right features */}
              <div className="md:col-span-3 space-y-6">

                {/* Mini-card #1 */}
                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-lime-500 transition">
                  <div className="p-3 bg-lime-100 text-lime-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">위험한 QR 즉시 탐지</h4>
                    <p className="text-slate-600">
                      악성 URL, 피싱 도메인, 이상 패턴을 실시간으로 식별합니다.
                    </p>
                  </div>
                </div>

                {/* Mini-card #2 */}
                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-lime-500 transition">
                  <div className="p-3 bg-lime-100 text-lime-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">파라미터 분석</h4>
                    <p className="text-slate-600">
                      URL에 포함된 추적 파라미터 및 의심 요소를 자동 추출합니다.
                    </p>
                  </div>
                </div>

                {/* Mini-card #3 */}
                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-lime-500 transition">
                  <div className="p-3 bg-lime-100 text-lime-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">도메인 신뢰도 검증</h4>
                    <p className="text-slate-600">
                      등록 정보, 과거 위험 이력, 신뢰도 데이터를 기반으로 도메인을 평가합니다.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>



          {/* ====================================================== */}
          {/* NEW UI — Detailed Section (Community) */}
          {/* ====================================================== */}
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">Community</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-14 max-w-3xl">
              사용자들이 보안 경험을 공유하고 정보를 나누며 함께 성장하는 공간입니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">

              {/* Left Icon Column */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-300 to-purple-500 blur-3xl opacity-30"></div>
                  <Users size={70} className="text-purple-600 relative z-10" />
                </div>
              </div>

              {/* Right Features */}
              <div className="md:col-span-3 space-y-6">

                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-purple-500 transition">
                  <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">QR 보안 Q&A</h4>
                    <p className="text-slate-600">
                      모르는 점을 빠르게 묻고 전문가/사용자에게 답을 얻을 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-purple-500 transition">
                  <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">실제 사례 기반 학습</h4>
                    <p className="text-slate-600">
                      QR 피싱 사례, 문제 해결 과정 등 실제 경험을 통해 배울 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-purple-500 transition">
                  <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">지식 공유</h4>
                    <p className="text-slate-600">
                      다양한 사용자들이 인사이트를 교환하며 서로 도와줍니다.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>



          {/* ====================================================== */}
          {/* NEW UI — Detailed Section (MyPost) */}
          {/* ====================================================== */}
          <div className="mb-40">
            <h3 className="text-4xl font-semibold mb-6">MyPost</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-14 max-w-3xl">
              내가 분석한 QR 기록을 한곳에서 관리하며 편리하게 접근할 수 있습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">

              {/* Left Icon */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-300 to-blue-500 blur-3xl opacity-30"></div>
                  <FileText size={70} className="text-blue-600 relative z-10" />
                </div>
              </div>

              {/* Right */}
              <div className="md:col-span-3 space-y-6">

                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-blue-500 transition">
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">QR 분석 이력 관리</h4>
                    <p className="text-slate-600">
                      내가 분석한 모든 QR 코드를 시간순으로 확인할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-blue-500 transition">
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">제목 수정·삭제</h4>
                    <p className="text-slate-600">
                      분석 결과 제목을 변경하거나, 필요 시 삭제할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-5 border border-slate-200 rounded-xl hover:border-blue-500 transition">
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">분석 결과 상세 보기</h4>
                    <p className="text-slate-600">
                      각 분석 리포트를 열어 상세한 결과를 볼 수 있습니다.
                    </p>
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
