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
        />
      )}

      {/* PC 화면 */}
      <div className="hidden lg:flex justify-center gap-8 min-h-[350px]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <Card className="h-full w-full p-6 flex flex-col">
                <WritePostForm onPostSuccess={() => fetchPosts(1)} />
              </Card>
            </div>
          </ResizablePanel>

          <ResizableHandle
            className="
              w-[3px] bg-transparent hover:bg-gray-300 rounded-none relative cursor-col-resize
              fter:content-[''] after:absolute after:top-[20px] after:bottom-[20px]
+             after:left-[calc(50%-1px)] after:-translate-x-1/2 after:w-[1px]
              after:bg-gray-300 after:rounded-full
            "
          />

          <ResizablePanel minSize={30}>
            <div className="pl-4 h-full flex flex-col">
              <div className="w-full px-2 md:px-4 py-2 flex flex-col">
                <h1 className="mb-4 text-3xl font-medium hidden lg:block">My Post</h1>

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

      {/* 모바일 화면 */}
      {/* (Mobile layout 동일, 변경 없음) */}
      ...
    </div>
  );
}