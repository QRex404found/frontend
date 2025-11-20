// src/components/community/CommentDrawer.jsx

import React, { useState, useEffect } from 'react';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription, // [추가] 접근성 경고 해결을 위해 import
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  addCommentApi,
  deleteCommentApi,
  reportCommentApi,
} from '@/api/community';
import useAuth from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from "sonner";

export const CommentDrawer = ({
  isOpen,
  onOpenChange,
  boardId,
  onCommentUpdate,
  className,
  initialComments,
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setComments(initialComments || []);
    }
  }, [isOpen, initialComments]);

  useEffect(() => {
    if (isOpen) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [isOpen]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addCommentApi(boardId, newComment);
      setNewComment("");
      toast.success("댓글이 등록되었습니다.");
      if (onCommentUpdate) onCommentUpdate();
    } catch (error) {
      toast.error("댓글 등록에 실패했습니다.");
    }
  };

  const handleReportComment = async (commentId) => {
    try {
      await reportCommentApi(commentId);
      toast.success("댓글이 신고되었습니다.");
    } catch {
      toast.error("댓글 신고에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentApi(commentId);
      if (onCommentUpdate) onCommentUpdate();
      toast.success("댓글이 삭제되었습니다.");
    } catch {
      toast.error("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      direction="bottom"
      disablePreventScroll
    >
      <DrawerContent className={`h-[70vh] flex flex-col rounded-t-xl ${className}`}>
        
        <DrawerHeader>
          <DrawerTitle>COMMENT</DrawerTitle>
          {/* [추가] 이 코드가 없으면 콘솔에 Warning이 뜹니다. 화면엔 안 보이게 sr-only 처리 가능 */}
          <DrawerDescription className="sr-only">
            Comments section for the post
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-grow min-h-0 p-4 overflow-x-hidden">
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No comments yet
              </div>
            ) : (
              comments.map((comment) => {
                const authorId =
                  comment?.userId ??
                  comment?.user?.id ??
                  comment?.writerId ??
                  comment?.writer?.id;

                const currentUserId = user?.id ?? user?.userId;

                const isMyComment =
                  authorId != null &&
                  currentUserId != null &&
                  String(authorId) === String(currentUserId);

                return (
                  <div key={comment.commentId} className="flex items-start gap-3">
                    {/* 아바타 */}
                    <div className="flex-shrink-0 w-8 h-8 mt-1 bg-gray-300 rounded-full" />
                    
                    {/* [최종 해결책: Absolute Positioning]
                      relative: 자식 요소(버튼)의 위치 기준점
                      flex-1: 남은 공간 차지
                      min-w-0: 플렉스 아이템 오버플로우 방지
                    */}
                    <div className="relative flex-1 min-w-0"> 
                        
                        {/* pr-8: 오른쪽 끝에 버튼이 들어올 공간(약 2rem)을 미리 패딩으로 확보 
                          이렇게 하면 글자가 절대 버튼 밑으로 들어가거나 버튼을 밀지 않음
                        */}
                        <div className="pr-8">
                          <p className="text-sm font-semibold text-[#81BF59]">
                            {authorId}
                          </p>

                          {/* break-all: 긴 단어 강제 줄바꿈 */}
                          <p className="text-sm text-gray-700 break-all whitespace-pre-wrap">
                            {comment.contents}
                          </p>
                        </div>

                        {/* absolute top-0 right-0: 
                           문서 흐름에서 완전히 빠져나와 우측 상단에 '못 박아' 버림.
                           텍스트가 밀어낼 물리적 대상이 아니게 됨.
                        */}
                        <div className="absolute top-0 right-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 text-gray-500 hover:text-gray-700">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">

                                {isMyComment ? (
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteComment(comment.commentId)}
                                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                  >
                                    delete comment
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleReportComment(comment.commentId)}
                                    className="text-[#CA8A04] focus:bg-yellow-50 focus:text-[#CA8A04]"
                                  >
                                    report comment
                                  </DropdownMenuItem>
                                )}

                              </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSubmitComment}
          className="flex items-end gap-2 p-4 border-t flex-shrink-0"
        >
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow min-h-0 break-words resize-none max-h-24"
            rows={1}
          />
          <Button type="submit" className="bg-[#7CCF00] text-white hover:bg-[#65A30D]">
            Submit
          </Button>
        </form>

      </DrawerContent>
    </Drawer>
  );
};