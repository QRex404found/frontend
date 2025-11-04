import React, { useState, useEffect } from 'react';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
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

/**
 * 댓글 목록 및 작성 Drawer
 * @param {boolean} isOpen - Drawer 열림/닫힘 상태
 * @param {function} onOpenChange - Drawer 상태 변경 핸들러
 * @param {number} boardId - 댓글을 작성할 게시글 ID
 * @param {function} onCommentUpdate - 댓글 작성/삭제 시 부모(PostDetailModal)에게 알림
 * @param {string} className - 너비 제한을 위해 PostDetailModal로부터 클래스를 받음
 * @param {Array} initialComments - 부모로부터 받은 초기 댓글 목록
 */
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
    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addCommentApi(boardId, newComment);
      setNewComment('');

      if (onCommentUpdate) {
        onCommentUpdate();
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  const handleReportComment = async (commentId) => {
    try {
      await reportCommentApi(commentId);
      alert('댓글이 신고되었습니다.');
    } catch (error) {
      console.error('댓글 신고 실패:', error);
      alert('댓글 신고에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await deleteCommentApi(commentId);
        alert('댓글이 삭제되었습니다.');
        if (onCommentUpdate) {
          onCommentUpdate();
        }
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      direction="bottom"
      disablePreventScroll
    >
      <DrawerContent
        className={`h-[70vh] flex flex-col rounded-t-xl ${className}`}
      >
        <DrawerHeader>
          <DrawerTitle>댓글</DrawerTitle>
        </DrawerHeader>

        {/* 댓글 목록 스크롤 영역 */}
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                아직 댓글이 없습니다.
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.commentId} className="flex items-start gap-3">
                  {/* 1. 프로필 동그라미 */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full mt-1"></div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      {/* 2. 아이디와 내용 */}
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-semibold text-sm">
                          {comment.userId}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {comment.contents}
                        </p>
                      </div>

                      {/* 3. 오른쪽 상단 점 세 개 옵션 (DropdownMenu) */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 mt-1">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {user && comment.userId === user.userId ? (
                            // 내 댓글인 경우: 삭제 버튼
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteComment(comment.commentId)
                              }
                              className="text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                            >
                              delete comment
                            </DropdownMenuItem>
                          ) : (
                            // 다른 사람 댓글인 경우: 신고 버튼
                            <DropdownMenuItem
                              onClick={() =>
                                handleReportComment(comment.commentId)
                              }
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

        {/* 댓글 작성 폼 */}
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