import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import WritePostForm from '@/components/community/WritePostForm';
import { getMyPostsApi, deletePostApi } from '@/api/community';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CommonBoard } from '@/components/common/CommonBoard';

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const ITEMS_PER_PAGE = 8;

export function MyPost() {
  const { isLoggedIn } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const [mobileTab, setMobileTab] = useState("write");

  if (!isLoggedIn) return <AuthPopup show={true} isMandatory={true} />;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    setIsLoading(true);
    try {
      const data = await getMyPostsApi(page - 1, ITEMS_PER_PAGE, 'createdAt,desc');
      const mapped = data.content.map((p) => ({
        id: p.boardId,
        title: p.title,
        date: p.createdAt,
      }));
      setMyPosts(mapped);
      setTotalPages(Math.max(data.totalPages || 1, 1));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDeleteMode = () => {
    if (isDeleting && selectedPosts.length > 0) {
      deleteSelected();
    } else {
      setIsDeleting(!isDeleting);
      setSelectedPosts([]);
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedPosts.map((id) => deletePostApi(id)));
      toast.success("게시글이 삭제되었습니다.");
      fetchPosts(currentPage);
    } catch {
      toast.error("삭제 실패");
    } finally {
      setIsDeleting(false);
      setSelectedPosts([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openDetail = (item) => {
    setSelectedBoardId(item.id);
    setShowDetail(true);
  };

  const showEmpty = !isLoading && myPosts.length === 0;

  return (
    <div className="px-4 md:px-8 pb-8 max-w-[1300px] mx-auto">

      {showDetail && (
        <PostDetailModal
          isOpen={showDetail}
          onOpenChange={() => setShowDetail(false)}
          boardId={selectedBoardId}
          showComments={true}
        />
      )}

      {/* ✅ PC */}
      <div className="hidden lg:flex justify-center gap-8 min-h-[620px]">
        <ResizablePanelGroup direction="horizontal">

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="max-w-[550px] mx-auto">
              <WritePostForm onPostSuccess={() => fetchPosts(1)} />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel minSize={30}>
            <div className="max-w-[550px] mx-auto">

              <h2 className="text-2xl font-medium mb-4">My Post</h2>

              <div className="flex justify-end mb-3">
                <Button
                  onClick={toggleDeleteMode}
                  variant={isDeleting ? "default" : "outline"}
                  className={`
                    w-[80px] text-sm font-medium
                    ${isDeleting
                      ? "bg-[#7CCF00] text-white border-[#7CCF00] hover:bg-[#6AC600]"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  {isDeleting ? "Submit" : "Delete"}
                </Button>
              </div>

              {!showEmpty ? (
                <CommonBoard
                  posts={myPosts}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onItemClick={openDetail}
                  isDeleting={isDeleting}
                  selectedPosts={selectedPosts}
                  onCheckboxChange={toggleSelect}
                  rowHeightClass="h-12"
                />
              ) : (
                <div className="py-10 text-center text-gray-500">
                  등록된 게시물이 없습니다.
                </div>
              )}

            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>

      {/* ✅ 모바일 */}
      <div className="lg:hidden mt-4 w-full">
        <div className="mb-3 flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setMobileTab("write")}
              className={`px-4 py-1.5 rounded-full ${mobileTab === "write" ? "bg-white shadow-sm border" : "text-gray-600"}`}
            >
              글 작성
            </button>
            <button
              onClick={() => setMobileTab("list")}
              className={`px-4 py-1.5 rounded-full ${mobileTab === "list" ? "bg-white shadow-sm border" : "text-gray-600"}`}
            >
              내가 쓴 글
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div
            className="flex w-[200%] transition-transform duration-300"
            style={{ transform: mobileTab === "write" ? "translateX(0)" : "translateX(-50%)" }}
          >
            <div className="w-1/2 p-4">
              <WritePostForm onPostSuccess={() => fetchPosts(1)} />
            </div>

            <div className="w-1/2 p-4">
              <h2 className="text-xl font-medium mb-3">My Post</h2>

              <div className="flex justify-end mb-3">
                <Button
                  onClick={toggleDeleteMode}
                  variant={isDeleting ? "default" : "outline"}
                  className={`
                    w-[80px] text-sm font-medium
                    ${isDeleting
                      ? "bg-[#7CCF00] text-white border-[#7CCF00] hover:bg-[#6AC600]"
                      : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  {isDeleting ? "Submit" : "Delete"}
                </Button>
              </div>

              {!showEmpty ? (
                <CommonBoard
                  posts={myPosts}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onItemClick={openDetail}
                  isDeleting={isDeleting}
                  selectedPosts={selectedPosts}
                  onCheckboxChange={toggleSelect}
                  rowHeightClass="h-14"
                />
              ) : (
                <div className="py-10 text-center text-gray-500">
                  등록된 게시물이 없습니다.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
