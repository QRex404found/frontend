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
            // 분석 메인 페이지로 즉시 돌려보냄
            navigate('/analysis', { replace: true }); 
        }
    }, [fileToAnalyze, navigate]);


    // 3. 렌더링
    if (!fileToAnalyze) {
        // 파일이 없어서 리디렉션되기 전까지 잠시 로딩 스피너를 보여줌.
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    // 파일 정보가 유효할 경우 LoadingBar를 렌더링.
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            
            <h1 className="mb-8 text-4xl font-normal">Analyzing QR</h1> 

            <LoadingBar 
                file={fileToAnalyze} 
                extractedUrl={extractedUrl}
            />
            <p>분석 중에는 화면을 이동하지 마세요!</p>
        </div>
    );
}