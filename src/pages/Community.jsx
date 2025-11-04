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
    /* (핵심)
     * fetchPosts 함수 로직을 useEffect 안으로 가져옵니다.
     * 이렇게 하면 ReferenceError가 해결되고,
     * useEffect가 올바르게 currentPage와 isLoggedIn만 의존하게 됩니다.
     */
    const fetchPosts = async (page) => {
      setLoading(true);
      setError(null);
      try {
        // Spring Page는 0부터 시작하므로 page - 1
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

    /* 훅 내부에서 조건문을 쓰는 것은 괜찮습니다. */
    if (isLoggedIn) {
      fetchPosts(currentPage);
    }
  }, [currentPage, isLoggedIn]); // 의존성 배열은 그대로 둡니다.

  /* 1. 인증 체크 로직 */
  if (!isChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
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

  /* 3. 에러 발생 시 UI */
  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        게시글을 불러오는 중 오류가 발생했습니다: {error}
      </div>
    );
  }

  /* 4. 최종 렌더링 */
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Community</h1>

        {/* 게시판 목록 (CommonBoard) */}
        <CommonBoard
          posts={posts}
          isLoading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onItemClick={handlePostClick}
          showIndex={true}
        />
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