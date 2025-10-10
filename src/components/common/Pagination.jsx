//페이지네이션 컴포넌트
// src/components/common/Pagination.jsx
import React from 'react';
import { Button } from '@/components/ui/button'; // ui/button 컴포넌트를 사용한다고 가정

/**
 * 기본 페이지네이션 컴포넌트
 * @param {number} totalPages - 총 페이지 수
 * @param {number} currentPage - 현재 페이지
 * @param {function} onPageChange - 페이지 변경 시 호출될 함수
 */
export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map(i => i + 1);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </Button>
      {pages.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </Button>
    </div>
  );
};