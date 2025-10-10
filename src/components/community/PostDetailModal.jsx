import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LatestCommentPreview } from './LatestCommentPreview.jsx';
import { CommentDrawer } from './CommentDrawer.jsx';
// API 호출 로직은 제거되었지만, API 함수는 신고 기능을 위해 유지합니다.
import { getPostDetailApi, reportPostApi } from '@/api/community'; 
import useAuth from '@/hooks/useAuth';
import { CustomAlertDialog } from '../common/CustomAlertDialog.jsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; 
import { MoreHorizontal, Loader2 } from 'lucide-react'; 

/**
 * 게시글 상세 정보 모달
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onOpenChange - 모달 상태 변경 핸들러
 * @param {object | null} post - 현재 보고 있는 게시글 객체 (핵심 데이터 소스)
 */
export function PostDetailModal({ isOpen, onOpenChange, post }) {
    // post Prop을 postDetail로 사용 (데이터 소스 통일)
    const postDetail = post; 
    
    const [isLoading, setIsLoading] = useState(false); 
    const { user } = useAuth();
    const [alertDialogState, setAlertDialogState] = useState({ isOpen: false, title: '', message: '' });
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsCommentDrawerOpen(false);
        }
    }, [isOpen]);

    const handleCommentUpdate = () => {
        console.log("댓글 업데이트 후 상세 정보 새로고침 (Mocking)");
        // 실제 환경에서는 여기서 부모 컴포넌트의 데이터 갱신 함수를 호출해야 합니다.
    };
    
    const handleReportPost = async () => {
        if (!postDetail || !postDetail.id) return;
        try {
            // await reportPostApi(postDetail.id);
            setAlertDialogState({
                isOpen: true,
                title: "신고 완료",
                message: "게시글이 성공적으로 신고 처리되었습니다.",
            });
        } catch (error) {
            setAlertDialogState({
                isOpen: true,
                title: "신고 실패",
                message: error.message || "신고 처리 중 오류가 발생했습니다.",
            });
        }
    };

    const onAlertDialogClose = () => {
        setAlertDialogState({ ...alertDialogState, isOpen: false });
    };

    if (!postDetail && isOpen) { 
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent 
                    className="sm:max-w-[800px] h-[30vh] flex flex-col items-center justify-center bg-white"
                > 
                    <DialogHeader className="text-center">
                        <DialogTitle>게시글을 로드 중입니다</DialogTitle> 
                        <DialogDescription className="text-gray-500">
                            상세 정보를 불러오고 있습니다.
                        </DialogDescription>
                    </DialogHeader>
                    <Loader2 className="h-8 w-8 animate-spin text-green-500 mt-4" />
                </DialogContent>
            </Dialog>
        );
    }
    if (!postDetail) return null; 
    
    // =========================================================================
    // 👇👇👇 스크롤/URL 테스트를 위한 임시 코드 (ID 3번 게시글에만 적용) 👇👇👇
    // =========================================================================
    let finalPostDetail = postDetail; 

    if (postDetail.id === 3) { 
        // 내용을 매우 길게 만듭니다.
        const longContent = "이것은 ID 3번 게시글에만 적용되는 매우 긴 테스트 문자열입니다.\n".repeat(150) + "스크롤 테스트를 완료해 주세요!"; 
        
        // URL 필드에 긴 테스트 URL을 추가합니다.
        const longUrl = "https://www.verylongtesturl.com/this/is/a/super/long/path/for/testing/breaking/and/scrolling/01234567890123456789/verylongparameter?q=test_query&p=12345";

        finalPostDetail = {
            ...postDetail,
            context: longContent, 
            url: longUrl, 
        };
    }
    // =========================================================================
    // 👆👆👆 스크롤/URL 테스트를 위한 임시 코드 👆👆👆
    // =========================================================================


    // 게시글 상세 정보 표시 상태
    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                {/* 🚨 변경: DialogContent에 relative 클래스 추가 */}
                <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col bg-white p-0 overflow-hidden relative">

                    {/* 🚨 변경: ... 버튼을 DialogHeader 밖으로 빼고, absolute로 위치 지정 */}
                    <div className="absolute top-2 right-10 z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                side="left"
                                sideOffset={10}
                                className="w-32"
                            >
                                <DropdownMenuItem
                                    onClick={handleReportPost}
                                    className="flex items-center justify-center text-red-600 focus:bg-red-50 focus:text-red-600"
                                >
                                    report post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex flex-col h-full w-full p-6">
                        <DialogHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-4">
                                    <DialogTitle className="text-xl font-bold break-words">{postDetail.title}</DialogTitle>
                                </div>
                            </div>
                            <Separator className="my-2" />
                        </DialogHeader>

                        {/* 🚨 ScrollArea: 모달의 헤더 아래 영역 전체에 스크롤을 적용하여 댓글까지 접근 가능하게 함 */}
                        <ScrollArea className="flex-grow p-4 space-y-4 -mx-4">
                            
                            {/* 2. CONTEXT (내용) - 최대 높이를 150px로 줄이고 내부 스크롤 적용 */}
                            <div 
                                className="
                                    whitespace-pre-wrap text-gray-800 border p-3 rounded 
                                    max-h-[120px] overflow-y-auto 
                                "
                            >
                                {finalPostDetail.context}
                            </div>

                            {/* 3. PHOTO (사진) */}
                            {postDetail.photoUrl ? (
                                <div className="my-4 flex justify-center w-full"> 
                                    <img
                                        src={postDetail.photoUrl}
                                        alt="첨부 이미지"
                                        className="max-w-full h-auto rounded-lg max-h-[300px]"
                                    />
                                </div>
                            ) : (
                                 <div className="my-4 w-full flex justify-center"> {/* w-full과 flex justify-center 추가 */}
                                    {/* 내부 div에서는 mx-auto를 제거해도 됩니다. */}
                                    <div className="w-40 h-40 bg-gray-100 border-dashed border-2 flex flex-col items-center justify-center text-gray-400"> 
                                        PHOTO
                                    </div>
                                </div>
                            )}

                            {/* 🚀 URL 표시 */}
                            {finalPostDetail.url && (
                                <div className="p-3 border rounded">
                                    <span className="font-semibold text-gray-700">URL:</span>
                                    <a 
                                        href={finalPostDetail.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 underline ml-1 break-words hover:text-blue-700 transition-colors"
                                    >
                                        {finalPostDetail.url}
                                    </a>
                                </div>
                            )}

                            <Separator className="my-4" />
                            
                            {/* 5. COMMENT AREA (댓글 영역) */}
                            {!isCommentDrawerOpen && (
                                <div 
                                    onClick={() => setIsCommentDrawerOpen(true)}
                                    className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors border"
                                >
                                    <LatestCommentPreview boardId={postDetail.id} onCommentUpdate={handleCommentUpdate} />
                                </div>
                            )}
                            
                        </ScrollArea>
                    </div> 
                </DialogContent>
            </Dialog>
            
            <CommentDrawer
                isOpen={isCommentDrawerOpen}
                onOpenChange={setIsCommentDrawerOpen}
                boardId={postDetail.id}
                onCommentUpdate={handleCommentUpdate}
                className="max-w-[800px] mx-auto" 
            />

            <CustomAlertDialog
                isOpen={alertDialogState.isOpen}
                onClose={onAlertDialogClose}
                title={alertDialogState.title}
                message={alertDialogState.message}
            />
        </>
    );
}