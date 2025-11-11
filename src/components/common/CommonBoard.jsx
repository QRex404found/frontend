import React from 'react';
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
    // 💡 Pagination 관련 import는 유지합니다. CommonBoard를 사용하는 다른 곳에서 필요할 수 있습니다.
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"; // (shadcn/ui)
import { Loader2, CheckIcon } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

// Tailwind 클래스 병합을 위한 유틸리티 함수
const cn = (...classes) => classes.filter(Boolean).join(' ');

// 체크박스 컴포넌트 정의
function Checkbox({ className, ...props }) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-5 shrink-0 rounded-md border-2 shadow-sm transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                className
            )}
            {...props}>
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-white transition-none">
                <CheckIcon className="size-3.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

// 날짜 포맷 함수 (YYYY-MM-DD)
const formatPostDate = (dateString) => {
    try {
        const dateObj = new Date(dateString);
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
    posts,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    onItemClick,
    showIndex = true,
    caption = "",
    // MyPost 전용 속성 추가
    isDeleting = false,
    selectedPosts = [],
    onCheckboxChange = () => { },
    rowHeightClass = "h-16"
}) => {
    const pageSize = 8;

    // 💡 페이지 이동 핸들러 제거 (AnalysisHistory에서 직접 처리)
    /*
    const handlePreviousPage = () => {
        if (!onPageChange) return;
        onPageChange((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        if (!onPageChange) return;
        onPageChange((prev) => Math.min(prev + 1, totalPages));
    };
    */

    return (
        <div>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className={`flex justify-center items-center h-full min-h-[300px] ${rowHeightClass}`}>
                        <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className={`text-center text-gray-500 py-10 ${rowHeightClass}`}>
                        {caption || "표시할 기록이 없습니다."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table className="w-full table-fixed">
                            <TableCaption>{caption}</TableCaption>
                            <TableHeader>
                                <TableRow className="border-b-2 border-gray-300">
                                    {showIndex && (
                                        <TableHead className="w-[100px] text-sm font-semibold text-center relative">
                                            <div className={cn(
                                                "absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                                                isDeleting ? "left-1 opacity-100" : "left-1 opacity-0"
                                            )}>
                                                <Checkbox className="invisible" />
                                            </div>
                                            Num
                                        </TableHead>
                                    )}
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
                                            className={`cursor-pointer hover:bg-gray-50 transition-colors ${rowHeightClass}`}
                                        >
                                            {showIndex && (
                                                <TableCell className="text-center w-[100px] text-gray-600 relative">
                                                    <div className={cn(
                                                        "absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                                                        isDeleting ? "left-1 opacity-100 pointer-events-auto" : "left-1 opacity-0 pointer-events-none"
                                                    )}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Checkbox
                                                            checked={selectedPosts.includes(item.id)}
                                                            onCheckedChange={() => onCheckboxChange(item.id)}
                                                            id={`post-${item.id}`}
                                                            className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-gray-400 focus-visible:ring-green-400"
                                                        />
                                                    </div>
                                                    {displayIndex}
                                                </TableCell>
                                            )}
                                            <TableCell
                                                className={`font-medium truncate text-base md:text-lg ${showIndex ? '' : 'pl-0'}`}
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
            </CardContent>

            {/* 🛑 수정 4: 페이지네이션 렌더링 코드 전체를 삭제합니다. (AnalysisHistory에서 렌더링) */}
            {/* 이전 코드가 여기에 있었음 */}
        </div>
    );
};