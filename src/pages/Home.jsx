// src/pages/Home.jsx

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  QrCode,
  Users,
  FileText,
  ArrowRight,
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
      {/* SECTION 1 — HERO */}
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

        {/* 아래 화살표 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={scrollToInfo}
                  className="p-2 bg-transparent text-white opacity-90 hover:opacity-100 transition"
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
                <p>Learn More</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>



      {/* ====================================================== */}
      {/* SECTION 2 — ABOUT */}
      {/* ====================================================== */}
      <div
        ref={infoSectionRef}
        className="w-full bg-white text-slate-900 py-36 px-6"
      >
        <div className="max-w-6xl mx-auto">

          {/* Header + fadeUp */}
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
            <p className="text-slate-500 text-xl max-w-3xl mx-auto">
              QRex는 QR 분석, 위험 탐지, 커뮤니티, 이력 관리까지
              한 번에 제공하는 지능형 QR 보안 플랫폼입니다.
            </p>
          </motion.div>



          {/* ====================================================== */}
          {/* WHAT IS QREX — 좌↔우 애니메이션 */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-40 items-center">

            {/* LEFT: 텍스트 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-semibold mb-6">QRex란?</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                QRex는 URL 패턴 분석, 도메인 신뢰도 검증,
                파라미터 분석을 통해 안전한 QR 경험을 제공합니다.
                커뮤니티와 개인 기록 관리 기능까지 완비된
                차세대 QR 보안 플랫폼입니다.
              </p>

              <button className="px-8 py-4 bg-lime-500 text-white rounded-xl font-semibold hover:bg-lime-600 transition">
                시작하기
              </button>
            </motion.div>

            {/* RIGHT: 아이콘 박스 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-14 flex justify-center"
            >
              <QrCode className="w-36 h-36 text-lime-600" />
            </motion.div>

          </div>



          {/* ====================================================== */}
          {/* SECTION — 3 COLUMN FEATURES */}
          {/* ====================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">

            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition"
            >
              <div className="p-4 bg-lime-100 text-lime-600 rounded-xl inline-block mb-6">
                <QrCode size={36} />
              </div>
              <h4 className="text-2xl font-semibold mb-3">Analysis</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                URL 위험도∙도메인 신뢰도∙파라미터 구조를
                정밀하게 분석하여 보안 위협 여부를 판단합니다.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• 위험도 자동 분석</li>
                <li>• 도메인 검증</li>
                <li>• 파라미터 구조 분석</li>
              </ul>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition"
            >
              <div className="p-4 bg-lime-100 text-lime-600 rounded-xl inline-block mb-6">
                <Users size={36} />
              </div>
              <h4 className="text-2xl font-semibold mb-3">Community</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                사용자들이 직접 올린 분석 경험과 사례를 공유하며
                현실적인 보안 인사이트를 얻을 수 있습니다.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• 사용자 기반 정보 공유</li>
                <li>• QR 관련 실제 사례</li>
                <li>• 최신 보안 트렌드 토론</li>
              </ul>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-10 rounded-3xl border shadow-sm hover:shadow-md transition"
            >
              <div className="p-4 bg-lime-100 text-lime-600 rounded-xl inline-block mb-6">
                <FileText size={36} />
              </div>
              <h4 className="text-2xl font-semibold mb-3">MyPost</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                내가 분석한 QR 기록을 모아보고
                제목 수정·삭제·상세 보기까지 지원합니다.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>• 분석 기록 자동 저장</li>
                <li>• 제목/내용 수정</li>
                <li>• 분석 결과 상세 보기</li>
              </ul>
            </motion.div>

          </div>



          {/* ====================================================== */}
          {/* CTA */}
          {/* ====================================================== */}
          <div className="rounded-3xl p-20 text-center bg-slate-900 text-white">

            <h3 className="text-3xl font-semibold mb-4">
              보안은 선택이 아니라 필수입니다.
            </h3>
            <p className="text-slate-300 mb-10">
              QRex는 당신의 QR 사용 경험을 완전히 바꿉니다.
            </p>

            <button className="px-12 py-4 bg-lime-500 text-slate-900 font-semibold rounded-xl hover:bg-lime-400 transition">
              시작하기
            </button>

          </div>













        </div>
      </div>

    </div>
  );
}
