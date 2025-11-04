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
    const pageSize = 8;

    useEffect(() => {
        fetchHistory(currentPage);
    }, [currentPage]);

    const fetchHistory = async (page) => {
        setIsLoading(true);
        try {
            // 실제 API 호출 시뮬레이션 (페이지네이션 처리 포함)
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
        // 제목 클릭 시, 해당 분석 결과를 부모 컴포넌트로 전달
        onSelectResult(item);
    };

    // ✅ Community 컴포넌트와 동일한 구조로 변경
    return (
            <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto">

                {/* ✅ 타이틀을 CommonBoard 밖으로 이동 */}
                <h1 className="text-4xl font-bold mb-6">QR Analysis History</h1>

                    <CommonBoard
                    posts={history}
                     isLoading={isLoading}
                     currentPage={currentPage}
                    totalPages={totalPages}
                     onPageChange={setCurrentPage} // ✅ setCurrentPage로 변경 (Community와 동일하게)
                     onItemClick={handleTitleClick}
                     showIndex={false} // 분석 기록은 번호(Index)를 표시하지 않음
                 />
            </div>
        </div>
    );
}