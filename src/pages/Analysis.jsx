// --- Analysis.jsx ---

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import { CustomAlertDialog } from '@/components/common/CustomAlertDialog';
import { QRScanPanel } from '@/components/analysis/QRScanPanel';
import { AnalysisHistory } from '@/components/analysis/AnalysisHistory';
import AnalysisResultPanel from '@/components/analysis/AnalysisResultPanel';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { getAnalysisResultApi } from '@/api/analysis';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export function Analysis() {
  const { isLoggedIn, isChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const [alertDialogState, setAlertDialogState] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    description: ''
  });

  const [mobileTab, setMobileTab] = useState('scan');
  const titleUpdateRef = useRef(null);


  useEffect(() => {
    const handleAiUpdate = () => setHistoryRefreshKey(prev => prev + 1);
    window.addEventListener("analysis-updated", handleAiUpdate);
    return () => window.removeEventListener("analysis-updated", handleAiUpdate);
  }, []);


  useEffect(() => {
    const resetHandler = () => {
      setAnalysisResult(null);
      setSelectedHistory(null);
      setMobileTab('scan');
    };

    window.addEventListener("analysis-reset", resetHandler);
    return () => window.removeEventListener("analysis-reset", resetHandler);
  }, []);


  const handleReset = () => {
    setAnalysisResult(null);
    setSelectedHistory(null);
    setMobileTab('scan');
  };


  const handleAnalysisResult = useCallback((result, error) => {
    if (error) {
      setAlertDialogState({
        isOpen: true,
        type: 'error',
        title: '오류 발생',
        description:
          typeof error === 'string' ? error : error.message || '분석 중 오류가 발생했습니다.'
      });
      return;
    }

    setAnalysisResult(result);
    setSelectedHistory(null);
    setHistoryRefreshKey(prev => prev + 1);
    setMobileTab('scan');
  }, []);


  useEffect(() => {
    const stateResult = location.state?.analysisResult;
    const stateError = location.state?.analysisError;

    if (!stateResult && !stateError) return;

    if (
      analysisResult &&
      stateResult &&
      analysisResult.analysisId === stateResult.analysisId
    ) return;

    navigate('.', { replace: true, state: null });
    handleAnalysisResult(stateResult, stateError);
  }, [location.state, navigate, handleAnalysisResult, analysisResult]);


  const handleAnalysisStart = (file, url) => {
    navigate('/analyzing-qr', {
      state: { fileToAnalyze: file, extractedUrl: url }
    });

    setAnalysisResult(null);
    setSelectedHistory(null);
    setMobileTab('scan');
  };


  const handleHistorySelect = async (analysisId) => {
    setAnalysisResult(null);
    setSelectedHistory(null);
    setIsDetailLoading(true);

    try {
      const response = await getAnalysisResultApi(analysisId);
      setSelectedHistory(response);
      setMobileTab('history');
    } catch {
      setAlertDialogState({
        isOpen: true,
        type: 'error',
        title: '오류 발생',
        description: '분석 기록을 불러오는 데 실패했습니다.'
      });
    } finally {
      setIsDetailLoading(false);
    }
  };


  const handleTitleUpdated = (id, newTitle) => {
    if (selectedHistory && selectedHistory.analysisId === id) {
      setSelectedHistory(prev => ({ ...prev, analysisTitle: newTitle }));
    } else if (analysisResult && analysisResult.analysisId === id) {
      setAnalysisResult(prev => ({ ...prev, analysisTitle: newTitle }));
    }

    if (titleUpdateRef.current) titleUpdateRef.current(id, newTitle);

    setHistoryRefreshKey(prev => prev + 1);
  };


  if (!isChecked)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );

  if (!isLoggedIn)
    return (
      <AuthPopup
        show={true}
        isMandatory={true}
        onClose={() => navigate('/')}
      />
    );


  const currentResult = selectedHistory || analysisResult;

  const LeftPanelContent = isDetailLoading ? (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
    </div>
  ) : currentResult ? (
    <AnalysisResultPanel
      result={currentResult}
      onTitleUpdated={handleTitleUpdated}
      onReset={handleReset}
    />
  ) : (
    <QRScanPanel
      onAnalysisStart={handleAnalysisStart}
      onAnalysisResult={handleAnalysisResult}
    />
  );


  return (
    <>
      <div
        key={location.search}
        className="px-4 md:px-8 max-w-[1300px] mx-auto pb-4"
      >
        {/* 데스크탑: MyPost 구조 동일 적용 */}
        <div className="hidden lg:flex justify-center gap-8 min-h-[350px]">
          <ResizablePanelGroup direction="horizontal">

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <Card className="h-full w-full p-6 flex items-center justify-center">
                  {LeftPanelContent}
                </Card>
              </div>
            </ResizablePanel>

            {/* 🔥 핸들: MyPost 완전 동일 */}
            <ResizableHandle
              className="
                w-[0.5px] bg-transparent rounded-none relative cursor-col-resize
                after:content-[''] after:absolute
                after:top-[20px] after:bottom-[20px]
                after:left-[calc(50%-1px)] after:-translate-x-1/2 after:w-[1px]
                after:bg-[#E5E5E5] after:rounded-full
                hover:bg-transparent
                hover:after:bg-[#E5E5E5]
              "
            />

            <ResizablePanel minSize={30}>
              <div className="flex flex-col h-full pl-4">
                <AnalysisHistory
                  onSelectResult={handleHistorySelect}
                  refreshKey={historyRefreshKey}
                  titleUpdateRef={titleUpdateRef}
                />
              </div>
            </ResizablePanel>

          </ResizablePanelGroup>
        </div>


        {/* 모바일 레이아웃: 변경 없음 */}
        <div className="w-full mt-4 lg:hidden">
          <div className="flex items-center justify-center mb-3">
            <div className="inline-flex p-1 bg-gray-100 border border-gray-200 rounded-full shadow-sm">
              <button
                onClick={() => setMobileTab('scan')}
                className={`px-4 py-1.5 text-sm rounded-full ${
                  mobileTab === 'scan'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600'
                }`}
              >
                QR 분석
              </button>
              <button
                onClick={() => setMobileTab('history')}
                className={`px-4 py-1.5 text-sm rounded-full ${
                  mobileTab === 'history'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600'
                }`}
              >
                분석 기록
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden border rounded-lg">
            <div
              className="flex w-[200%] transition-transform duration-300 ease-out"
              style={{
                transform:
                  mobileTab === 'scan' ? 'translateX(0)' : 'translateX(-50%)'
              }}
            >
              <div className="w-full">
                <Card className="min-h-[520px] p-4 sm:p-6">
                  {LeftPanelContent}
                </Card>
              </div>

              <div className="w-full">
                <div className="min-h-[520px] p-4 sm:p-6">
                  <AnalysisHistory
                    onSelectResult={handleHistorySelect}
                    refreshKey={historyRefreshKey}
                    titleUpdateRef={titleUpdateRef}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>


      <CustomAlertDialog
        isOpen={alertDialogState.isOpen}
        onClose={() =>
          setAlertDialogState({ ...alertDialogState, isOpen: false })
        }
        type={alertDialogState.type}
        title={alertDialogState.title}
        description={alertDialogState.description}
      />
    </>
  );
}
