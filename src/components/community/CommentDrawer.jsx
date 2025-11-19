// src/components/community/CommentDrawer.jsx

import React, { useState, useEffect } from 'react';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
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
                    <div className="flex-shrink-0 w-8 h-8 mt-1 bg-gray-300 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-semibold text-[#81BF59]">
                            {authorId}
                          </p>

                          {/* 수정된 부분: break-words -> break-all */}
                          <p className="text-sm text-gray-700 break-all whitespace-pre-wrap">
                            {comment.contents}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex-shrink-0 p-1 mt-1 mr-2 text-gray-500 hover:text-gray-700">
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