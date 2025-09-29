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
// 🚨 [핵심 수정] boardId 대신 post 객체 전체를 프롭으로 받습니다.
export function PostDetailModal({ isOpen, onOpenChange, post }) {
    // post Prop을 postDetail로 사용 (데이터 소스 통일)
    const postDetail = post; 
    
    // API 호출이 없어졌으므로 isLoading 상태는 사실상 불필요하지만 구조 유지를 위해 선언만 둡니다.
    const [isLoading, setIsLoading] = useState(false); 
    const { user } = useAuth();
    const [alertDialogState, setAlertDialogState] = useState({ isOpen: false, title: '', message: '' });
    const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

    // 모달이 닫힐 때 댓글 서랍 상태 초기화
    useEffect(() => {
        if (!isOpen) {
            setIsCommentDrawerOpen(false);
        }
    }, [isOpen]);

    // API 호출 로직이 제거되었으므로, 댓글 업데이트 시 새로고침은 Mocking으로 처리합니다.
    const handleCommentUpdate = () => {
        console.log("댓글 업데이트 후 상세 정보 새로고침 (Mocking)");
        // 실제 환경에서는 여기서 부모 컴포넌트의 데이터 갱신 함수를 호출해야 합니다.
    };
    
    const handleReportPost = async () => {
        // postDetail의 ID 사용
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

    // 🚨 [로딩 트랩 해제] post Prop이 없는데 모달이 열려 있으면 로딩 UI 표시 (오류 방지)
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
    if (!postDetail) return null; // postDetail이 null이고 모달이 닫혀있다면 아무것도 렌더링하지 않음
    
    // 게시글 상세 정보 표시 상태
    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col bg-white p-0 overflow-hidden">
                    
                    <div className="flex flex-col h-full w-full p-6"> 
                        
                        <DialogHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-4">
                                    <DialogTitle className="text-xl font-bold break-words">{postDetail.title}</DialogTitle>
{/*                                     <DialogDescription className="text-sm text-gray-500 mt-1">
                                        작성자: {postDetail.author} | {postDetail.date}
                                    </DialogDescription> */}
                                </div>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-gray-500 hover:bg-gray-100 mr-2 flex-shrink-0"
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
                            <Separator className="my-2" /> 
                        </DialogHeader>

                        <ScrollArea className="flex-grow p-4 space-y-4 -mx-4">
                            
                            {/* 2. CONTEXT (내용) */}
                            <div className="whitespace-pre-wrap text-gray-800 border p-3 rounded">{postDetail.context}</div>

                            {/* 3. PHOTO (사진) */}
                            {postDetail.photoUrl ? (
                                <div className="my-4 flex justify-center">
                                    <img
                                        src={postDetail.photoUrl}
                                        alt="첨부 이미지"
                                        className="max-w-full h-auto rounded-lg max-h-[300px]"
                                    />
                                </div>
                            ) : (
                                <div className="my-4 flex justify-center">
                                    <div className="w-40 h-40 bg-gray-100 border-dashed border-2 flex flex-col items-center justify-center text-gray-400">
                                        PHOTO
                                    </div>
                                </div>
                            )}

                            {/* 🚀 URL 표시 */}
                            {postDetail.url && (
                                <div className="p-3 border rounded">
                                    <span className="font-semibold text-gray-700">URL:</span>
                                    <a 
                                        href={postDetail.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 underline ml-1 break-words hover:text-blue-700 transition-colors"
                                    >
                                        {postDetail.url}
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
