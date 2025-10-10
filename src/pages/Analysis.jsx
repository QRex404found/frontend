import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import { CustomAlertDialog } from '@/components/common/CustomAlertDialog';
import { QRScanPanel } from '@/components/analysis/QRScanPanel';
import { AnalysisHistory } from '@/components/analysis/AnalysisHistory';
import AnalysisResultPanel from '@/components/analysis/AnalysisResultPanel';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

/**
 * QR 분석 (Scan, Result, History) 페이지 메인 컴포넌트
 */
export function Analysis() {
    const { isLoggedIn, isChecked } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 상태:
    const [analysisResult, setAnalysisResult] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);

    // Dialog 상태 관리
    const [alertDialogState, setAlertDialogState] = useState({
        isOpen: false,
        title: '',
        message: ''
    });
    
    // ⭐ 1. useEffect: 로딩 페이지에서 돌아왔을 때 결과 처리
    useEffect(() => {
        // useLocation의 state에서 분석 결과를 확인합니다.
        const stateResult = location.state?.analysisResult;
        const stateError = location.state?.analysisError;
        
        // 로딩 페이지에서 돌아오면서 결과 데이터가 있다면 처리합니다.
        if (stateResult || stateError) {
            handleAnalysisResult(stateResult, stateError);
            
            // 결과 처리 후, location.state를 정리합니다. (무한 루프 방지)
            // React Router Dom V6에서는 replace: true 옵션을 사용하거나 navigate를 다시 호출해야 합니다.
            // 여기서는 단순히 state를 사용했으므로, 다음 navigate 시 state를 덮어쓰도록 처리합니다.
            // 명시적으로 state를 제거하려면 navigate('.', { replace: true })를 사용할 수 있습니다.
        }

        // 라우팅 상태 변경 시 상태 초기화 (기존 로직)
        // setAnalysisResult(null);
        // setSelectedHistory(null);
    }, [location.key]); // location.state가 아닌 location.key에 의존하는 기존 로직 유지

    // ⭐ 2. QRScanPanel에서 분석 시작 시 호출 (파일 정보를 state로 전달)
    // QRScanPanel의 onAnalysisStart 함수는 file과 url을 받도록 수정되었습니다.
    const handleAnalysisStart = (file, url) => {
        // 분석 시작 시 로딩 페이지로 이동하면서 file과 url 데이터를 state로 전달합니다.
        navigate('/analyzing-qr', {
            state: { 
                fileToAnalyze: file, // 로딩바에 전달할 파일 객체
                extractedUrl: url    // 서버 분석에 사용할 추출된 URL
            }
        }); 
        setAnalysisResult(null); 
        setSelectedHistory(null);
    };

    // ⭐ 3. AnalyzingQR 페이지(로딩 완료)에서 결과 수신 시 호출
    // 이 함수는 이제 location.state를 통해 결과를 받으므로, 로직을 단순화합니다.
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
        setSelectedHistory(null);
        // Alert Dialog로 결과가 전달된 후, AnalysisResultPanel에 표시됩니다.
    };
    
    // AnalysisHistory에서 항목 클릭 시 호출 (이력 결과를 좌측 패널에 표시)
    const handleHistorySelect = (historyItem) => {
        setSelectedHistory(historyItem);
        setAnalysisResult(null);
    };

    // --- 조건부 렌더링 (Hooks 규칙 준수) ---
    if (!isChecked) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-green-500" /></div>;
    }

    if (!isLoggedIn) {
        return <AuthPopup show={true} isMandatory={true} />;
    }

    // 좌측 패널에 표시할 콘텐츠 결정
    let LeftPanelContent;
    const currentResult = selectedHistory || analysisResult;
    
    if (currentResult) {
        LeftPanelContent = <AnalysisResultPanel result={currentResult} />;
    } else {
        LeftPanelContent = (
            <QRScanPanel 
                // ⭐ 수정된 handleAnalysisStart 함수를 연결
                onAnalysisStart={handleAnalysisStart} 
                // onAnalysisResult는 Analysis.jsx에서 직접 사용하지 않으므로 제거하거나,
                // 아니면 그대로 두고 로딩 페이지에서 처리하도록 유지할 수 있습니다.
                // 여기서는 로직 분리를 위해 제거하고, 결과 수신은 useEffect로 처리합니다.
            />
        );
    }
    
    // --- 최종 렌더링 ---
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 font-inter">QR 코드 분석</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 좌측 패널 (1/2 영역): 스캔, 결과 표시 */}
                <div className="lg:col-span-1 pr-4">
                    <Card className="min-h-[500px] shadow-lg flex items-center justify-center p-6">
                        {LeftPanelContent}
                    </Card>
                </div>

                {/* 우측 패널 (1/2 영역): 분석 이력 목록 */}
                <div className="lg:col-span-1 pl-4">
                    <AnalysisHistory onSelectResult={handleHistorySelect} />
                </div>
            </div>
            
            <CustomAlertDialog
                isOpen={alertDialogState.isOpen}
                onClose={() => setAlertDialogState({ ...alertDialogState, isOpen: false })}
                title={alertDialogState.title}
                message={alertDialogState.message}
            />
        </div>
    );
}