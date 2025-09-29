import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
// [수정] Pagination은 내부에서 구현하거나, props를 받아 작동하는 컴포넌트라고 가정합니다.
import { Pagination } from '@/components/common/Pagination'; 
import WritePostForm from '@/components/community/WritePostForm';
import { getMyPostsApi, deletePostApi } from '@/api/community';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { Loader2 } from 'lucide-react';


// ===============================================
// ✅ 1. UI 개발을 위한 임시 더미 데이터 (총 25개 생성)
// ===============================================
const ITEMS_PER_PAGE = 10; // 페이지당 10개
const TOTAL_DUMMY_POSTS = 25; // 전체 25개
const DUMMY_MY_POSTS_FULL = Array.from({ length: TOTAL_DUMMY_POSTS }, (_, index) => ({
    id: TOTAL_DUMMY_POSTS - index, // ID는 역순으로 (최신순)
    title: `더미 게시글 ${TOTAL_DUMMY_POSTS - index}`,
    date: `2025-09-${(21 - index % 5).toString().padStart(2, '0')}`, // 날짜 변화 시뮬레이션
    context: `이것은 ${TOTAL_DUMMY_POSTS - index}번째 게시글의 상세 내용입니다.`, 
    photo: (index % 5 === 0) ? 'dummy_photo_url' : null, // 5개마다 사진 존재 시뮬레이션
    url: (index % 3 === 0) ? `http://qrex.com/post/${TOTAL_DUMMY_POSTS - index}` : null,
    author: 'my_user_id' // PostDetailModal에서 author를 사용하므로 추가
}));


export function MyPost() {
  const { isLoggedIn } = useAuth(); 
  
  const [myPosts, setMyPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(TOTAL_DUMMY_POSTS / ITEMS_PER_PAGE)); 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState([]); 
  
  const [showDetailPopup, setShowDetailPopup] = useState(false); 
  const [selectedPostDetail, setSelectedPostDetail] = useState(null); // ✅ Post 객체 전체를 저장합니다.

  const IS_UI_DEVELOPMENT_MODE = true;

  if (!isLoggedIn && !IS_UI_DEVELOPMENT_MODE) {
    return <AuthPopup />;
  }

  useEffect(() => {
    if (IS_UI_DEVELOPMENT_MODE || isLoggedIn) {
      fetchMyPosts(currentPage);
    }
  }, [currentPage, isLoggedIn]);

  const fetchMyPosts = async (page) => {
    setIsLoading(true);
    
    if (IS_UI_DEVELOPMENT_MODE) {
      try {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        const paginatedPosts = DUMMY_MY_POSTS_FULL.slice(startIndex, endIndex);
        
        setMyPosts(paginatedPosts);
        setTotalPages(Math.ceil(TOTAL_DUMMY_POSTS / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('더미 데이터 로드 실패 시뮬레이션:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (isLoggedIn) {
      try {
        const data = await getMyPostsApi(page - 1, ITEMS_PER_PAGE);
        setMyPosts(data.content); 
        setTotalPages(data.pageable.totalPages);
      } catch (error) {
        console.error('내가 쓴 글 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleCheckboxChange = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) {
      console.warn("삭제할 게시글을 선택해주세요.");
      return;
    }

    if (window.confirm(`선택된 게시글 ${selectedPosts.length}개를 정말로 삭제하시겠습니까?`)) {
      try {
        if (IS_UI_DEVELOPMENT_MODE) {
          console.log(`[Mock] ${selectedPosts.length}개 삭제 시뮬레이션`);
        } 
        // ... 실제 API 삭제 로직 생략 ...

        console.log("선택된 게시글이 삭제되었습니다.");
        setSelectedPosts([]); 
        fetchMyPosts(currentPage); 
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }
  };
  
  // ✅ [수정] Post ID 대신 Post 객체 전체를 받도록 함수 시그니처 변경
  const handlePostClick = (postObject) => {
    
    if (postObject) {
        setSelectedPostDetail(postObject); // ✅ Post 객체 전체를 상태에 저장
        setShowDetailPopup(true);
    } else {
        console.error("클릭된 게시글 객체를 찾을 수 없습니다.");
    }
  };

  const handleCloseDetail = () => {
    setShowDetailPopup(false);
    setSelectedPostDetail(null);
  };

  const handlePostSuccess = () => {
    setCurrentPage(1);
    fetchMyPosts(1);
  };

  return (
    <div className="p-4 md:p-8">
      {showDetailPopup && (
          <PostDetailModal 
            isOpen={showDetailPopup}
            onOpenChange={handleCloseDetail} 
            post={selectedPostDetail} // ✅ [핵심 수정] postDetailModal의 post prop에 객체 전달
          />
      )} 

      {/* 중앙 분할 레이아웃 */}
      <div className="flex flex-col lg:flex-row lg:justify-center">
        
        {/* 1. 게시글 작성 폼 (왼쪽) */}
        <div className="flex-1 pr-8"> 
          <WritePostForm 
            onSuccess={handlePostSuccess} 
            initialData={myPosts.length > 0 ? myPosts[0] : null} 
          />
        </div>

        {/* 수직 구분선 (중앙에 위치) */}
        <div 
            className="hidden lg:block h-auto px-4" 
            style={{ 
                borderLeft: '2px solid #CBD5E1', 
            }}
        >
        </div>

        {/* 2. 게시글 목록 (오른쪽) */}
        <div className="flex-1 pl-8"> 
          {/* My Post 제목 및 삭제 버튼 영역 */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-semibold">My Post</h2> 
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkDelete}
              disabled={selectedPosts.length === 0}
              className="text-sm px-2 py-1 h-auto border-gray-300 text-gray-700 hover:bg-gray-100" 
            >
              delete
            </Button>
          </div>

          <div className="border-b-2 border-gray-200 mb-8"></div>

          <Table>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center py-6"><Loader2 className="h-6 w-6 animate-spin mx-auto text-green-500" /></TableCell></TableRow>
              ) : myPosts.map((post) => (
                <TableRow 
                    key={post.id} 
                    className="hover:bg-gray-50 py-3 cursor-pointer" 
                    onClick={(e) => {
                        // 체크박스 클릭이 아닐 경우에만 상세 보기 실행
                        if (e.target.type !== 'checkbox') {
                            handlePostClick(post); // ✅ post 객체 전체 전달
                        }
                    }}
                >
                  {/* 체크박스 Cell */}
                  <TableCell className="w-[40px] text-center py-3">
                    <Input 
                      type="checkbox" 
                      onClick={(e) => e.stopPropagation()} 
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleCheckboxChange(post.id)}
                      className="w-5 h-5 rounded-sm border-gray-400 text-[#8EE000] focus:ring-[#8EE000]" 
                    />
                  </TableCell>
                  
                  {/* 제목 Cell */}
                  <TableCell className="font-semibold flex-1 text-lg py-3">{post.title}</TableCell>
                  
                  {/* 작성일 Cell */}
                  <TableCell className="text-right w-[150px] text-gray-500 text-base py-3">{post.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* 페이지네이션 컴포넌트 */}
          <div className="mt-6 flex justify-center">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
