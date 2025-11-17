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

    useEffect(() => {
        if (!fetchingRef.current) fetchHistory(currentPage);
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
            setTotalPages(data.totalPages || 1);
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
                onItemClick={handleTitleClick}
                showIndex={true}
                rowHeightClass="h-12"
            />
        </div>
    );
}
