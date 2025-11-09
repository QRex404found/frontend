import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { getAnalysisHistoryApi } from '@/api/analysis';
import { CommonBoard } from '@/components/common/CommonBoard';

/**
 * QR 분석 기록 목록과 페이지네이션을 표시하는 컴포넌트입니다.
 */
export function AnalysisHistory({ onSelectResult, refreshKey, titleUpdateRef }) {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 8;

    const fetchingRef = useRef(false);

    useEffect(() => {
        if (!fetchingRef.current) {
            fetchHistory(currentPage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, refreshKey]);

    const fetchHistory = async (page) => {
        fetchingRef.current = true;
        setIsLoading(true);
        try {
            const data = await getAnalysisHistoryApi(page - 1, pageSize);

            const mappedData = data.content.map(item => ({
                id: item.analysisId,
                title: item.analysisTitle || item.analysisUrl,
                date: item.createdAt,
            }));

            setHistory(mappedData);
            setTotalPages(data.totalPages);
            setCurrentPage(page);

        } catch (error) {
            console.error('분석 기록 로드 실패:', error);
            setHistory([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
            fetchingRef.current = false;
        }
    };

    const handleTitleClick = (item) => {
        onSelectResult(item.id);
    };

    useEffect(() => {
        if (titleUpdateRef) {
            titleUpdateRef.current = (id, newTitle) => {
                setHistory(prev =>
                    prev.map(item => item.id === id ? { ...item, title: newTitle } : item)
                );
            };
        }
    }, [titleUpdateRef]);

    return (
        // ✅ 전체 컨테이너를 약 20px 위로 올림
        <div className="p-4 -mt-5 md:p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="mb-6 text-4xl font-medium">QR Analysis History</h1>
                <CommonBoard
                    posts={history}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onItemClick={handleTitleClick}
                    showIndex={false}
                />
            </div>
        </div>
    );
}
