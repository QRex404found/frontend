// src/pages/Home.jsx

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  QrCode,
  Users,
  FileText,
} from 'lucide-react';

import videoBg from '@/assets/background.mp4';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Home() {
  const infoSectionRef = useRef(null);

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">

      {/* ====================================================== */}
      {/* 1) HERO SECTION */}
      {/* ====================================================== */}
      <div
        className="
          relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]
          -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8
          h-[calc(100vh-80px)] overflow-hidden
        "
      >
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 object-cover w-full h-full"
        />

        {/* Scroll Arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={scrollToInfo}
                  className="p-2 text-white opacity-90 hover:opacity-100 transition"
                >
                  <ChevronDown
                    size={42}
                    strokeWidth={1.5}
                    className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/80 text-white border-white/10 backdrop-blur-md"
              >
                Learn More
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>



      {/* ====================================================== */}
      {/* 2) ABOUT HEADER (fadeUp) */}
      {/* ====================================================== */}
      <div ref={infoSectionRef} className="bg-white text-slate-900 py-36 px-6">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <h2 className="text-5xl font-semibold tracking-tight mb-6">
              QR 보안을 <span className="text-lime-600">더 스마트하게.</span>
            </h2>

            <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
              QRex는 QR 분석, 위험 탐지, 커뮤니티, 이력 관리까지
              한 번에 제공하는 지능형 QR 보안 플랫폼입니다.
            </p>
          </motion.div>



          {/* ====================================================== */}
          {/* 3) WHAT IS QREX (좌↔우 등장) */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-40 items-center">

            {/* LEFT: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-semibold mb-6">QRex란?</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                QRex는 URL 패턴 분석, 도메인 신뢰도 확인,
                파라미터 검증을 기반으로 위험성을 판단하는
                지능형 QR 분석 플랫폼입니다.
                <br /><br />
                또한 커뮤니티와 분석 기록 기능으로
                지속적이고 확장 가능한 보안 경험을 제공합니다.
              </p>

              <button className="px-8 py-4 bg-lime-500 text-white rounded-xl font-semibold hover:bg-lime-600 transition">
                시작하기
              </button>
            </motion.div>


            {/* RIGHT: Icon Box */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-14 flex justify-center"
            >
              <QrCode className="w-36 h-36 text-lime-600" />
            </motion.div>
          </div>



          {/* CTA SECTION */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-16 my-32 overflow-hidden">

            {/* === Brush Stroke === */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.15]">
              <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
                className="absolute inset-0"
              >
                <motion.path
                  d="M0 120 C 150 20, 300 180, 450 60 C 600 -20, 750 150, 800 80"
                  stroke="#7CCF00"
                  strokeWidth="45"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.0,
                    ease: "easeInOut",
                  }}
                />
              </motion.svg>
            </div>


            <h3 className="text-3xl font-semibold text-center mb-8 relative z-10">
              QRex는 당신의 안전한 QR 사용을 돕습니다
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 relative z-10">

              <div className="text-center p-6">
                <QrCode size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">정확한 URL 분석</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  URL 구조, IP, 도메인 신뢰도를 기반으로 위험도를 판단합니다.
                </p>
              </div>

              <div className="text-center p-6">
                <Users size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">보안 경험 공유</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  QR 관련 정보와 사례를 함께 나눌 수 있습니다.
                </p>
              </div>

              <div className="text-center p-6">
                <FileText size={44} className="text-lime-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">분석 이력 관리</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  스캔한 QR 분석 결과를 한곳에서 쉽게 관리하세요.
                </p>
              </div>

            </div>
          </div>








          {/* ====================================================== */}
          {/* 5) FEATURE 3-COLUMN (마무리 소개) */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">

            {/* Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition"
            >
              <div className="p-4 bg-lime-100 text-lime-600 rounded-xl inline-block mb-6">
                <QrCode size={36} />
              </div>
              <h4 className="text-2xl font-semibold mb-3">Analysis</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                URL 위험도·도메인 신뢰도·파라미터 구조를 정밀 분석해
                보안 위협을 판단합니다.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• 위험도 자동 분석</li>
                <li>• 도메인 검증</li>
                <li>• 파라미터 구조 분석</li>
              </ul>
            </motion.div>


            {/* Community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition"
            >
              <div className="p-4 bg-lime-100 text-lime-600 rounded-xl inline-block mb-6">
                <Users size={36} />
              </div>
              <h4 className="text-2xl font-semibold mb-3">Community</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                실제 사용자들이 남긴 경험을 통해
                더 현실적인 보안 인사이트를 얻습니다.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• 사용자 기반 정보 공유</li>
                <li>• QR 사례 정보</li>
                <li>• 최신 보안 트렌드</li>
              </ul>
            </motion.div>


            {/* MyPost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition"
            >
              <div className="p-4 bg-lime-100 text-lime-600 rounded-xl inline-block mb-6">
                <FileText size={36} />
              </div>
              <h4 className="text-2xl font-semibold mb-3">MyPost</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                내가 분석한 QR 기록을 저장하고
                손쉽게 다시 열람할 수 있습니다.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• 분석 데이터 저장</li>
                <li>• 제목/내역 관리</li>
                <li>• 상세 분석 확인</li>
              </ul>
            </motion.div>
          </div>


        </div>
      </div>

    </div>
  );
}
