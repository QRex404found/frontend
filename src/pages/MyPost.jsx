// src/pages/MyPost.jsx

import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import WritePostForm from '@/components/community/WritePostForm';
import { getMyPostsApi, deletePostApi } from '@/api/community';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import MyPostBoard from '@/components/community/MyPostBoard';

const ITEMS_PER_PAGE = 8;

export function MyPost() {
  const navigate = useNavigate();
  const { isLoggedIn, isChecked, user } = useAuth();

  const [myPosts, setMyPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const [mobileTab, setMobileTab] = useState("write");

  useEffect(() => {
    if (isChecked && isLoggedIn && user) fetchPosts(currentPage);
  }, [currentPage, isChecked, isLoggedIn, user]);

  const fetchPosts = async (page) => {
    setIsLoading(true);
    try {
      const data = await getMyPostsApi(
        page - 1,
        ITEMS_PER_PAGE,
        'createdAt,desc',
        user?.userId
      );
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

  useEffect(() => {
    const handleRefresh = () => fetchPosts(1);
    window.addEventListener("analysis-updated", handleRefresh);
    return () => window.removeEventListener("analysis-updated", handleRefresh);
  }, []);

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

  // ✅ 삭제 완료 핸들러 (수정됨: 스크롤 잠금 강제 해제 추가)
  const handleDeleteComplete = () => {
    // 1. 모달 닫기 (State 초기화)
    setShowDetail(false);
    setSelectedBoardId(null);

    // 2. [핵심] 스크롤 잠금 강제 해제 (화면 먹통 해결)
    document.body.style.overflow = 'unset';

    // 3. 화면 리스트에서 즉시 제거 (Optimistic Update)
    setMyPosts((prev) => prev.filter((post) => post.id !== selectedBoardId));

    // 4. 서버 데이터 확실한 동기화를 위해 약간 뒤에 재요청
    setTimeout(() => {
      fetchPosts(currentPage);
    }, 100);
  };

  const showEmpty = !isLoading && myPosts.length === 0;

  if (!isChecked)
    return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;

  if (!isLoggedIn)
    return <AuthPopup show={true} isMandatory={true} onClose={() => navigate('/')} />;

  return (
    <div className="px-4 md:px-8 max-w-[1300px] mx-auto pb-4">

      {showDetail && (
        <PostDetailModal
          isOpen={showDetail}
          onOpenChange={() => setShowDetail(false)}
          boardId={selectedBoardId}
          showComments={true}
          onDeleteSuccess={handleDeleteComplete}
        />
      )}

      {/* PC 화면 */}
      <div className="hidden lg:flex justify-center gap-8 min-h-[350px]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex flex-col h-full">
              <Card className="flex flex-col w-full h-full p-6">
                <WritePostForm onPostSuccess={() => fetchPosts(1)} />
              </Card>
            </div>
          </ResizablePanel>

          <ResizableHandle
            className="
              w-[0.5px] bg-transparent rounded-none relative cursor-col-resize

              after:content-[''] after:absolute
              after:top-[20px] after:bottom-[20px]
              after:left-[calc(50%-1px)] after:-translate-x-1/2 after:w-[1px]
            after:bg-[#E5E5E5] after:rounded-full

              hover:bg-transparent
            hover:after:bg-[#E5E5E5]
            "
          />


          <ResizablePanel minSize={30}>
            <div className="flex flex-col h-full pl-4">
              <div className="flex flex-col w-full px-2 py-2 md:px-4">
                <h1 className="hidden mb-4 text-3xl font-medium lg:block">My Post</h1>

                <MyPostBoard
                  isDeleting={isDeleting}
                  toggleDeleteMode={toggleDeleteMode}
                  myPosts={myPosts}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  openDetail={openDetail}
                  selectedPosts={selectedPosts}
                  toggleSelect={toggleSelect}
                  showEmpty={showEmpty}
                  rowHeightClass="h-12"
                />
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>

      <div className="w-full mt-4 lg:hidden">
        <div className="flex justify-center mb-3">
          <div className="inline-flex p-1 bg-gray-100 border border-gray-200 rounded-full shadow-sm">
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

        <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
          <div
            className="flex w-[200%] transition-transform duration-300"
            style={{
              transform: mobileTab === "write"
                ? "translateX(0)"
                : "translateX(-50%)"
            }}
          >

            <div className="w-1/2 p-4">
              <Card className="flex flex-col w-full h-full p-4">
                <WritePostForm onPostSuccess={() => fetchPosts(1)} />
              </Card>
            </div>

            <div className="w-1/2 p-4">
              <MyPostBoard
                isDeleting={isDeleting}
                toggleDeleteMode={toggleDeleteMode}
                myPosts={myPosts}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                openDetail={openDetail}
                selectedPosts={selectedPosts}
                toggleSelect={toggleSelect}
                showEmpty={showEmpty}
                rowHeightClass="h-14"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}