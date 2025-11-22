import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBar from '@/components/common/LoadingBar';
import { Loader2 } from 'lucide-react';

/**
  QR 분석 로딩 화면 (AnalyzingQR) 페이지 컴포넌트
  Analysis.jsx에서 전달받은 파일 정보를 LoadingBar에 전달하여 로딩을 시작.
 */
export default function AnalyzingQR() {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Analysis.jsx에서 navigate state로 전달받은 데이터 가져옴
    const fileToAnalyze = location.state?.fileToAnalyze;
    const extractedUrl = location.state?.extractedUrl; 

    // 2. 파일 정보가 없는 경우 오류 처리 및 리디렉션
    useEffect(() => {
        if (!fileToAnalyze) {
            navigate('/analysis', { replace: true });
        }
    }, [fileToAnalyze, navigate]);


    // 파일이 없을 때 — redirect 직전 잠깐 표시
    if (!fileToAnalyze) {
        return (
            <div
                className="w-full flex items-center justify-center bg-white overflow-hidden"
                style={{ minHeight: 'calc(100vh - 80px)' }} // 80px = Header height
            >
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    return (
        <div
            className="w-full flex flex-col items-center justify-center bg-white overflow-hidden"
            style={{ minHeight: 'calc(100vh - 80px)' }} // Header 제외 전체 중 정확한 중앙
        >
            <h1 className="mb-8 text-4xl font-normal">Analyzing QR</h1>

            <LoadingBar
                file={fileToAnalyze}
                extractedUrl={extractedUrl}
            />

            <p className="mt-4 text-gray-600">
                분석 중에는 화면을 이동하지 마세요!
            </p>
        </div>
    );
}
