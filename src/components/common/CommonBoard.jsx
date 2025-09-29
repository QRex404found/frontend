// 게시판
import React from 'react';
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/common/Pagination';
import { Loader2 } from 'lucide-react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/**
 * CommonBoard 컴포넌트
 * AnalysisHistory와 Community에서 공통으로 사용되는 테이블 및 페이지네이션 구조를 담당합니다.
 * @param {string} title - 게시판 제목 (예: QR Analysis History, 커뮤니티)
 * @param {Array<object>} posts - 표시할 데이터 배열 (게시글 또는 분석 기록)
 * @param {boolean} isLoading - 로딩 상태 여부
 * @param {number} currentPage - 현재 페이지
 * @param {number} totalPages - 총 페이지 수
 * @param {function} onPageChange - 페이지 변경 핸들러
 * @param {function} onItemClick - 항목 클릭 시 상세 정보 핸들러
 * @param {boolean} showIndex - 번호 열을 표시할지 여부 (커뮤니티는 표시, 분석 기록은 생략 가능)
 */

// 날짜 포맷 함수 (YYYY-MM-DD)
const formatPostDate = (dateString) => {
    try {
        const dateObj = new Date(dateString);
        // Date 객체가 유효하지 않은 경우 처리
        if (isNaN(dateObj)) return dateString;

        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch {
        return dateString;
    }
};

export const CommonBoard = ({
    title,
    posts,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    onItemClick,
    showIndex = true,
    caption = ""
}) => {
    // 페이지 크기 (현재는 10으로 고정하여 번호 계산에 사용)
    const pageSize = 8;

    return (
        <div className="flex flex-col min-h-[500px]">
            <CardHeader className="pt-0">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-grow flex flex-col p-0">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full min-h-[300px]">
                        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        {title}에 해당하는 기록이 없습니다.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table className="w-full table-fixed">
                            <TableCaption>{caption}</TableCaption>
                            <TableHeader>
                                <TableRow className="border-b-2 border-gray-300">
                                    {showIndex && <TableHead className="w-[100px] text-sm font-semibold text-center">Num</TableHead>}
                                    <TableHead className="text-sm font-semibold">Title</TableHead>
                                    <TableHead className="text-right w-[150px] text-sm font-semibold">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((item, index) => {
                                    const displayIndex = index + 1 + (currentPage - 1) * pageSize;
                                    const formattedDate = formatPostDate(item.date);

                                    return (
                                        <TableRow
                                            key={item.id || index}
                                            onClick={() => onItemClick(item)}
                                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            {showIndex && <TableCell className="text-center text-gray-600">{displayIndex}</TableCell>}

                                            <TableCell
                                                className={`font-semibold truncate text-base md:text-lg ${showIndex ? '' : 'pl-0'}`}
                                            >
                                                {item.title}
                                            </TableCell>

                                            <TableCell className="text-right text-gray-500">{formattedDate}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                )}

                {totalPages > 1 && (
                    <div className="mt-auto pt-4 flex justify-center">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}
            </CardContent>
        </div>
    );
}