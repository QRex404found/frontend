import React from 'react';
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, CheckIcon } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

const cn = (...classes) => classes.filter(Boolean).join(' ');

// 체크박스 컴포넌트 (기존 유지)
function Checkbox({ className, ...props }) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-5 shrink-0 rounded-md border-2 shadow-sm transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white transition-none">
                <CheckIcon className="size-3.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

const formatPostDate = (dateString) => {
    try {
        const d = new Date(dateString);
        if (isNaN(d)) return dateString;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
    isDeleting = false,
    selectedPosts = [],
    onCheckboxChange = () => { },
    rowHeightClass = "h-16"
}) => {
    const pageSize = 8;

    return (
        <div>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className={`flex justify-center items-center min-h-[300px]`}>
                        <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        {caption || "표시할 기록이 없습니다."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table className="w-full table-fixed">
                            <TableCaption>{caption}</TableCaption>
                            <TableHeader>
                                <TableRow className="border-b-2 border-gray-300">
                                    {/* 1. Num 컬럼: 모바일(50px), PC(100px) - 다시 보이게 수정함 */}
                                    {showIndex && (
                                        <TableHead className="w-[50px] md:w-[100px] text-center text-sm font-medium relative p-0 md:p-4">
                                            {/* 체크박스 영역 (삭제 모드일 때 번호 위로 덮어씌워짐) */}
                                            <div className={cn(
                                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 bg-white z-10", // bg-white 추가해서 숫자 가림
                                                isDeleting ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
                                            )}>
                                                <Checkbox className="invisible" /> {/* 공간 확보용 */}
                                            </div>
                                            {/* 삭제모드가 아닐 때 보이는 텍스트 */}
                                            <span className={isDeleting ? "opacity-0" : "opacity-100"}>
                                                Num
                                            </span>
                                        </TableHead>
                                    )}

                                    {/* 2. Title 컬럼: 나머지 공간 차지 */}
                                    <TableHead className="text-sm font-medium">Title</TableHead>

                                    {/* 3. Date 컬럼: 모바일(숨김), PC(보임) */}
                                    <TableHead className="hidden md:table-cell text-right w-[150px] text-sm font-medium">
                                        Date
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {posts.map((item, index) => {
                                    const displayIndex = index + 1 + (currentPage - 1) * pageSize;
                                    return (
                                        <TableRow
                                            key={item.id || index}
                                            onClick={() => onItemClick(item)}
                                            className={`cursor-pointer hover:bg-gray-50 transition-colors ${rowHeightClass}`}
                                        >
                                            {/* 1. Num 데이터: 모바일에서도 보임 */}
                                            {showIndex && (
                                                <TableCell className="text-center relative w-[50px] md:w-[100px] p-0 md:p-4">
                                                    {/* 체크박스 (삭제 모드 ON) */}
                                                    <div
                                                        className={cn(
                                                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 bg-white z-10",
                                                            isDeleting ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-0 pointer-events-none"
                                                        )}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Checkbox
                                                            checked={selectedPosts.includes(item.id)}
                                                            onCheckedChange={() => onCheckboxChange(item.id)}
                                                        />
                                                    </div>
                                                    
                                                    {/* 번호 (삭제 모드 OFF일 때만 보임) */}
                                                    <span className={cn("text-sm text-gray-500", isDeleting ? "opacity-0" : "opacity-100")}>
                                                        {displayIndex}
                                                    </span>
                                                </TableCell>
                                            )}

                                            {/* 2. Title 데이터 */}
                                            <TableCell className="font-light text-base md:text-lg align-middle">
                                                <div className="flex flex-col justify-center h-full min-w-0">
                                                    <div className="truncate w-full">
                                                        {item.title}
                                                    </div>
                                                    {/* 모바일 전용 날짜 (제목 바로 아래) */}
                                                    <div className="text-xs text-gray-400 mt-0.5 md:hidden">
                                                        {formatPostDate(item.date)}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* 3. Date 데이터: PC에서만 보임 */}
                                            <TableCell className="hidden md:table-cell text-right text-gray-500">
                                                {formatPostDate(item.date)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            {/* Pagination (기존 유지) */}
            {totalPages > 1 && onPageChange && (
                <div className="flex justify-center pt-3 pb-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onPageChange(prev => Math.max(prev - 1, 1)); }}
                                    aria-disabled={currentPage === 1}
                                    className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                                />
                            </PaginationItem>

                            <PaginationItem>
                                <span className="px-4 py-2 text-sm">
                                    Page {currentPage} / {totalPages}
                                </span>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onPageChange(prev => Math.min(prev + 1, totalPages)); }}
                                    aria-disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};