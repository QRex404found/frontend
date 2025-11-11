// src/pages/Community.jsx (이 코드로 파일 전체를 덮어쓰세요)

import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { getCommunityPostsApi } from '@/api/community';
import { Loader2 } from 'lucide-react';
import { CommonBoard } from '@/components/common/CommonBoard';

const PAGE_SIZE = 8;

export function Community() {
  const { isLoggedIn, isChecked } = useAuth();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  useEffect(() => {
    const fetchPosts = async (page) => {
      setLoading(true);
      setError(null);
      try {
        // Spring Page는 0부터 시작하므로 page - 1
        const data = await getCommunityPostsApi(page - 1, PAGE_SIZE);

        const transformedPosts = data.content
          .slice()
          .reverse()
          .map((post) => ({
            id: post.boardId,
            title: post.title,
            date: post.createdAt,
          }));

        setPosts(transformedPosts);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('게시글 목록 로드 실패:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchPosts(currentPage);
    }
  }, [currentPage, isLoggedIn]);

  /* 1. 인증 체크 로직 */
  if (!isChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthPopup show={true} isMandatory={true} />;
  }

  /* 2. 핸들러 함수들 */
  const handlePostClick = (item) => {
    setSelectedBoardId(item.id);
  };

  const handleCloseModal = () => {
    setSelectedBoardId(null);
  };

  // ⬇️ [수정 2] 페이지 이동 핸들러 삭제 (CommonBoard로 이동)
  /*
  const handlePreviousPage = () => {
    // 1페이지보다 작아지지 않도록 방지
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    // 마지막 페이지보다 커지지 않도록 방지
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  */

  /* 3. 에러 발생 시 UI */
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        게시글을 불러오는 중 오류가 발생했습니다: {error}
      </div>
    );
  }

  /* 4. 최종 렌더링 */
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-6 text-4xl font-medium">Community</h1>

        {/* ⬇️ [수정 3] props 다시 전달 */}
        <CommonBoard
          posts={posts}
          isLoading={loading}
          onItemClick={handlePostClick}
          showIndex={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} // ⬅️ 핸들러 대신 setCurrentPage 전달
        />

        {/* ⬇️ [수정 4] 외부 Pagination JSX 삭제 */}
        {/*
        <div className="flex justify-center mt-6">
          <Pagination> ... </Pagination>
        </div>
        */}
      </div>

      {/* 게시글 상세 모달 */}
      <PostDetailModal
        isOpen={!!selectedBoardId}
        onOpenChange={handleCloseModal}
        boardId={selectedBoardId}
      />
    </div>
  );
}