// src/components/community/CommentDrawer.jsx

import React, { useState, useEffect } from 'react';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
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
      {/* [레이아웃 수정]
         h-[70vh]: 전체 높이 고정
         flex flex-col: 내부 요소 세로 배치 (헤더 - 스크롤영역 - 입력창)
      */}
      <DrawerContent className={`h-[70vh] flex flex-col rounded-t-xl ${className}`}>
        
        <DrawerHeader className="flex-none">
          <DrawerTitle>COMMENT</DrawerTitle>
          <DrawerDescription className="sr-only">
            Comments section
          </DrawerDescription>
        </DrawerHeader>

        {/* [스크롤 영역 수정]
           flex-1: 남은 공간을 모두 차지
           overflow-y-auto: 세로 스크롤 허용
           min-h-0: flex 자식 요소의 overflow 버그 방지 (필수)
        */}
        <ScrollArea className="flex-1 min-h-0 p-4">
          <div className="space-y-6 pb-4">
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
                  <div key={comment.commentId} className="flex items-start gap-3 w-full">
                    {/* 아바타 */}
                    <div className="flex-shrink-0 w-8 h-8 mt-1 bg-gray-300 rounded-full" />
                    
                    {/* [구조 변경의 핵심] 
                        flex-1 min-w-0: 이 div가 부모(화면) 너비를 넘지 않도록 강제함
                    */}
                    <div className="flex-1 min-w-0 grid gap-1"> 
                        
                        {/* 상단 줄: 작성자 아이디 + 더보기 버튼 */}
                        {/* 버튼을 텍스트와 겹치지 않게 아예 같은 줄로 분리함 */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-[#81BF59] truncate">
                              {authorId}
                            </span>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 -mr-1">
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

                        {/* 댓글 내용 */}
                        {/* break-all: ???? 같은 특수문자도 무조건 줄바꿈
                           whitespace-pre-wrap: 엔터키 적용
                        */}
                        <p className="text-sm text-gray-700 break-all whitespace-pre-wrap">
                          {comment.contents}
                        </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* 입력창 영역: 높이 고정(flex-none) */}
        <form
          onSubmit={handleSubmitComment}
          className="flex-none flex items-end gap-2 p-4 border-t bg-white"
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