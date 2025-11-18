import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBar from '@/components/common/LoadingBar'; // ⭐ 로딩바 컴포넌트 경로 확인
import { Loader2 } from 'lucide-react';

/**
 * QR 분석 로딩 화면 (AnalyzingQR) 페이지 컴포넌트
 * Analysis.jsx에서 전달받은 파일 정보를 LoadingBar에 전달하여 로딩을 시작합니다.
 */
export default function AnalyzingQR() {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Analysis.jsx에서 navigate state로 전달받은 데이터 가져오기
    const fileToAnalyze = location.state?.fileToAnalyze;
    const extractedUrl = location.state?.extractedUrl; 

    // 2. 파일 정보가 없는 경우 오류 처리 및 리디렉션
    useEffect(() => {
        if (!fileToAnalyze) {
            // 분석 메인 페이지로 즉시 돌려보냅니다.
            navigate('/analysis', { replace: true }); 
        }
    }, [fileToAnalyze, navigate]);


    // 3. 렌더링
    if (!fileToAnalyze) {
        // 파일이 없어서 리디렉션되기 전까지 잠시 로딩 스피너를 보여줍니다.
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    // 파일 정보가 유효할 경우 LoadingBar를 렌더링합니다.
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            
            {/* 추가 1: "Analyzing QR" 제목 텍스트 (굵고 크게) */}
            <h1 className="mb-8 text-4xl font-medium">Analyzing QR</h1> 

            <LoadingBar 
                file={fileToAnalyze} 
                extractedUrl={extractedUrl}
            />
            
            {/* 추가 2: "Please Wait..." 안내 텍스트 (굵고 크게) */}
            <p className="mt-8 text-3xl font-medium text-gray-800">Please Wait...</p>
        </div>
    );
}