// src/components/analysis/AnalysisHistory.jsx (이 코드로 파일 전체를 덮어쓰세요)

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

  useEffect(() => {
    if (!fetchingRef.current) {
      fetchHistory(currentPage);
    }
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

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 -mt-5 flex-1">
        <h1 className="mb-6 text-4xl font-medium">QR Analysis History</h1>
        <CommonBoard
          posts={history}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          // onPageChange={setCurrentPage} // CommonBoard 자체 페이지네이션 사용 안 함
          onItemClick={handleTitleClick}
          showIndex={false}
        />
      </div>

      <div className="py-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePreviousPage();
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
                // ⬇️ [수정] 여기 있던 '_' 제거
                onClick={(e) => {
                  e.preventDefault();
                  handleNextPage();
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