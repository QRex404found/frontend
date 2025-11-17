// --- AnalysisHistory.jsx ---

import React, { useState, useEffect, useRef } from 'react';
import { getAnalysisHistoryApi } from '@/api/analysis';
import { CommonBoard } from '@/components/common/CommonBoard';

export function AnalysisHistory({ onSelectResult, refreshKey, titleUpdateRef }) {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const pageSize = 8;
    const fetchingRef = useRef(false);

    /* ------------------------------------------------
       refreshKey 또는 페이지 변경 시 서버에서 다시 fetch
    --------------------------------------------------- */
    useEffect(() => {
        if (!fetchingRef.current) fetchHistory(currentPage);
    }, [currentPage, refreshKey]);

    /* ------------------------------------------------
       실제 fetch 함수
    --------------------------------------------------- */
    const fetchHistory = async (page) => {
        fetchingRef.current = true;
        setIsLoading(true);

        try {
            const data = await getAnalysisHistoryApi(page - 1, pageSize);

            const mapped = data.content.map(item => ({
                id: item.analysisId,
                title: item.analysisTitle || item.analysisUrl,
                date: item.createdAt,
            }));

            setHistory(mapped);
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            console.error('분석 기록 로드 실패:', err);
            setHistory([]);
            setTotalPages(1);

        } finally {
            setIsLoading(false);
            fetchingRef.current = false;
        }
    };


    /* ------------------------------------------------
       제목 수정 시 History 목록 즉시 반영 (로컬 수정)
    --------------------------------------------------- */
    useEffect(() => {
        if (!titleUpdateRef) return;

        titleUpdateRef.current = (id, newTitle) => {
            setHistory(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, title: newTitle } : item
                )
            );
        };
    }, []);


    return (
        <div className="w-full px-2 md:px-4 py-2 flex flex-col">
            <h1 className="mb-6 text-3xl font-semibold hidden lg:block">
                QR Analysis History
            </h1>

            <CommonBoard
                posts={history}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onItemClick={(item) => onSelectResult(item.id)}
                showIndex={true}
                rowHeightClass="h-12"
            />
        </div>
    );
}
