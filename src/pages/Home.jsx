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
                    p-2 bg-transparent text-white 
                    opacity-70 hover:opacity-100
                    transition-all duration-300
                  "
                >
                  <ChevronDown size={40} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/80 text-white border-white/10 backdrop-blur-md"
              >
                <p>Scroll</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>



      {/* ====================================================== */}
      {/* SECTION 2 — ABOUT (완전 리디자인 버전) */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="w-full bg-white text-slate-900 py-32 px-6">
        <div className="max-w-6xl mx-auto">

          {/* ABOUT 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              더 안전한 <span className="text-lime-600">QR 세상</span>을 만듭니다.
            </h2>
            <p className="text-slate-500 text-lg mt-4">
              QRex는 QR 기반 보안 위협을 탐지하고, 데이터를 기반으로 인사이트를 제공합니다.
            </p>

            <div className="w-24 h-1 bg-lime-500 mx-auto mt-6 rounded-full" />
          </motion.div>



          {/* -------------------------------------------------- */}
          {/* SECTION A — 브랜드 메시지 */}
          {/* -------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">

            {/* 텍스트 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-6">
                QR 분석부터 사용자 보호까지
              </h3>

              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                QRex는 스캔한 QR 코드의 위험도를 분석하고,  
                사용자 보호를 위한 인사이트를 제공하는 보안 플랫폼입니다.  
                분석 이력 관리와 커뮤니티 기반 지식 공유까지  
                하나의 서비스에서 제공됩니다.
              </p>

              <button
                className="inline-flex items-center gap-2 px-6 py-3 bg-lime-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                지금 시작하기
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* 오른쪽 아이콘 박스 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-slate-50 border border-slate-100 rounded-3xl p-12 shadow-xl flex items-center justify-center"
            >
              <QrCode className="w-32 h-32 text-lime-600" strokeWidth={1.2} />
            </motion.div>
          </div>



          {/* -------------------------------------------------- */}
          {/* SECTION B — Feature Cards */}
          {/* -------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">

            {features.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="
                  bg-white border border-slate-200 rounded-2xl p-8
                  hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]
                  hover:border-lime-500 transition-all duration-300 cursor-pointer
                "
              >
                {/* 아이콘 */}
                <div className="p-4 bg-lime-100 text-lime-600 rounded-xl inline-block mb-6">
                  <item.icon className="w-8 h-8" strokeWidth={1.4} />
                </div>

                {/* 제목 */}
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>

                {/* 설명 */}
                <p className="text-slate-500 leading-relaxed mb-6">
                  {item.desc}
                </p>

                {/* 버튼 */}
                <button className="text-lime-600 font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
                  {item.button}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}

          </div>



          {/* -------------------------------------------------- */}
          {/* SECTION C — CTA */}
          {/* -------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-lime-500 text-white rounded-3xl p-12 shadow-xl text-center"
          >
            <h3 className="text-3xl font-bold mb-4">지금 바로 QRex를 경험해보세요</h3>
            <p className="text-white/90 mb-8">
              QR 분석, 위험 탐지, 커뮤니티 — 하나의 플랫폼에서.
            </p>
            <button className="px-8 py-4 bg-white text-lime-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg">
              시작하기
            </button>
          </motion.div>

        </div>
      </div>

    </div>
  );
}
