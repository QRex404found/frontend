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
  
  // 댓글 작성/삭제 시 메인 데이터를 다시 불러오기 위한 트리거
  const [refetchCounter, setRefetchCounter] = useState(0);

  // ----------------------------------------------------------------
  // 1. 데이터 로딩 (깜빡임 방지 로직 적용)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (isOpen && boardId) {
      // ✅ [핵심] 이미 데이터가 있으면 로딩 스피너를 보여주지 않음 (Background Fetching)
      // 이렇게 해야 댓글만 업데이트될 때 게시글 화면이 하얗게 변하지 않음
      if (!postDetail) {
        setIsLoading(true);
      }

      getPostDetailApi(boardId)
        .then((data) => {
          setPostDetail(data);
          setError(null);
        })
        .catch(() => {
          setError('게시글을 불러오는 데 실패했습니다.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // 모달이 닫힐 때만 상태 초기화
      if (!isOpen) {
        setPostDetail(null);
        setError(null);
        setIsCommentDrawerOpen(false);
        setTitleOpen(false);
        setRefetchCounter(0);
        setIsLoading(false);
      }
    }
  }, [isOpen, boardId, refetchCounter]);

  // ----------------------------------------------------------------
  // 2. 스크롤 잠금 관리
  // ----------------------------------------------------------------
  useEffect(() => {
    if (isOpen || isCommentDrawerOpen) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [isOpen, isCommentDrawerOpen]);

  // ----------------------------------------------------------------
  // 3. 제목 말줄임 감지
  // ----------------------------------------------------------------
  useEffect(() => {
    const checkTruncation = () => {
      if (!titleRef.current) return;
      const el = titleRef.current;
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };
    // 모달이 열리거나 제목이 변경될 때 체크
    if (isOpen) {
      // 약간의 지연을 두어 렌더링 후 계산 정확도 향상
      setTimeout(checkTruncation, 0);
    }
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [postDetail?.title, isOpen, titleOpen]);

  // ----------------------------------------------------------------
  // 4. 권한 및 핸들러
  // ----------------------------------------------------------------
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
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403 || status === 404) {
        toast.info("신고 누적으로 인해 게시글이 삭제되었습니다.");
        if (onDeleteSuccess) onDeleteSuccess();
        onOpenChange(false);
      } else {
        toast.error("신고 중 오류가 발생했습니다.");
      }
    }
  };

  // 삭제
  const handleDeletePost = async () => {
    if (!postDetail || isDeleting) return;

    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await deletePostApi(postDetail.boardId);
      toast.success("게시글이 삭제되었습니다.");
      if (onDeleteSuccess) onDeleteSuccess();
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
          max-h-[90vh] h-auto flex flex-col bg-white p-0 overflow-hidden rounded-xl outline-none"
          autoFocus={false}
        >
          {/* --- Header --- */}
          <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-3 border-b shrink-0">
            <div className="flex items-center flex-1 min-w-0 gap-2">
              <span 
                ref={titleRef} 
                className={`text-lg font-semibold ${titleOpen ? '' : 'truncate'}`}
                title={postDetail?.title}
              >
                {postDetail?.title}
              </span>
              {isTruncated && !titleOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-gray-500 rounded-full shrink-0"
                  onClick={() => setTitleOpen(true)}
                >
                  <ChevronDown size={16} />
                </Button>
              )}
              {titleOpen && (
                 <Button
                 variant="ghost"
                 size="icon"
                 className="w-6 h-6 text-gray-500 rounded-full shrink-0"
                 onClick={() => setTitleOpen(false)}
               >
                 <ChevronUp size={16} />
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

                <DropdownMenuContent align="end" className="bg-white">
                  {isMyPost ? (
                    <DropdownMenuItem
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                      className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                    >
                      {isDeleting ? "삭제 중..." : "게시글 삭제"}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={handleReportPost}
                      className="text-[#CA8A04] cursor-pointer focus:text-[#CA8A04] focus:bg-yellow-50"
                    >
                      게시글 신고
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* --- Body --- */}
          {/* ✅ 로딩 중이어도 기존 데이터(postDetail)가 있으면 내용을 유지함 */}
          {(isLoading && !postDetail) ? (
            <div className="flex items-center justify-center flex-1 min-h-[300px]">
              <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center flex-1 min-h-[200px]">
              <p className="text-red-500">{error}</p>
            </div>
          ) : !postDetail ? (
            <div className="flex items-center justify-center flex-1 min-h-[200px]">
              <p className="text-gray-500">데이터를 표시할 수 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {/* 이미지 영역 */}
                {postDetail.imagePath && (
                  <div className="px-6 pt-4">
                    <div className="flex justify-center overflow-hidden border border-gray-100 rounded-lg bg-gray-50">
                      <img 
                        src={postDetail.imagePath} 
                        alt="첨부 이미지" 
                        className="max-w-full max-h-[400px] object-contain" 
                      />
                    </div>
                  </div>
                )}

                {/* URL 영역 */}
                {postDetail.url && (
                  <div className="px-6 pt-4">
                    <div className="p-3 break-all border border-blue-100 rounded-md bg-blue-50/50">
                      <span className="mr-2 font-semibold text-blue-800">URL:</span>
                      <a 
                        href={postDetail.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-600 underline hover:text-blue-700"
                      >
                        {postDetail.url}
                      </a>
                    </div>
                  </div>
                )}

                {/* 본문 영역 */}
                <div className="px-6 py-4">
                  <div className="leading-relaxed text-gray-800 break-all whitespace-pre-wrap min-h-[100px]">
                    {postDetail.contents}
                  </div>
                </div>
              </div>

              {/* --- Footer (댓글 미리보기) --- */}
              {showComments && (
                <div 
                  className="px-6 py-3 transition-colors border-t cursor-pointer bg-gray-50/50 hover:bg-gray-100 shrink-0" 
                  onClick={() => setIsCommentDrawerOpen(true)}
                >
                  <LatestCommentPreview comments={postDetail?.comments} />
                </div>
              )}
            </>
          )}

          {/* 댓글 Drawer */}
          <CommentDrawer
            isOpen={isCommentDrawerOpen}
            onOpenChange={setIsCommentDrawerOpen}
            boardId={boardId}
            initialComments={postDetail?.comments || []}
            className="w-full max-w-[90vw] sm:max-w-[800px] mx-auto"
            // 댓글이 작성/삭제되면 refetchCounter를 올려서 메인 데이터를 조용히 갱신함
            onCommentUpdate={() => setRefetchCounter((prev) => prev + 1)}
          />
        </DialogContent>
      </Dialog>

      <style>{`
        .hide-default-close button[aria-label="Close"] { display: none !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 3px; }
      `}</style>
    </>
  );
}