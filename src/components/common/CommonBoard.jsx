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
                                    {/* 1. Num 컬럼 Header */}
                                    {showIndex && (
                                        <TableHead className="w-[50px] md:w-[100px] text-center text-sm font-medium p-0 md:p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* [데스크탑용] 삭제 모드일 때만 보이는 공간 확보용 투명 체크박스 */}
                                                {isDeleting && <Checkbox className="invisible hidden md:block" />}
                                                
                                                {/* Num 텍스트 */}
                                                <span className={isDeleting ? "hidden md:inline" : "inline"}>
                                                    Num
                                                </span>

                                                {/* [모바일용] 삭제 모드일 때 Num 글씨 대신 보이는 투명 체크박스 (공간확보) */}
                                                {isDeleting && <Checkbox className="invisible md:hidden" />}
                                            </div>
                                        </TableHead>
                                    )}

                                    <TableHead className="text-sm font-medium">Title</TableHead>

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
                                            {/* 1. Num 데이터 Cell */}
                                            {showIndex && (
                                                <TableCell className="text-center w-[50px] md:w-[100px] p-0 md:p-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        {/* 체크박스: 삭제 모드일 때 무조건 보임 */}
                                                        {isDeleting && (
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <Checkbox
                                                                    checked={selectedPosts.includes(item.id)}
                                                                    onCheckedChange={() => onCheckboxChange(item.id)}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* 번호: 
                                                            - 기본: 보임 (block)
                                                            - 삭제 모드 & 모바일: 숨김 (hidden)
                                                            - 삭제 모드 & 데스크탑: 보임 (md:block) 
                                                        */}
                                                        <span className={cn(
                                                            "text-sm text-gray-500",
                                                            isDeleting ? "hidden md:block" : "block"
                                                        )}>
                                                            {displayIndex}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            )}

                                            {/* 2. Title 데이터 */}
                                            <TableCell className="font-light text-base md:text-lg align-middle">
                                                <div className="flex flex-col justify-center h-full min-w-0">
                                                    <div className="truncate w-full">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-0.5 md:hidden">
                                                        {formatPostDate(item.date)}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* 3. Date 데이터 */}
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