// src/pages/Community.jsx

import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { getCommunityPostsApi } from '@/api/community';
import { Loader2 } from 'lucide-react';
import { CommonBoard } from '@/components/common/CommonBoard';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 8;

export function Community() {
  const navigate = useNavigate();
  const { isLoggedIn, isChecked } = useAuth();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const fetchPosts = async (page = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCommunityPostsApi(page - 1, PAGE_SIZE);
      const transformedPosts = data.content.map((post) => ({
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();
    }
  }, [currentPage, isLoggedIn]);

  useEffect(() => {

    const handler = () => {
      fetchPosts();
    };

    //  이벤트 이름만 변경
    window.addEventListener("analysis-updated", handler);

    return () => window.removeEventListener("analysis-updated", handler);
  }, [currentPage]);

  /* 인증 체크 */
  if (!isChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
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

  /* 핸들러 */
  const handlePostClick = (item) => setSelectedBoardId(item.id);

  const handleCloseModal = () => setSelectedBoardId(null);

  const handleDeleteComplete = () => {
    setSelectedBoardId(null);
    fetchPosts();
  };

  /* 에러 */
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        게시글을 불러오는 중 오류가 발생했습니다: {error}
      </div>
    );
  }

  /* 렌더링 */
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-6 text-4xl font-medium">Community</h1>

        <CommonBoard
          posts={posts}
          isLoading={loading}
          onItemClick={handlePostClick}
          showIndex={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedBoardId && (
        <PostDetailModal
          isOpen={!!selectedBoardId}
          onOpenChange={handleCloseModal}
          boardId={selectedBoardId}
          onDeleteSuccess={handleDeleteComplete}
        />
      )}

    </div>
  );
}
