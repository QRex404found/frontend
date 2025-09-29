import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import { CustomAlertDialog } from '@/components/common/CustomAlertDialog';
import { QRScanPanel } from '@/components/analysis/QRScanPanel';
import { AnalysisHistory } from '@/components/analysis/AnalysisHistory';
import AnalysisResultPanel from '@/components/analysis/AnalysisResultPanel';
// import { Card } from '@/components/ui/card'; // Card 컴포넌트 제거
import { Loader2 } from 'lucide-react';

/**
 * QR 분석 (Scan, Result, History) 페이지 메인 컴포넌트
 * 이 컴포넌트는 레이아웃을 구성하고, 분석 결과 또는 이력 선택 결과를 통합 관리합니다.
 */
export function Analysis() {
    const { isLoggedIn, isChecked } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); //useLocation 훅 사용

    // 상태:
    // 1. result: QRScanPanel이 스캔 완료 후 전달한 결과 (새 분석)
    // 2. selectedHistory: AnalysisHistory가 선택한 결과 (이력 조회)
    // 두 상태 중 하나가 존재하면 좌측 패널에 AnalysisResultPanel이 표시됩니다.
    const [analysisResult, setAnalysisResult] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);

    // Dialog 상태 관리
    const [alertDialogState, setAlertDialogState] = useState({
        isOpen: false,
        title: '',
        message: ''
    });

    // 라우팅 상태 변경 시 상태 초기화
    useEffect(() => {
        setAnalysisResult(null);
        setSelectedHistory(null);
    }, [location.key]); // location.key가 변경될 때마다 실행

    // QRScanPanel에서 분석 시작 시 호출 (로딩 페이지로 이동)
    const handleScanStart = () => {
        // Figma 디자인에 따라 전체 화면 로딩 페이지로 이동
        // QRScanPanel은 이 페이지로 이동 후 분석 API를 호출하고, 완료되면 결과를 가지고 돌아옴
        navigate('/analyzing-qr');
    };

    // QRScanPanel 또는 AnalyzingQR 페이지에서 분석 결과 수신 시 호출
    const handleAnalysisResult = (result, error) => {
        if (error) {
            setAlertDialogState({
                isOpen: true,
                title: "분석 실패",
                message: error.message || "QR 분석 중 오류가 발생했습니다."
            });
            return;
        }
        
        setAnalysisResult(result);
        setSelectedHistory(null); // 새 결과가 들어오면 이력 선택 초기화
    };
    
    // AnalysisHistory에서 항목 클릭 시 호출 (이력 결과를 좌측 패널에 표시)
    const handleHistorySelect = (historyItem) => {
        setSelectedHistory(historyItem);
        setAnalysisResult(null); // 이력 선택 시 새 분석 결과 초기화
    };

    // --- 조건부 렌더링 (Hooks 규칙 준수) ---
    if (!isChecked) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-green-500" /></div>;
    }

    if (!isLoggedIn) {
        // 로그인하지 않은 경우 로그인 요청 팝업 띄우기 (Figma PDF 3페이지 참고)
        return <AuthPopup show={true} isMandatory={true} />;
    }

    // 좌측 패널에 표시할 콘텐츠 결정: 이력 선택 > 새 분석 결과 > QR 스캔 버튼
    let LeftPanelContent;
    const currentResult = selectedHistory || analysisResult;
    
    if (currentResult) {
        // 분석 결과 또는 이력 선택 결과 표시
        LeftPanelContent = <AnalysisResultPanel result={currentResult} />;
    } else {
        // 초기 상태: QR 스캔 패널 표시
        LeftPanelContent = (
            <QRScanPanel 
                onScanStart={handleScanStart} // 분석 시작 시 로딩 페이지로 이동
                onAnalysisResult={setAnalysisResult} // 분석 완료 후 결과 저장 (AnalyzingQR에서 돌아올 때 사용)
            />
        );
    }
    
    // --- 최종 렌더링 ---
    return (
        <div className="p-4 md:p-8">
            
            {/* 세로 구분선(divide-x)을 추가하고, 각 열에 padding-x를 줍니다. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-x divide-gray-300">
                
                {/* 좌측 패널 (1/2 영역): 스캔, 결과 표시 */}
                {/* Card 컴포넌트와 그 클래스(shadow-lg, p-6 등)를 제거합니다. */}
                <div className="lg:col-span-1 pr-4">
                    {LeftPanelContent}
                </div>

                {/* 우측 패널 (1/2 영역): 분석 이력 목록 */}
                {/* Card 컴포넌트와 그 클래스를 제거하고, padding-x를 줍니다. */}
                <div className="lg:col-span-1 pl-4">
                    <AnalysisHistory onSelectResult={handleHistorySelect} />
                </div>
            </div>
            {/* 분석 실패 시 호출할 Dialog 컴포넌트 */}
            <CustomAlertDialog
                isOpen={alertDialogState.isOpen}
                onClose={() => setAlertDialogState({ ...alertDialogState, isOpen: false })}
                title={alertDialogState.title}
                message={alertDialogState.message}
            />
        </div>
    );
}