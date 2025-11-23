import React, { useState, useEffect } from 'react';
// lockScroll 임포트 제거됨 (잘하셨습니다)
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
  
  // 1️⃣ [Plan B 추가] 화면 높이를 저장할 상태 변수 (기본값 70vh)
  const [drawerHeight, setDrawerHeight] = useState('70vh');

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setComments(initialComments || []);
    }
  }, [isOpen, initialComments]);

  // 2️⃣ [Plan B 추가] iOS VisualViewport 리스너 (키보드 대응용)
  useEffect(() => {
    // VisualViewport API 지원 여부 확인 (최신 브라우저는 대부분 지원)
    if (!window.visualViewport) return;

    const handleResize = () => {
      // 현재 눈에 보이는 실제 화면 높이 (키보드 제외한 공간)
      const currentVisualHeight = window.visualViewport.height;
      
      // 키보드가 올라오든 말든, "현재 보이는 공간"의 70%를 Drawer 높이로 강제 설정
      // 계산된 픽셀(px) 값으로 변환하여 주입
      setDrawerHeight(`${currentVisualHeight * 0.7}px`);
    };

    // 이벤트 등록 (리사이즈 및 스크롤 시 재계산)
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);

    // 초기 실행
    handleResize();

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
      window.visualViewport.removeEventListener('scroll', handleResize);
    };
  }, []); // 빈 배열: 마운트 될 때 한 번만 실행 (이벤트 리스너 등록)


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
      const response = await reportCommentApi(commentId);
      const realData = response?.data || response;
      const message = realData?.message || realData;

      if (String(message).includes("삭제")) {
        toast.info("신고 누적으로 댓글이 삭제되었습니다.");
      } else {
        toast.success("댓글이 신고되었습니다.");
      }

      if (onCommentUpdate) onCommentUpdate();

    } catch (error) {
      console.log("DEBUG: 신고 에러 발생", error);
      const status = error.response?.status;

      if (status === 404 || status === 403 || status === 401) {
        toast.info("신고 누적으로 댓글이 삭제되었습니다.");
        if (onCommentUpdate) onCommentUpdate(); 
      } else {
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
      repositionInputs={false} // ✅ 유지 (라이브러리 자동 이동 방지)
    >
      {/* 3️⃣ [Plan B 수정] style 속성에 계산된 높이(drawerHeight) 직접 주입 */}
      {/* className에서 h-[70vh]를 빼도 되지만, 안전을 위해 남겨두고 style이 덮어쓰게 합니다 */}
      <DrawerContent 
        className={`flex flex-col rounded-t-xl ${className}`}
        style={{ height: drawerHeight, maxHeight: '85vh' }}
      >
        
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
          className="flex-none flex items-end gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t bg-white"
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