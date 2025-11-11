// src/pages/Analysis.jsx

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
    // [수정 1] MyPost와 동일하게 수평/하단 패딩만 적용
    <div className="px-4 md:px-8 pb-8">
      {/* ✅ 큰 화면: 좌/우 패널 */}
      <div className="hidden lg:flex w-full min-h-[500px]">
        <ResizablePanelGroup direction="horizontal" className="w-full">

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col justify-between">
              
              {/* ⬇️ [수정 2] 여기에 pt-0, md:pt-0 추가 (좌/우 상단 정렬) */}
              <div className="p-4 md:p-8 px-10 flex-1 pt-0 md:pt-0"> 
                <Card className="h-full w-full shadow-lg p-6 flex items-center justify-center">
                  {LeftPanelContent}
                </Card>
              </div>
              <div className="py-10" />
            </div>
          </ResizablePanel>

          <ResizableHandle className="px-[1px] cursor-col-resize">
            <div className="w-[1px] h-[85%] bg-gray-300 hover:bg-gray-400 transition-colors rounded" />
          </ResizableHandle>

          <ResizablePanel minSize={30}>
             {/* ⬇️ 여기(오른쪽 패널)는 pt-0 (pl-4만 있으므로)
                그래서 [수정 2]에서 왼쪽 패널도 pt-0으로 맞춘 것입니다.
             */}
            <div className="pl-4 h-full flex flex-col">
              <AnalysisHistory
                onSelectResult={handleHistorySelect}
                refreshKey={historyRefreshKey}
                titleUpdateRef={titleUpdateRef}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* ✅ 작은 화면 */}
      {/* [수정 3] MyPost와 동일하게 mt-4 추가 */}
      <div className="lg:hidden mt-4 w-full">
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

        <div className="overflow-hidden rounded-lg border">
          <div
            className="flex w-[200%] transition-transform duration-300 ease-out"
            style={{ transform: mobileTab === 'scan' ? 'translateX(0)' : 'translateX(-50%)' }}
          >
            <div className="w-1w-1/2">
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