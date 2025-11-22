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

  // 1. 함수를 useEffect 밖으로 정의
  const fetchPosts = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCommunityPostsApi(page - 1, PAGE_SIZE);
      const transformedPosts = data.content.slice().map((post) => ({
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

  // 2. useEffect에서는 호출만 함
  useEffect(() => {
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

  // 새 AuthPopup 구조 적용
  if (!isLoggedIn) {
    return (
      <AuthPopup
        show={true}
        isMandatory={true}
        onClose={() => navigate('/')}
      />
    );
  }

  /* 2. 핸들러 */
  const handlePostClick = (item) => {
    setSelectedBoardId(item.id);
  };

  const handleCloseModal = () => {
    setSelectedBoardId(null);
  };

  // ✅ 삭제 완료 핸들러 (수정됨: 스크롤 잠금 강제 해제 추가)
  const handleDeleteComplete = () => {
    // 1. 모달 닫기 (State 초기화)
    setSelectedBoardId(null);

    // 2. [핵심] 스크롤 잠금 강제 해제 (화면 먹통 해결)
    // 모달 라이브러리가 꼬여서 style이 남아있을 경우를 대비해 강제로 풉니다.
    document.body.style.overflow = 'unset';

    // 3. 화면 리스트에서 즉시 제거 (Optimistic Update)
    setPosts((prev) => prev.filter((post) => post.id !== selectedBoardId));

    // 4. 서버 데이터 확실한 동기화를 위해 약간 뒤에 재요청
    setTimeout(() => {
      fetchPosts(currentPage);
    }, 100);
  };

  /* 3. 에러 화면 */
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        게시글을 불러오는 중 오류가 발생했습니다: {error}
      </div>
    );
  }

  /* 4. 실제 렌더링 */
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

      {/* 게시글 상세 모달 */}
      <PostDetailModal
        isOpen={!!selectedBoardId}
        onOpenChange={handleCloseModal}
        boardId={selectedBoardId}
        onDeleteSuccess={handleDeleteComplete}
      />
    </div>
  );
}