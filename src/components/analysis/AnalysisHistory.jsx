import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react'; 
import { getAnalysisHistoryApi } from '@/api/analysis'; 
import { CommonBoard } from '@/components/common/CommonBoard';

// 더미 데이터 (분석 기록 시뮬레이션)
const DUMMY_HISTORY = Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    title: `QR 분석 기록 ${i + 1}`,
    date: `2025-09-${(i % 30) + 1}`,
    url: `https://result-${i + 1}.com`,
    status: i % 3 === 0 ? '위험' : i % 3 === 1 ? '주의' : '안전',
    ipAddress: `192.168.1.${(i % 255) + 1}`,
}));

/**
 * QR 분석 기록 목록과 페이지네이션을 표시하는 컴포넌트입니다.
 * @param {function} onSelectResult - 목록 항목 클릭 시 해당 결과를 부모에게 전달하는 콜백 함수
 */
export function AnalysisHistory({ onSelectResult }) {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 8; // 페이지 크기는 AnalysisHistory에서 관리

    useEffect(() => {
        fetchHistory(currentPage);
    }, [currentPage]);

    const fetchHistory = async (page) => {
        setIsLoading(true);
        try {
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            
            const totalElements = DUMMY_HISTORY.length;
            const totalPagesCalculated = Math.ceil(totalElements / pageSize);
            const paginatedData = DUMMY_HISTORY.slice(start, end);

            setHistory(paginatedData);
            setTotalPages(totalPagesCalculated);
            setCurrentPage(page);
        } catch (error) {
            console.error('분석 기록 로드 실패:', error);
            setHistory([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTitleClick = (item) => {
        onSelectResult(item);
    };

    return (
        <div className="flex-1"> {/* ✅ 상위 컨테이너 유지 */}
            <CommonBoard
                posts={history}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchHistory}
                onItemClick={handleTitleClick}
                showIndex={false}
            />
        </div>
    );
}