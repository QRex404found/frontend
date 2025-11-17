import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { getAnalysisHistoryApi } from '@/api/analysis';
import { CommonBoard } from '@/components/common/CommonBoard';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function AnalysisHistory({ onSelectResult, refreshKey, titleUpdateRef }) {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const pageSize = 8;
    const fetchingRef = useRef(false);

    // 🔥 페이지 변경 / refreshKey 변경 시 fetch
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

    // 🔥 제목 변경 즉시 반영
    useEffect(() => {
        if (!titleUpdateRef) return;

        titleUpdateRef.current = (id, newTitle) => {
            setHistory(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, title: newTitle } : item
                )
            );
        };
    }, [titleUpdateRef]);

    return (
        <div className="w-full px-2 md:px-4 py-2 flex flex-col">

            {/* 제목 */}
            <h1 className="mb-6 text-3xl font-semibold hidden lg:block">
                QR Analysis History
            </h1>

            {/* 게시판 */}
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

            {/* 페이지네이션 — MyPost와 동일하게 게시판 바로 아래 */}
            <div className="py-4 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(prev => Math.max(prev - 1, 1));
                                }}
                                disabled={currentPage === 1}
                                aria-disabled={currentPage === 1}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <span className="px-4 py-2 text-sm">
                                Page {currentPage} / {totalPages < 1 ? 1 : totalPages}
                            </span>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                }}
                                disabled={currentPage === totalPages || totalPages < 1}
                                aria-disabled={currentPage === totalPages || totalPages < 1}
                                className={(currentPage === totalPages || totalPages < 1) ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

        </div>
    );
}
