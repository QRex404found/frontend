// src/pages/MyPost.jsx

import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import WritePostForm from '@/components/community/WritePostForm';
import { getMyPostsApi, deletePostApi } from '@/api/community';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

// ✅ 추가: resizable
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

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
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // ✅ 모바일 슬라이드 탭
  const [mobileTab, setMobileTab] = useState("write");

  if (!isLoggedIn) return <AuthPopup show={true} isMandatory={true} />;

  useEffect(() => {
    fetchMyPosts(currentPage);
  }, [currentPage, isLoggedIn]);

  const fetchMyPosts = async (page) => {
    setIsLoading(true);
    try {
      const data = await getMyPostsApi(page - 1, ITEMS_PER_PAGE, 'createdAt,desc');
      const mapped = data.content.map((p) => ({
        id: p.boardId,
        title: p.title,
        date: new Date(p.createdAt).toLocaleDateString('ko-KR'),
      }));
      setMyPosts(mapped);
      setTotalPages(data.totalPages);
    } catch {
      setMyPosts([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDelete = () => {
    if (isDeleteMode && selectedPosts.length > 0) {
      executeDelete();
    } else {
      setIsDeleteMode(!isDeleteMode);
      setSelectedPosts([]);
    }
  };

  const executeDelete = async () => {
    try {
      await Promise.all(selectedPosts.map((id) => deletePostApi(id)));
      toast.success("선택한 게시글을 삭제했습니다.");
      fetchMyPosts(currentPage);
    } catch {
      toast.error("삭제 실패");
    } finally {
      setIsDeleteMode(false);
      setSelectedPosts([]);
    }
  };

  const handlePostClick = (post) => {
    setSelectedBoardId(post.id);
    setShowDetailPopup(true);
  };

  return (
    <div className="px-4 pb-2 md:pb-4 md:px-8 -mt-[20px]">

      {showDetailPopup && (
        <PostDetailModal
          isOpen={showDetailPopup}
          onOpenChange={() => setShowDetailPopup(false)}
          boardId={selectedBoardId}
          showComments={true}
        />
      )}

      {/* ✅ PC에서만 제목 표시 */}
      <h1 className="hidden lg:block text-3xl font-medium mb-6 font-inter">My Post</h1>

      {/* ✅ PC 화면: Resizable 좌우 배치 */}
      <div className="hidden lg:flex w-full min-h-[500px]">
        <ResizablePanelGroup direction="horizontal" className="w-full">

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="pr-6">
              <WritePostForm onPostSuccess={() => fetchMyPosts(1)} />
            </div>
          </ResizablePanel>

          <ResizableHandle className="px-[px] cursor-col-resize">
            <div className="w-[1px] h-[85%] bg-gray-300 hover:bg-gray-400 transition-colors rounded -mt-[40px]" />
          </ResizableHandle>

          <ResizablePanel minSize={30}>
            <div className="pl-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-medium">My Post</h2>
                <Button size="sm" onClick={toggleDelete}
                  className={`${isDeleteMode ? 'bg-[#7CCF00] text-white' : 'text-gray-700 border border-gray-300 bg-white hover:bg-gray-100'}`}>
                  {isDeleteMode ? 'Submit' : 'Delete'}
                </Button>
              </div>

              <Table>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={3} className="py-6 text-center"><Loader2 className="animate-spin mx-auto text-green-500" /></TableCell></TableRow>
                  ) : (
                    myPosts.map((post, index) => (
                      <TableRow key={post.id} className="cursor-pointer hover:bg-gray-50"
                        onClick={() => !isDeleteMode && handlePostClick(post)}>
                        <TableCell className="w-[40px] text-center">
                          {isDeleteMode ? (
                            <Checkbox checked={selectedPosts.includes(post.id)}
                              onCheckedChange={() =>
                                setSelectedPosts(prev => prev.includes(post.id) ? prev.filter(i => i !== post.id) : [...prev, post.id])
                              }
                            />
                          ) : index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                        </TableCell>
                        <TableCell className="flex-1 font-medium">{post.title}</TableCell>
                        <TableCell className="text-right text-gray-500">{post.date}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem><PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} /></PaginationItem>
                    <PaginationItem><span className="px-4 py-2">Page {currentPage} / {totalPages}</span></PaginationItem>
                    <PaginationItem><PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} /></PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>

      {/* ✅ 모바일 : Segmented + 슬라이드 */}
      <div className="lg:hidden w-full mt-4">

        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200 shadow-sm">
            <button onClick={() => setMobileTab('write')}
              className={`px-4 py-1.5 rounded-full ${mobileTab === 'write' ? 'bg-white shadow-sm border border-gray-200' : 'text-gray-600'}`}>
              글 작성
            </button>

            <button onClick={() => setMobileTab('list')}
              className={`px-4 py-1.5 rounded-full ${mobileTab === 'list' ? 'bg-white shadow-sm border border-gray-200' : 'text-gray-600'}`}>
              내가 쓴 글
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="flex w-[200%] transition-transform duration-300 ease-out"
               style={{ transform: mobileTab === 'write' ? 'translateX(0)' : 'translateX(-50%)' }}>

            <div className="w-1/2 p-4">
              <WritePostForm onPostSuccess={() => fetchMyPosts(1)} />
            </div>

            <div className="w-1/2 p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">My Post</h2>
                <Button size="sm" onClick={toggleDelete}
                  className={`${isDeleteMode ? 'bg-[#81BF59] text-white' : 'text-gray-700 border border-gray-300 bg-white hover:bg-gray-100'}`}>
                  {isDeleteMode ? 'Submit' : 'Delete'}
                </Button>
              </div>

              <Table>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={3} className="py-6 text-center"><Loader2 className="animate-spin mx-auto text-green-500" /></TableCell></TableRow>
                  ) : (
                    myPosts.map((post, index) => (
                      <TableRow key={post.id} className="cursor-pointer hover:bg-gray-50"
                        onClick={() => !isDeleteMode && handlePostClick(post)}>
                        <TableCell className="w-[40px] text-center">
                          {isDeleteMode ? (
                            <Checkbox checked={selectedPosts.includes(post.id)}
                              onCheckedChange={() =>
                                setSelectedPosts(prev => prev.includes(post.id) ? prev.filter(i => i !== post.id) : [...prev, post.id])
                              }
                            />
                          ) : index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                        </TableCell>
                        <TableCell className="flex-1">{post.title}</TableCell>
                        <TableCell className="text-right text-gray-500">{post.date}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
