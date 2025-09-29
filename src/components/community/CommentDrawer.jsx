import React, { useState, useEffect } from 'react';
import { 
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, XCircle } from 'lucide-react'; 
import { getCommentsApi, addCommentApi } from '@/api/community'; 
import useAuth from '@/hooks/useAuth'; 
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; 


// 현재 로그인한 사용자 ID를 'current_user'라고 가정합니다.
const CURRENT_USER_ID = "current_user"; 

const DUMMY_COMMENTS = [
    { id: 1, authorId: "user_id", content: "user_id wanted to leave a comment so user_id left a comment.", isLong: false },
    { id: 2, authorId: CURRENT_USER_ID, content: "very looooooooooong comment might look like this.", isLong: true }, // 내 댓글
    { id: 3, authorId: "user_id", content: "user_id wanted to leave a comment so user_id left a comment.", isLong: false },
    { id: 4, authorId: "other_user", content: "user_id wanted to leave a comment so user_id left a comment.", isLong: false },
];


/**
 * 댓글 목록 및 작성 Drawer
 * @param {boolean} isOpen - Drawer 열림/닫힘 상태
 * @param {function} onOpenChange - Drawer 상태 변경 핸들러
 * @param {number} boardId - 댓글을 작성할 게시글 ID
 * @param {function} onCommentUpdate - 댓글 작성/삭제 시 최신 댓글 미리보기에 알림
 * @param {string} className - 너비 제한을 위해 PostDetailModal로부터 클래스를 받음
 */
export const CommentDrawer = ({ isOpen, onOpenChange, boardId, onCommentUpdate, className }) => { 
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    // const { user } = useAuth(); // 실제 사용자 정보는 여기서 가져와야 합니다.

    useEffect(() => {
        if (isOpen && boardId) {
            setComments(DUMMY_COMMENTS); // 임시 데이터 사용
            // fetchComments(boardId);
        }
    }, [isOpen, boardId]);

    const fetchComments = async (id) => {
        try {
            const data = await getCommentsApi(id); 
            setComments(data); 
        } catch (error) {
            console.error("댓글 목록 로드 실패:", error);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            // [수정] 실제 API 호출은 주석 처리하고 더미 데이터로 대체합니다.
            // await addCommentApi(boardId, newComment);
            console.log(`[댓글 제출 시뮬레이션] 내용: ${newComment}`);

            // UI 업데이트를 위한 임시 로직
            const newId = DUMMY_COMMENTS.length + 1;
            const newCommentObj = { 
                id: newId, 
                authorId: CURRENT_USER_ID, 
                content: newComment, 
                isLong: false 
            };
            setComments(prev => [...prev, newCommentObj]);
            
            // ✅ [핵심] 댓글 입력 필드를 빈 문자열로 초기화합니다.
            setNewComment(''); 
            
            if (onCommentUpdate) {
                onCommentUpdate();
            }
        } catch (error) {
            console.error("댓글 등록 실패:", error);
        }
    };
    
    const handleReportComment = (commentId) => {
        alert(`댓글 ID ${commentId}를 신고합니다.`);
    };

    const handleDeleteComment = (commentId) => {
        if (confirm(`댓글을 삭제하시겠습니까?`)) {
            alert(`댓글 ID ${commentId}를 삭제합니다.`);
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    };


    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange} direction="bottom"> 
            <DrawerContent className={`h-[70vh] flex flex-col rounded-t-xl ${className}`}>
                <DrawerHeader>
                    <DrawerTitle>댓글</DrawerTitle>
                </DrawerHeader>
                
                <ScrollArea className="flex-grow p-4">
                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">아직 댓글이 없습니다.</div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3">
                                    
                                    {/* 1. 프로필 동그라미 */}
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full mt-1"></div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            
                                            {/* 2. 아이디와 내용 */}
                                            <div className="flex-1 min-w-0 pr-4">
                                                <p className="font-semibold text-sm">{comment.authorId}</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
                                            </div>

                                            {/* 3. 오른쪽 상단 점 세 개 옵션 (DropdownMenu) */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 mt-1">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    {comment.authorId === CURRENT_USER_ID ? (
                                                        // 내 댓글인 경우: 삭제 버튼 (검은색)
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                                                        >
                                                            delete comment
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        // 다른 사람 댓글인 경우: 신고 버튼 (빨간색)
                                                        <DropdownMenuItem 
                                                            onClick={() => handleReportComment(comment.id)}
                                                            className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                        >
                                                            report comment
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <form onSubmit={handleSubmitComment} className="p-4 border-t flex gap-2">
                    <Input
                        type="text"
                        placeholder="댓글을 작성하세요..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit">Submit</Button> 
                </form>
            </DrawerContent>
        </Drawer>
    );
};