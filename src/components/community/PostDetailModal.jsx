// src/components/community/PostDetailModal.jsx (이 코드로 덮어쓰기)

import React, { useState, useEffect, useRef } from 'react';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LatestCommentPreview } from './LatestCommentPreview.jsx';
import { CommentDrawer } from './CommentDrawer.jsx';
import { reportPostApi, getPostDetailApi } from '@/api/community';
import useAuth from '@/hooks/useAuth';
import { CustomAlertDialog } from '../common/CustomAlertDialog.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, X, Loader2 } from 'lucide-react';

export function PostDetailModal({ isOpen, onOpenChange, boardId, showComments = true }) {
  const [postDetail, setPostDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const scrollRef = useRef(null);

  const [alertDialogState, setAlertDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

  const fetchPostDetail = async (id) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPostDetailApi(id);
      setPostDetail(data);
    } catch (err) {
      console.error('게시글 상세 정보 로드 실패:', err);
      setError('게시글을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && boardId) {
      fetchPostDetail(boardId);
    } else if (!isOpen) {
      setPostDetail(null);
      setError(null);
      setIsCommentDrawerOpen(false);
    }
  }, [isOpen, boardId]);

  useEffect(() => {
    if (!isOpen) setIsCommentDrawerOpen(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || isCommentDrawerOpen) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [isOpen, isCommentDrawerOpen]);

  useEffect(() => {
    if (isCommentDrawerOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isCommentDrawerOpen]);

  const handleCommentUpdate = () => {
    console.log('댓글 업데이트 감지 -> 상세 정보 새로고침');
    fetchPostDetail(boardId);
  };

  const handleReportPost = async () => {
    if (!postDetail) return;
    try {
      await reportPostApi(postDetail.boardId);
      setAlertDialogState({
        isOpen: true,
        title: '신고 완료',
        message: '해당 게시글이 신고되었습니다.',
      });
    } catch (err) {
      setAlertDialogState({
        isOpen: true,
        title: '신고 실패',
        message: '신고 처리 중 오류가 발생했습니다.',
      });
    }
  };

  const onAlertDialogClose = () => {
    setAlertDialogState({ ...alertDialogState, isOpen: false });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500 p-6">{error}</p>;
    }

    if (!postDetail) {
      return <p className="p-6">데이터를 표시할 수 없습니다.</p>;
    }

    return (
      <>
        {/* 우측 상단 버튼 */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white hover:bg-gray-100 rounded-full"
              >
                <Ellipsis className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleReportPost}>
                게시글 신고
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white hover:bg-gray-100 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        </div>

        {/* 헤더 */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold break-words">
            {postDetail.title}
          </DialogTitle>
          <Separator className="my-2" />
        </DialogHeader>

        {/* 본문 ScrollArea */}
        <ScrollArea
          ref={scrollRef}
          className="flex-grow overflow-auto p-4 space-y-4 -mx-4"
        >
          {/* 본문 내용 */}
          <div className="whitespace-pre-wrap text-gray-800 border p-3 rounded">
            {postDetail.contents}
          </div>

          {/* 이미지 */}
          {postDetail.imagePath && (
            <div className="my-4 flex justify-center">
              <img
                src={postDetail.imagePath}
                alt="첨부 이미지"
                className="max-w-full h-auto rounded-lg max-h-[300px]"
              />
            </div>
          )}

          {/* URL */}
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

          {/* 댓글 미리보기 */}
          {showComments && (
            <div
              onClick={() => setIsCommentDrawerOpen(true)}
              className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors border"
            >
              <LatestCommentPreview
                boardId={postDetail.boardId}
                onCommentUpdate={handleCommentUpdate}
                comments={postDetail.comments}
              />
            </div>
          )}
        </ScrollArea>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 게시글 상세보기 Dialog */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className="fixed-modal w-full max-w-[90vw] sm:w-[800px] sm:max-w-[800px] max-h-[90vh] flex flex-col bg-white p-0 overflow-hidden"
          autoFocus={false}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <div className="relative flex flex-col h-full w-full p-6">
            {renderContent()}
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 Drawer */}
      {boardId && (
        <CommentDrawer
          isOpen={isCommentDrawerOpen}
          onOpenChange={setIsCommentDrawerOpen}
          boardId={boardId}
          onCommentUpdate={handleCommentUpdate}
          className="max-w-[800px] mx-auto z-[10100]"
          initialComments={postDetail ? postDetail.comments : []}
        />
      )}

      {/* 알림 다이얼로그 */}
      <CustomAlertDialog
        isOpen={alertDialogState.isOpen}
        onClose={onAlertDialogClose}
        title={alertDialogState.title}
        message={alertDialogState.message}
      />
    </>
  );
}