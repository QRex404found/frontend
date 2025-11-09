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

  const [mobileTab, setMobileTab] = useState('scan'); // scan | history
  const titleUpdateRef = useRef(null);

  const handleAnalysisResult = useCallback((result, error) => {
    if (error) {
      setAlertDialogState({
        isOpen: true,
        type: 'error',
        title: '오류 발생',
        description: typeof error === 'string' ? error : error.message || '분석 중 오류가 발생했습니다.'
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

    if (stateResult || stateError) {
      if (analysisResult && stateResult && analysisResult.analysisId === stateResult.analysisId) return;
      navigate('.', { replace: true, state: null });
      handleAnalysisResult(stateResult, stateError);
    }
  }, [location.state, navigate, handleAnalysisResult, analysisResult]);

  const handleAnalysisStart = (file, url) => {
    navigate('/analyzing-qr', { state: { fileToAnalyze: file, extractedUrl: url } });
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
    } catch (error) {
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
  };

  if (!isChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthPopup show={true} isMandatory={true} />;
  }

  const currentResult = selectedHistory || analysisResult;
  const LeftPanelContent = isDetailLoading ? (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-green-500" />
    </div>
  ) : currentResult ? (
    <AnalysisResultPanel
      result={currentResult}
      onTitleUpdated={(newTitle) => handleTitleUpdated(currentResult.analysisId, newTitle)}
    />
  ) : (
    <QRScanPanel
      onAnalysisStart={handleAnalysisStart}
      onAnalysisResult={handleAnalysisResult}
    />
  );

  return (
    <div className="p-4 md:p-8 -mt-[20px]">
      <h1 className="hidden lg:block text-3xl font-medium mb-6 font-inter">QR 코드 분석</h1>

      {/* ✅ 큰 화면: 좌/우 패널 (랩퍼에 hidden/lg:flex 적용) */}
      <div className="hidden lg:flex w-full min-h-[500px]">
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="px-10">
              <Card className="min-h-[520px] shadow-lg p-6 flex items-center justify-center">
                {LeftPanelContent}
              </Card>
            </div>
          </ResizablePanel>

          <ResizableHandle className="px-[1px] cursor-col-resize">
            <div className="w-[1px] h-[85%] bg-gray-300 hover:bg-gray-400 transition-colors rounded -mt-[40px]" />
          </ResizableHandle>

          <ResizablePanel minSize={30}>
            <div className="pl-4">
              <AnalysisHistory
                onSelectResult={handleHistorySelect}
                refreshKey={historyRefreshKey}
                titleUpdateRef={titleUpdateRef}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* ✅ 작은 화면: 세그먼트 + 슬라이드 UI */}
      <div className="lg:hidden w-full">

        {/* Segmented */}
        <div className="mb-3 flex items-center justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setMobileTab('scan')}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                mobileTab === 'scan'
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              QR 분석
            </button>
            <button
              onClick={() => setMobileTab('history')}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                mobileTab === 'history'
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              분석 기록
            </button>
          </div>
        </div>

        {/* Slide */}
        <div className="overflow-hidden rounded-lg border">
          <div
            className="flex w-[200%] transition-transform duration-300 ease-out"
            style={{ transform: mobileTab === 'scan' ? 'translateX(0)' : 'translateX(-50%)' }}
          >
            <div className="w-1/2">
              <Card className="min-h-[520px] shadow-lg p-4 sm:p-6">
                {LeftPanelContent}
              </Card>
            </div>

            <div className="w-1/2">
              <div className="p-4 sm:p-6">
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

      <CustomAlertDialog
        isOpen={alertDialogState.isOpen}
        onClose={() => setAlertDialogState({ ...alertDialogState, isOpen: false })}
        type={alertDialogState.type}
        title={alertDialogState.title}
        description={alertDialogState.description}
      />
    </div>
  );
}
