// src/pages/MyPost.jsx (이 코드로 덮어쓰기)

import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import { Pagination } from '@/components/common/Pagination'; 
import WritePostForm from '@/components/community/WritePostForm';
import { getMyPostsApi, deletePostApi } from '@/api/community'; 
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 10; 

export function MyPost() {
  const { isLoggedIn } = useAuth(); 
  
  const [myPosts, setMyPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState([]); 
  
  const [showDetailPopup, setShowDetailPopup] = useState(false); 
  const [selectedBoardId, setSelectedBoardId] = useState(null); 

  // 1. 로그인 검사
  if (!isLoggedIn) {
    return <AuthPopup show={true} isMandatory={true} />;
  }

  // 2. (로그인 된 경우) 데이터 로드
  useEffect(() => {
    fetchMyPosts(currentPage);
  }, [currentPage, isLoggedIn]);

  const fetchMyPosts = async (page) => {
    setIsLoading(true);
    try {
      const data = await getMyPostsApi(page - 1, ITEMS_PER_PAGE, 'createdAt,desc');
      const mappedPosts = data.content.map(post => ({
        id: post.boardId,
        title: post.title,
        date: new Date(post.createdAt).toLocaleDateString('ko-KR'),
      }));
      setMyPosts(mappedPosts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('내가 쓴 글 로드 실패:', error);
      setMyPosts([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 3. 핸들러 함수들
  const handleCheckboxChange = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    if (window.confirm(`선택된 ${selectedPosts.length}개 게시글을 삭제하시겠습니까?`)) {
      try {
        await Promise.all(selectedPosts.map(id => deletePostApi(id)));
        setSelectedPosts([]);
        fetchMyPosts(currentPage);
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }
  };

  const handlePostClick = (postFromList) => {
    setSelectedBoardId(postFromList.id);
    setShowDetailPopup(true);
  };

  const handleCloseDetail = () => {
    setShowDetailPopup(false);
    setSelectedBoardId(null);
  };

  const handlePostSuccess = () => {
    setCurrentPage(1);
    fetchMyPosts(1);
  };

  // 4. 렌더링
  return (
    <div className="p-4 md:p-8">
      {showDetailPopup && (
          <PostDetailModal 
            isOpen={showDetailPopup}
            onOpenChange={handleCloseDetail} 
            boardId={selectedBoardId}
            showComments={false}
          />
      )} 

      <div className="flex flex-col lg:flex-row lg:justify-center">
        {/* 왼쪽: 글쓰기 폼 */}
        <div className="flex-1 pr-8"> 
          <WritePostForm 
            onPostSuccess={handlePostSuccess} 
            initialData={myPosts.length > 0 ? myPosts[0] : null} 
          />
        </div>

        {/* 구분선 */}
        <div className="hidden lg:block h-auto px-4" style={{ borderLeft: '2px solid #CBD5E1' }}></div>

        {/* 오른쪽: 목록 */}
        <div className="flex-1 pl-8"> 
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-semibold">My Post</h2> 
            <Button 
              variant="outline" size="sm" 
              onClick={handleBulkDelete}
              disabled={selectedPosts.length === 0 || isLoading}
              className="text-sm px-2 py-1 h-auto border-gray-300 text-gray-700 hover:bg-gray-100" 
            >
              delete
            </Button>
          </div>
          <div className="border-b-2 border-gray-200 mb-8"></div>
      
          <Table>
            <TableBody>
              {isLoading && myPosts.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-6"><Loader2 className="h-6 w-6 animate-spin mx-auto text-green-500" /></TableCell></TableRow>
              ) : myPosts.map((post) => (
                <TableRow 
                    key={post.id} 
                    className="hover:bg-gray-50 py-3 cursor-pointer" 
                    onClick={(e) => {
                        if (e.target.type !== 'checkbox') {
                            handlePostClick(post);
                        }
                    }}
                >
                  <TableCell className="w-[40px] text-center py-3">
                    <Input 
                      type="checkbox" 
                      onClick={(e) => e.stopPropagation()} 
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleCheckboxChange(post.id)}
                      className="w-5 h-5 rounded-sm border-gray-400 text-[#8EE000] focus:ring-[#8EE000]" 
                    />
                  </TableCell>
                  <TableCell className="font-semibold flex-1 text-lg py-3">{post.title}</TableCell>
                  <TableCell className="text-right w-[150px] text-gray-500 text-base py-3">{post.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* 페이지네이션 */}
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