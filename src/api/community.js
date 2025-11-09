// 백엔드와 통신하는 모듈
import apiClient from './index';

// --- 게시글 조회/관리 ---

// 1. 모든 게시글 목록 조회 (GET /api/community/posts)
export const getCommunityPostsApi = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/community/posts', {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    throw error;
  }
};

// 2. 내가 작성한 게시글 목록 조회 (GET /api/community/myposts)
export const getMyPostsApi = async (page = 0, size = 10, sort = 'createdAt,desc') => {
  try {
    const response = await apiClient.get('/community/myposts', {
      params: { 
        page, 
        size,
        sort // 🌟 이제 이 'sort' 변수를 인식할 수 있습니다.
      },
    });
    return response.data;
  } catch (error) {
    console.error('내 게시글 조회 실패:', error);
    throw error;
  }
};

// 3. 특정 게시글 상세 조회 (GET /api/community/posts/{boardId})
export const getPostDetailApi = async (boardId) => {
  try {
    const response = await apiClient.get(`/community/posts/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
    throw error;
  }
};

// 4. 새 게시글 작성 (POST /api/community/posts)
export const createPostApi = async (formData) => {
  try {
    // 1. localStorage에서 토큰을 가져옵니다.
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error("No auth token found. Please log in.");
    }

    const response = await apiClient.post(
      '/community/posts',
      formData,
      {
        headers: {
          // 2. 기존 FormData용 헤더
          'Content-Type': 'multipart/form-data',
          // 3. (핵심) 인증 헤더를 수동으로 다시 추가합니다.
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    throw error;
  }
};

// 5. 게시글 삭제 (DELETE /api/community/posts/{boardId})
export const deletePostApi = async (boardId) => {
  try {
    const response = await apiClient.delete(`/community/posts/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};

// --- 댓글 조회/관리 ---

// 6. 댓글 추가 (POST /api/community/posts/{boardId}/comments)
export const addCommentApi = async (boardId, commentContent) => {
  const requestData = { contents: commentContent };

  try {
    const response = await apiClient.post(
      `/community/posts/${boardId}/comments`,
      requestData,
    );
    return response.data;
  } catch (error) {
    console.error('댓글 추가 실패:', error);
    throw error;
  }
};

// 7. 댓글 삭제 (DELETE /api/community/comments/{commentId})
export const deleteCommentApi = async (commentId) => {
  try {
    const response = await apiClient.delete(`/community/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
    throw error;
  }
};

// --- 신고 기능 ---

// 8. 게시글 신고 (POST /api/community/posts/{boardId}/report)
export const reportPostApi = async (boardId) => {
  try {
    const response = await apiClient.post(`/community/posts/${boardId}/report`);
    return response.data;
  } catch (error) {
    console.error('게시글 신고 실패:', error);
    throw error;
  }
};

// 9. 댓글 신고 (POST /api/community/comments/{commentId}/report)
export const reportCommentApi = async (commentId) => {
  try {
    const response = await apiClient.post(`/community/comments/${commentId}/report`);
    return response.data;
  } catch (error) {
    console.error('댓글 신고 실패:', error);
    throw error;
  }
};
