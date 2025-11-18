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

  // 🔥 History만 강제로 새로고침시키는 트리거
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const [alertDialogState, setAlertDialogState] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    description: ''
  });

  const [mobileTab, setMobileTab] = useState('scan');
  const titleUpdateRef = useRef(null);

  /* ---------------------------------------------
     QR 분석 완료 시 처리
  --------------------------------------------- */
  const handleAnalysisResult = useCallback((result, error) => {
    if (error) {
      setAlertDialogState({
        isOpen: true,
        type: 'error',
        title: '오류 발생',
        description:
          typeof error === 'string'
            ? error
            : error.message || '분석 중 오류가 발생했습니다.'
      });
      return;
    }

    // 분석 완료 시 LeftPanel을 result 화면으로 전환
    setAnalysisResult(result);
    setSelectedHistory(null);

    // 이 경우에만 History 목록 새로 fetch
    setHistoryRefreshKey(prev => prev + 1);

    setMobileTab('scan');
  }, []);


  /* ---------------------------------------------
     라우터 state로 전달된 분석 결과 처리
  --------------------------------------------- */
  useEffect(() => {
    const stateResult = location.state?.analysisResult;
    const stateError = location.state?.analysisError;

    if (stateResult || stateError) {
      if (
        analysisResult &&
        stateResult &&
        analysisResult.analysisId === stateResult.analysisId
      ) return;

      navigate('.', { replace: true, state: null });
      handleAnalysisResult(stateResult, stateError);
    }
  }, [location.state, navigate, handleAnalysisResult, analysisResult]);


  /* ---------------------------------------------
     새로운 파일 분석 시작
  --------------------------------------------- */
  const handleAnalysisStart = (file, url) => {
    navigate('/analyzing-qr', {
      state: { fileToAnalyze: file, extractedUrl: url }
    });

    setAnalysisResult(null);
    setSelectedHistory(null);
    setMobileTab('scan');
  };


  /* ---------------------------------------------
     History 목록에서 항목 선택 → 상세 데이터 가져오기
  --------------------------------------------- */
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


  /* ---------------------------------------------
     제목 수정 후 상태 즉시 반영 + History만 새로고침
  --------------------------------------------- */
  const handleTitleUpdated = (id, newTitle) => {
    // LeftPanel 수정
    if (selectedHistory && selectedHistory.analysisId === id) {
      setSelectedHistory(prev => ({ ...prev, analysisTitle: newTitle }));
    } else if (analysisResult && analysisResult.analysisId === id) {
      setAnalysisResult(prev => ({ ...prev, analysisTitle: newTitle }));
    }

    // History 목록 로컬 업데이트
    if (titleUpdateRef.current) {
      titleUpdateRef.current(id, newTitle);
    }

    // 서버 최신 데이터로 History만 다시 새로고침
    setHistoryRefreshKey(prev => prev + 1);
  };


  if (!isChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <AuthPopup
        show={true}
        isMandatory={true}
        onClose={() => navigate('/')}
      />
    );
  }


  // 현재 왼쪽 패널에 표시할 데이터
  const currentResult = selectedHistory || analysisResult;

  // LeftPanel 렌더링 콘텐츠
  const LeftPanelContent = isDetailLoading ? (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
    </div>
  ) : currentResult ? (
    <AnalysisResultPanel
      result={currentResult}
      onTitleUpdated={handleTitleUpdated}
    />
  ) : (
    <QRScanPanel
      onAnalysisStart={handleAnalysisStart}
      onAnalysisResult={handleAnalysisResult}
    />
  );


  return (
    <>
      <div className="px-4 md:px-8 max-w-[1300px] mx-auto pb-4">

        {/* ---- 데스크탑 레이아웃 ---- */}
        <div className="hidden lg:flex justify-center gap-8 min-h-[350px]">
          <ResizablePanelGroup direction="horizontal">

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="max-w-[550px] mx-auto h-full flex flex-col">
                <Card className="flex items-center justify-center w-full h-full p-6">
                  {LeftPanelContent}
                </Card>
              </div>
            </ResizablePanel>

            <ResizableHandle />

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


        {/* ---- 모바일 레이아웃 ---- */}
        <div className="w-full mt-4 lg:hidden">

          <div className="flex items-center justify-center mb-3">
            <div className="inline-flex p-1 bg-gray-100 border border-gray-200 rounded-full shadow-sm">
              <button
                onClick={() => setMobileTab('scan')}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                  mobileTab === 'scan'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                QR 분석
              </button>

              <button
                onClick={() => setMobileTab('history')}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                  mobileTab === 'history'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
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
