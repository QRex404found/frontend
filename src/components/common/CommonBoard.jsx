import React from 'react';
import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/common/Pagination';
import { Loader2, CheckIcon, Trash2 } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

// Tailwind 클래스 병합을 위한 유틸리티 함수
const cn = (...classes) => classes.filter(Boolean).join(' '); 

// 체크박스 컴포넌트 정의 (MyPost에서 가져옴)
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
    onCheckboxChange = () => {},
    // MyPost와 행 높이 맞추기 위해 기본값 h-16으로 변경
    rowHeightClass = "h-16" 
}) => {
    const pageSize = 8;
    
    // 이전에 MyPost에 있던 H2와 버튼 로직은 MyPost.jsx에서 직접 처리하도록 변경되었습니다.
    
    return (
        <div className="flex flex-col min-h-[500px]">
            <CardContent className="flex-grow flex flex-col p-0">
                {isLoading ? (
                    <div className={`flex justify-center items-center h-full min-h-[300px] ${rowHeightClass}`}>
                        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
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
                                            {/* 체크박스 헤더 공간 확보 및 애니메이션 기준점 */}
                                            <div className={cn(
                                                "absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                                                isDeleting ? "left-1 opacity-100" : "left-1 opacity-0"
                                            )}>
                                                {/* 실제 체크박스는 보이지 않지만, 공간을 차지하고 애니메이션 기준점을 잡기 위해 Checkbox 컴포넌트를 사용 */}
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
                                                    {/* ✅ 체크박스 애니메이션 로직: Num 셀의 좌측에 띄우기 */}
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
};
