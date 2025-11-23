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

  // ✅ [수정됨] 댓글 신고 핸들러
  const handleReportComment = async (commentId) => {
    try {
      await reportCommentApi(commentId);
      
      // 1. 신고 성공 메시지
      toast.success("댓글이 신고되었습니다.");

      // 2. 중요: 신고 후 댓글 상태가 변했을 수 있으므로(삭제 등) 목록을 반드시 갱신합니다.
      // 이렇게 해야 50번째 신고 직후 화면에서 댓글이 사라집니다.
      if (onCommentUpdate) onCommentUpdate();

    } catch (error) {
      const status = error.response?.status;

      // 3. 만약 신고 시도 중 404(찾을 수 없음)나 403/401(권한 없음)이 뜨면
      // 이는 신고 누적으로 이미 삭제된 댓글로 간주합니다.
      if (status === 404 || status === 403 || status === 401) {
        toast.info("신고 누적으로 댓글이 삭제되었습니다.");
        
        // 목록을 갱신하여 삭제된 댓글을 화면에서 치워버립니다.
        if (onCommentUpdate) onCommentUpdate(); 
      } else {
        // 그 외 진짜 에러
        toast.error("댓글 신고에 실패했습니다.");
      }
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
        
        <DrawerHeader className="flex-none">
          <DrawerTitle className="font-light">COMMENT</DrawerTitle>
          <DrawerDescription className="sr-only">
            Comments section for the post
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 min-h-0 px-4 overflow-x-hidden">
          <div className="space-y-6 py-4">
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

                const authorName = comment?.userName ?? authorId; 

                const currentUserId = user?.id ?? user?.userId;

                const isMyComment =
                  authorId != null &&
                  currentUserId != null &&
                  String(authorId) === String(currentUserId);

                return (
                  <div key={comment.commentId} className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 w-8 h-8 mt-1 bg-gray-300 rounded-full" />
                    
                    <div className="relative flex-1 w-0"> 
                        <div className="pr-8">
                          <p className="text-sm font-medium text-[#81BF59] mb-0.5">
                            {authorName} 
                          </p>

                          <p 
                            className="text-sm text-gray-700 whitespace-pre-wrap break-all w-full [overflow-wrap:anywhere]"
                            style={{ wordBreak: 'break-all' }}
                          >
                            {comment.contents}
                          </p>
                        </div>

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