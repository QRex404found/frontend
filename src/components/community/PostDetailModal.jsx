// src/components/community/PostDetailModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import useAuth from '@/hooks/useAuth';
import { lockScroll, unlockScroll } from '@/utils/scrollLock';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LatestCommentPreview } from './LatestCommentPreview.jsx';
import { CommentDrawer } from './CommentDrawer.jsx';
import { reportPostApi, getPostDetailApi, deletePostApi } from '@/api/community';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export function PostDetailModal({
  isOpen,
  onOpenChange,
  boardId,
  showComments = true,
  onDeleteSuccess,
}) {
  const { user } = useAuth();
  const [postDetail, setPostDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const [titleOpen, setTitleOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef(null);

  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [refetchCounter, setRefetchCounter] = useState(0);

  // 데이터 로딩
  useEffect(() => {
    if (isOpen && boardId) {
      setIsLoading(true);
      getPostDetailApi(boardId)
        .then(setPostDetail)
        .catch(() => setError('게시글을 불러오는 데 실패했습니다.'))
        .finally(() => setIsLoading(false));
    } else {
      setPostDetail(null);
      setError(null);
      setIsCommentDrawerOpen(false);
      setTitleOpen(false);
      setRefetchCounter(0);
    }
  }, [isOpen, boardId, refetchCounter]);

  // 스크롤 잠금
  useEffect(() => {
    if (isOpen || isCommentDrawerOpen) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [isOpen, isCommentDrawerOpen]);

  // 제목 말줄임 감지
  useEffect(() => {
    const checkTruncation = () => {
      if (!titleRef.current) return;
      const el = titleRef.current;
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [postDetail?.title, isOpen, titleOpen]);

  // ✅ 작성자 판별 로직 (안전)
  const authorId =
    postDetail?.userId ??
    postDetail?.user?.id ??
    postDetail?.writerId ??
    postDetail?.writer?.id;

  const currentUserId = user?.id ?? user?.userId;

  const isMyPost =
    authorId != null &&
    currentUserId != null &&
    String(authorId) === String(currentUserId);

  // 신고
  const handleReportPost = async () => {
    if (!postDetail) return;
    try {
      await reportPostApi(postDetail.boardId);
      toast.success("게시글이 신고되었습니다.");
    } catch {
      toast.error("신고 중 오류가 발생했습니다.");
    }
  };

  // ✅ 삭제 (자동 새로고침 반영)
  const handleDeletePost = async () => {
    if (!postDetail || isDeleting) return;

    setIsDeleting(true);
    try {
      await deletePostApi(postDetail.boardId);

      // ✅ 1) 먼저 부모 상태 push (리스트 갱신)
      if (onDeleteSuccess) onDeleteSuccess();

      // ✅ 2) 알림
      toast.success("게시글이 삭제되었습니다.");

      // ✅ 3) 그 다음 모달 닫기
      onOpenChange(false);

    } catch {
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className="hide-default-close w-full max-w-[90vw] sm:max-w-[800px] 
          max-h-[90vh] h-auto flex flex-col bg-white p-0 overflow-hidden rounded-xl"
          autoFocus={false}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-3 border-b shrink-0">
            <div className="flex items-center flex-1 min-w-0 gap-2">
              <span ref={titleRef} className="text-lg font-semibold truncate" title={postDetail?.title}>
                {postDetail?.title}
              </span>
              {isTruncated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-gray-500 rounded-full shrink-0"
                  onClick={() => setTitleOpen((prev) => !prev)}
                >
                  {titleOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                    <Ellipsis className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {isMyPost ? (
                    <DropdownMenuItem
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete Post"}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={handleReportPost}
                      className="text-[#CA8A04] focus:text-[#CA8A04]"
                    >
                      Report Post
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 펼쳐진 제목 */}
          {titleOpen && (
            <div className="px-6 py-2 text-sm text-gray-700 whitespace-pre-wrap border-b shrink-0">
              {postDetail?.title}
            </div>
          )}

          {/* BODY */}
          {isLoading ? (
            <div className="flex items-center justify-center flex-1 min-h-0">
              <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
          ) : error ? (
            <p className="px-6 py-4 text-red-500">{error}</p>
          ) : !postDetail ? (
            <p className="px-6 py-4">데이터를 표시할 수 없습니다.</p>
          ) : (
            <>
              {postDetail.imagePath && (
                <div className="px-6 pt-4 shrink-0">
                  <div className="flex justify-center">
                    <img src={postDetail.imagePath} alt="첨부 이미지" className="max-w-full max-h-[250px] rounded-lg" />
                  </div>
                </div>
              )}

              {postDetail.url && (
                <div className="px-6 pt-4 shrink-0">
                  <div className="p-3 break-all border rounded-md">
                    <span className="font-semibold">URL: </span>
                    <a href={postDetail.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                      {postDetail.url}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto">
                <div className="leading-relaxed text-gray-800 break-all whitespace-pre-wrap">
                  {postDetail.contents}
                </div>
              </div>
            </>
          )}

          {showComments && (
            <div className="px-6 py-3 cursor-pointer shrink-0" onClick={() => setIsCommentDrawerOpen(true)}>
              <LatestCommentPreview comments={postDetail?.comments} />
            </div>
          )}

          <CommentDrawer
            isOpen={isCommentDrawerOpen}
            onOpenChange={setIsCommentDrawerOpen}
            boardId={boardId}
            initialComments={postDetail?.comments || []}
            className="w-full max-w-[90vw] sm:max-w-[800px] mx-auto"
            onCommentUpdate={() => setRefetchCounter((count) => count + 1)}
          />
        </DialogContent>
      </Dialog>

      <style>{`.hide-default-close button.absolute.right-4.top-4 { display: none !important; }`}</style>
    </>
  );
}
