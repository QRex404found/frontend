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

  // write form state
  const [formState, setFormState] = useState({
    title: "",
    url: "",
    context: "",
    photoFile: null,
    previewUrl: null,
  });

  // 챗봇(analysis)에서 글 작성 시 목록 새로고침
  useEffect(() => {
    const handler = () => fetchPosts(1);
    window.addEventListener("analysis-updated", handler);
    return () => window.removeEventListener("analysis-updated", handler);
  }, []);

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

  const toggleSelect = (id) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
    } finally {
      setIsDeleting(false);
      setSelectedPosts([]);
    }
  };

  const openDetail = (item) => {
    setSelectedBoardId(item.id);
    setShowDetail(true);
  };


  const handleDeleteComplete = () => {
    // 1) 모달 닫기 & 선택 초기화
    setShowDetail(false);
    setSelectedBoardId(null);

    // 2) body에 걸려 있을 수 있는 스타일 강제 복원
    document.body.style.overflow = 'unset';
    document.body.style.pointerEvents = 'auto';
    // 혹시 pointer-events가 인라인으로 남아 있으면 제거
    document.body.style.removeProperty('pointer-events');

    // 3) 로컬 리스트에서 즉시 제거
    setMyPosts((prev) => prev.filter((p) => p.id !== selectedBoardId));

    // 4) 서버와 동기화용 재조회
    setTimeout(() => fetchPosts(currentPage), 100);
  };

  const showEmpty = !isLoading && myPosts.length === 0;

  if (!isChecked)
    return <div>Loading...</div>;

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

      {/* PC */}
      <div className="hidden lg:flex justify-center gap-8 min-h-[350px]">
        <ResizablePanelGroup direction="horizontal">

          <ResizablePanel defaultSize={50} minSize={30}>
            <Card className="flex flex-col w-full h-full p-6">
              <WritePostForm
                formState={formState}
                setFormState={setFormState}
                onPostSuccess={() => fetchPosts(1)}
              />
            </Card>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel minSize={30}>
            <div className="flex flex-col h-full pl-4">
              <div className="flex flex-col w-full px-2 py-2 md:px-4">
                <MyPostBoard
                  {...{
                    isDeleting,
                    toggleDeleteMode,
                    toggleSelect,
                    myPosts,
                    isLoading,
                    currentPage,
                    totalPages,
                    setCurrentPage,
                    openDetail,
                    selectedPosts,
                    showEmpty,
                    rowHeightClass: "h-12",
                  }}
                />
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>

      {/* Mobile (Analysis 탭 UI와 동일 스타일) */}
      <div className="w-full mt-4 lg:hidden">

        <div className="flex items-center justify-center mb-3">
          <div className="inline-flex p-1 bg-gray-100 border border-gray-200 rounded-full shadow-sm">

            <button
              onClick={() => setMobileTab("write")}
              className={`px-4 py-1.5 text-sm rounded-full ${
                mobileTab === "write"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600"
              }`}
            >
              작성
            </button>

            <button
              onClick={() => setMobileTab("list")}
              className={`px-4 py-1.5 text-sm rounded-full ${
                mobileTab === "list"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600"
              }`}
            >
              나의 게시글
            </button>

          </div>
        </div>

        <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
          <div
            className="flex w-[200%] transition-transform duration-300 ease-out"
            style={{
              transform:
                mobileTab === "write"
                  ? "translateX(0)"
                  : "translateX(-50%)",
            }}
          >
            <div className="w-1/2 p-4">
              <Card className="flex flex-col w-full h-full p-4">
                <WritePostForm
                  formState={formState}
                  setFormState={setFormState}
                  onPostSuccess={() => fetchPosts(1)}
                />
              </Card>
            </div>

            <div className="w-1/2 p-4">
              <MyPostBoard
                {...{
                  isDeleting,
                  toggleDeleteMode,
                  toggleSelect,
                  myPosts,
                  isLoading,
                  currentPage,
                  totalPages,
                  setCurrentPage,
                  openDetail,
                  selectedPosts,
                  showEmpty,
                  rowHeightClass: "h-14",
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
