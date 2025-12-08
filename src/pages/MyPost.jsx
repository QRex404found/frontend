// src/pages/MyPost.jsx
import React, { useState, useEffect, useMemo } from 'react';
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

  // 🔥 write form state만 추가
  const [formState, setFormState] = useState({
    title: "",
    url: "",
    context: "",
    photoFile: null,
    previewUrl: null,
  });

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
      toast.success("삭제되었습니다.");
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
    setShowDetail(false);
    setSelectedBoardId(null);
    setMyPosts((prev) => prev.filter((p) => p.id !== selectedBoardId));
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
                <MyPostBoard {...{
                  isDeleting,
                  toggleDeleteMode,
                  myPosts,
                  isLoading,
                  currentPage,
                  totalPages,
                  setCurrentPage,
                  openDetail,
                  selectedPosts,
                  toggleSelect,
                  showEmpty,
                  rowHeightClass: "h-12",
                }} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile */}
      <div className="w-full mt-4 lg:hidden">
        <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
          <div
            className="flex w-[200%] transition-transform duration-300"
            style={{ transform: mobileTab === "write" ? "translateX(0)" : "translateX(-50%)" }}
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
              <MyPostBoard {...{
                isDeleting,
                toggleDeleteMode,
                myPosts,
                isLoading,
                currentPage,
                totalPages,
                setCurrentPage,
                openDetail,
                selectedPosts,
                toggleSelect,
                showEmpty,
                rowHeightClass: "h-14",
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
