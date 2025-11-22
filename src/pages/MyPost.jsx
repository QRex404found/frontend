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

  /* 게시글 로드 */
  useEffect(() => {
    if (isChecked && isLoggedIn && user) {
      fetchPosts(currentPage);
    }
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

  /* ChatBody → MyPost 자동 갱신 이벤트 리스너 */
  useEffect(() => {
    const handleRefresh = () => {
      console.log("🔄 MyPost: ChatBody 이벤트 감지 → 게시글 목록 갱신");
      fetchPosts(1);
    };

    window.addEventListener("analysis-updated", handleRefresh);
    return () => window.removeEventListener("analysis-updated", handleRefresh);
  }, []);

  /* 삭제 모드 */
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

  /* 상세 보기 */
  const openDetail = (item) => {
    setSelectedBoardId(item.id);
    setShowDetail(true);
  };

  const showEmpty = !isLoading && myPosts.length === 0;

  /* 인증 체크 */
  if (!isChecked) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <AuthPopup
        show={true}
        isMandatory={true}
        onClose={() => navigate('/')}
      />
    );
  }

  /* 렌더링 */
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
            {/* 왼쪽 패널 내용을 오른쪽(핸들)으로 밀착시킴 */}
            <div className="max-w-[550px] ml-auto h-full flex flex-col">
              <Card className="h-full w-full p-6 flex flex-col">
                <WritePostForm onPostSuccess={() => fetchPosts(1)} />
              </Card>
            </div>
          </ResizablePanel>

          {/* [ResizableHandle 수정됨]
              1. style={{ height: "calc(100% - 3rem)" }} : 띄어쓰기 주의! 위아래 둥근 모서리 제외
              2. self-center : 세로 중앙 정렬
              3. w-2 -ml-1 : 클릭 영역 확보 및 카드 테두리 위에 겹침
          */}
          <ResizableHandle 
            withHandle={false} 
            className="w-2 -ml-1 z-50 bg-transparent hover:bg-gray-300 transition-colors rounded-full outline-none cursor-col-resize self-center" 
            style={{ height: "calc(100% - 3rem)" }}
          />

          <ResizablePanel minSize={30}>
            <div className="pl-4 h-full flex flex-col">
              <div className="w-full px-2 md:px-4 py-2 flex flex-col">
                <h1 className="mb-4 text-3xl font-medium hidden lg:block">
                  My Post
                </h1>

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
              <Card className="w-full h-full p-4 flex flex-col">
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