//최신 댓글1개 표시, 클릭하면 전체 댓글보여주는 commentDrawer 실행
import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, MessageCircle } from 'lucide-react';
// 경로 수정: '@/api/community' -> '../../api/community' (src/components/community에서 src/api로 이동)
import { getCommentsApi } from '../../api/community'; 
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// 경로 수정: './CommentDrawer.jsx' -> './CommentDrawer.jsx' (현재 디렉토리 유지)
import  { CommentDrawer }  from './CommentDrawer.jsx'; 

/**
 * 게시글 상세 페이지 하단에 표시되는 최신 댓글 미리보기 컴포넌트입니다.
 * 클릭 시 전체 댓글 Drawer를 엽니다.
 * @param {number} boardId - 게시글 ID
 * @param {function} onCommentUpdate - 댓글 작성/삭제 시 부모 (PostDetailModal)에게 알림
 */
export const LatestCommentPreview = ({ boardId, onCommentUpdate }) => {
    const [latestComment, setLatestComment] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (boardId) {
            fetchLatestComment(boardId);
        }
    }, [boardId]);

    const fetchLatestComment = async (id) => {
        setIsLoading(true);
        try {
            // API를 통해 모든 댓글을 가져와 최신 댓글 (API가 반환한 목록의 첫 번째 항목)을 사용합니다.
            const data = await getCommentsApi(id); 

            if (data && data.length > 0) {
                setLatestComment(data[0]);
            } else {
                setLatestComment(null);
            }
        } catch (error) {
            console.error("최신 댓글 로드 실패:", error);
            setLatestComment(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    // 댓글 작성/삭제 후 목록을 새로고침하는 콜백
    const onCommentsUpdated = () => {
        fetchLatestComment(boardId);
        // PostDetailModal에도 갱신되었음을 알려 게시글 상세 정보 (댓글 수 등)를 업데이트하도록 합니다.
        if (onCommentUpdate) {
            onCommentUpdate();
        }
    };

    if (isLoading) {
        return <div className="text-center text-sm text-gray-400 p-3">댓글 정보 로딩 중...</div>;
    }

    return (
        <>
            <Card
                className={cn(
                    "mt-4 p-3 cursor-pointer hover:bg-gray-50 transition-colors",
                    "shadow-sm border-2 border-transparent hover:border-green-500"
                )}
                onClick={() => setIsDrawerOpen(true)}
            >
                {latestComment ? (
                    // 🚀 [수정] 최신 댓글 미리보기 디자인을 프로필 원형 형태로 변경
                    <div className="flex justify-between items-center">
                        <div className="flex items-start space-x-3 truncate">
                            {/* ✅ 1. 프로필 동그라미 (CommentDrawer와 동일한 스타일) */}
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full mt-1"></div>
                            
                            <div className="flex flex-col min-w-0">
                                {/* ✅ 2. 사용자 ID */}
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {latestComment.author || latestComment.authorId || "익명"}
                                </p>
                                {/* ✅ 3. 댓글 내용 (ID 아래에 배치) */}
                                <p className="text-xs text-gray-500 truncate">
                                    {latestComment.content}
                                </p>
                            </div>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400 shrink-0 ml-2" />
                    </div>
                ) : (
                    // 댓글이 없는 경우
                    <div className="flex justify-between items-center text-gray-500">
                        <span className="text-sm">첫 댓글을 남겨주세요!</span>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
            </Card>

            {/* 댓글 전체 목록 Drawer */}
            <CommentDrawer 
                isOpen={isDrawerOpen} 
                onOpenChange={setIsDrawerOpen} 
                boardId={boardId} 
                onCommentUpdate={onCommentsUpdated} // 댓글 갱신 시 미리보기 업데이트
            />
        </>
    );
};