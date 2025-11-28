// src/pages/Home.jsx

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import videoBg from '@/assets/background.mp4';

// 이미지 import. 이미지 배경 제거.
import holdingQR from '@/assets/holding_QR.png';
import analysisImg from '@/assets/Analysis.png';
import heartImg from '@/assets/Heart.png';
import mypostImg from '@/assets/mypost.png';
import {
    ChevronDown,
    QrCode,
    Users,
    FileText,
    ShieldCheck,
    Globe,
    AlertTriangle,
    MessageSquare,
    Lightbulb,
    Flag,
    Save,
    Edit3,
    Search,
} from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function Home() {
    const infoSectionRef = useRef(null);

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // 🧲 홈 화면에서만 확대/축소 완전 차단 + 나가면 복구
    useEffect(() => {
        const meta = document.querySelector('meta[name=viewport]');
        if (meta) {
            meta.setAttribute(
                "content",
                "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            );
        }
        return () => {
            if (meta) {
                meta.setAttribute("content", "width=device-width, initial-scale=1.0");
            }
        };
    }, []);

    const scrollToInfo = () => {
        infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleStart = () => {
        if (!isLoggedIn) navigate("/login");
        else navigate("/analysis");
    };

    return (
        <div className="w-full">

            {/* HERO SECTION */}
            <div
                className="
          relative w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]
          -ml-4 -mr-4 -mt-4 md:-ml-8 md:-mr-8 md:-mt-8
          h-[100dvh] md:h-[calc(100vh-80px)]
          overflow-hidden
        "
            >
                <video
                    src={videoBg}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 object-contain w-full h-full"
                />

                {/* Scroll Arrow */}
                <div className="absolute z-10 -translate-x-1/2 bottom-20 md:bottom-10 left-1/2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={scrollToInfo}
                                    className="p-2 text-white transition opacity-90 hover:opacity-100"
                                >
                                    <ChevronDown
                                        size={42}
                                        strokeWidth={1.5}
                                        className="filter drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)]"
                                    />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                className="text-white bg-black/80 border-white/10 backdrop-blur-md"
                            >
                                Learn More
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>


            {/* ABOUT SECTION */}
            <div ref={infoSectionRef} className="px-6 bg-white text-slate-900 py-28">
                <div className="max-w-6xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <h2 className="mb-6 text-5xl font-medium tracking-tight">
                            QR 보안을 <span className="text-lime-600">더 스마트하게.</span>
                        </h2>

                        <p className="max-w-3xl mx-auto text-xl leading-relaxed text-slate-500">
                            QRex는 QR 분석, 위험 탐지, 커뮤니티, 이력 관리까지<br />
                            한 번에 제공하는 지능형 QR 보안 플랫폼입니다.
                        </p>
                    </motion.div>

                    {/* WHAT IS QREX */}
                    <div className="flex flex-col items-center justify-between gap-20 mb-20 md:flex-row md:items-start">

                        {/* LEFT: Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            className="flex-1 md:pl-4"
                        >
                            <h3 className="mb-6 text-4xl font-medium">QRex란?</h3>
                            <p className="mb-10 text-xl leading-relaxed text-slate-600">
                                QRex는 URL 구조 분석, 도메인 신뢰도 판단, AI 기반 위험 해석을 결합해<br />
                                QR 링크의 안전성을 종합적으로 평가하는 지능형 보안 플랫폼입니다.<br /><br />

                                URL 위험 요소 탐지뿐 아니라,<br />
                                사용자 경험 기반 보안 인사이트 공유, 분석 기록의 지속 관리를 지원하여<br />
                                일상 속 QR 사용을 더 안전하고 스마트하게 만들어줍니다.

                                <br/><br/>더 안전한 일상을 위한 첫 걸음, QRex와 함께하세요!
                            </p>

                            <button
                                onClick={handleStart}
                                className="px-8 py-4 font-medium text-white transition bg-lime-500 rounded-xl hover:bg-lime-600"
                            >
                                Explore QRex
                            </button>
                        </motion.div>

                        {/* RIGHT IMAGE BOX */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="
      flex-1
      flex items-center justify-center
      bg-white border border-slate-200 rounded-3xl
      md:max-w-[420px] md:max-h-[420px]
      w-[260px] h-[260px] md:w-full md:h-auto
      aspect-square
      mx-auto md:mx-0
      overflow-hidden
    "
                        >
                            <img
                                src={holdingQR}
                                alt="QRex Illustration"
                                className="object-contain w-full h-full mix-blend-multiply"
                            />
                        </motion.div>

                    </div>



                    {/* CTA SECTION */}
                    <div className="relative my-24 overflow-hidden border bg-slate-50 border-slate-200 rounded-3xl p-14">

                        {/* 배경 애니메이션 (원본 유지) */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.12]">
                            <motion.svg width="100%" height="100%" viewBox="0 0 800 200">
                                <motion.path
                                    d="M0 120 C 150 20, 300 180, 450 60 C 600 -20, 750 150, 800 80"
                                    stroke="#7CCF00"
                                    strokeWidth="45"
                                    strokeLinecap="round"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.8, ease: "easeInOut" }}
                                />
                            </motion.svg>
                        </div>

                        {/* 제목: mb-8 -> mb-14로 변경 (컨테이너 패딩 p-14와 간격 맞춤) */}
                        <h3 className="relative z-10 text-3xl font-medium text-center mb-14">
                            QRex는 당신의 안전한 QR 사용을 돕습니다
                        </h3>

                        {/* 그리드 박스: mb-4 제거 (하단은 이미 부모의 p-14가 담당함) */}
                        <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-3">

                            <div className="p-6 text-center">
                                <QrCode size={44} className="mx-auto mb-4 text-lime-600" />
                                <h4 className="mb-2 text-xl font-medium">정확한 URL 분석</h4>
                                <p className="text-sm leading-relaxed text-slate-500">
                                    URL 구조, IP, 도메인 신뢰도를 기반으로 <br />위험도를 판단합니다.
                                </p>
                            </div>

                            <div className="p-6 text-center">
                                <Users size={44} className="mx-auto mb-4 text-lime-600" />
                                <h4 className="mb-2 text-xl font-medium">보안 경험 공유</h4>
                                <p className="text-sm leading-relaxed text-slate-500">
                                    QR 관련 정보와 사례를 함께 나눌 수 있습니다.<br/>다른 사용자들과 의견을 공유해보세요!
                                </p>
                            </div>

                            <div className="p-6 text-center">
                                <FileText size={44} className="mx-auto mb-4 text-lime-600" />
                                <h4 className="mb-2 text-xl font-medium">분석 이력 관리</h4>
                                <p className="text-sm leading-relaxed text-slate-500">
                                    스캔한 QR 분석 결과를 한곳에서 <br />쉽게 관리하세요.
                                </p>
                            </div>

                        </div>
                    </div>
                    {/* FEATURE 3-COLUMN */}
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

                        {/* =============================== */}
                        {/* Analysis */}
                        {/* =============================== */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center p-10 text-center transition border shadow-sm rounded-3xl hover:shadow-md"
                        >
                            <div className="inline-block w-32 h-32 mb-6 overflow-hidden rounded-xl">
                                <img
                                    src={analysisImg}
                                    alt="Analysis"
                                    className="object-contain w-full h-full mix-blend-multiply"
                                />
                            </div>

                            <h4 className="mb-3 text-2xl font-medium">Analysis</h4>

                            <p className="flex-grow mb-6 leading-relaxed text-slate-600">
                                URL 위험도·도메인 신뢰도·URL 패턴을 종합 분석해
                                보안 위협 여부를 판단합니다.
                            </p>

                            {/* 🔹 리스트 - 완전 복원 */}
                            <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <ShieldCheck className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">URL 위험도 분석</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <Globe className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">도메인 신뢰도 검증</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <AlertTriangle className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">URL 리스크 설명 제공</span>
                                </div>
                            </div>
                        </motion.div>




                        {/* =============================== */}
                        {/* Community */}
                        {/* =============================== */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center p-10 text-center transition border shadow-sm rounded-3xl hover:shadow-md"
                        >
                            <div className="inline-block w-32 h-32 mb-6 overflow-hidden rounded-xl">
                                <img
                                    src={heartImg}
                                    alt="Community"
                                    className="object-contain w-full h-full mix-blend-multiply"
                                />
                            </div>

                            <h4 className="mb-3 text-2xl font-medium">Community</h4>

                            <p className="flex-grow mb-6 leading-relaxed text-slate-600">
                                사용자 경험 기반 사례로
                                실질적인 보안 인사이트를 제공합니다.
                            </p>

                            <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <MessageSquare className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">사용자 사례 공유</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <Lightbulb className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">보안 인사이트 교류</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <Flag className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">신고 & 위험 URL 제보</span>
                                </div>
                            </div>
                        </motion.div>




                        {/* =============================== */}
                        {/* MyPost */}
                        {/* =============================== */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center p-10 text-center transition border shadow-sm rounded-3xl hover:shadow-md"
                        >
                            <div className="inline-block w-32 h-32 mb-6 overflow-hidden rounded-xl">
                                <img
                                    src={mypostImg}
                                    alt="MyPost"
                                    className="object-contain w-full h-full mix-blend-multiply"
                                />
                            </div>

                            <h4 className="mb-3 text-2xl font-medium">My post</h4>

                            <p className="flex-grow mb-6 leading-relaxed text-slate-600">
                                분석한 QR 기록을 저장하고
                                언제든 빠르게 다시 확인할 수 있습니다.
                            </p>

                            {/* 🔹 리스트 - 완전 복원 */}
                            <div className="grid grid-cols-1 gap-3 w-full max-w-[260px] mx-auto">
                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <Save className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">분석 기록 자동 저장</span>
                                </div>

                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <Edit3 className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">제목 & 내용 관리</span>
                                </div>

                                <div className="flex items-center gap-3 p-4 transition-all border rounded-xl bg-lime-50/70 border-lime-200/40 hover:bg-lime-100/80">
                                    <Search className="w-5 h-5 text-lime-600/80" />
                                    <span className="text-sm font-medium text-slate-700">상세 분석 보기</span>
                                </div>
                            </div>

                        </motion.div>

                    </div>
                </div>
            </div>

        </div>
    );
}
