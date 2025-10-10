import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
// Pagination, Table, TableBody 등은 CommonBoard에서 처리하므로 제거합니다.
import WritePostForm from '@/components/community/WritePostForm';
import { getMyPostsApi, deletePostApi } from '@/api/community';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { CommonBoard } from '@/components/common/CommonBoard'; // ✅ CommonBoard 임포트

import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';

// Tailwind 클래스 병합을 위한 유틸리티 함수 정의
const cn = (...classes) => classes.filter(Boolean).join(' '); 

// ===============================================
// ✅ Mock 함수 정의 (CommonBoard에서 사용하지 않는 Checkbox, Table 관련 Mock 제거)
// ===============================================

// Checkbox, Table 관련 Mock은 CommonBoard.jsx로 이동했거나 제거합니다.
if (typeof useAuth === 'undefined') {
    window.useAuth = () => ({ isLoggedIn: true, isChecked: true });
}
if (typeof AuthPopup === 'undefined') {
    window.AuthPopup = () => <div className="text-center p-8 text-red-500">로그인 필요 (Mock)</div>;
}
if (typeof WritePostForm === 'undefined') {
    window.WritePostForm = ({ onSuccess }) => (
        <div className="p-6 border-2 border-green-200 rounded-xl bg-white shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">게시글 작성/수정 (Mock)</h3>
            <textarea className="w-full p-3 border border-gray-300 rounded-lg resize-none" rows="5"></textarea>
            <button className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold" onClick={() => onSuccess && onSuccess()}>
                작성 완료 (Mock)
            </button>
        </div>
    );
}
if (typeof PostDetailModal === 'undefined') {
    window.PostDetailModal = ({ isOpen, onOpenChange, post }) => (
        isOpen ? (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => onOpenChange(false)}>
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-3xl font-extrabold mb-4 text-green-600">{post?.title}</h2>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post?.context}</p>
                    <button className="mt-6 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg" onClick={() => onOpenChange(false)}>
                        닫기
                    </button>
                </div>
            </div>
        ) : null
    );
}
// Pagination Mock은 CommonBoard에서 필요하므로 유지합니다.
if (typeof window.Pagination === 'undefined') {
    window.Pagination = ({ currentPage, totalPages, onPageChange }) => {
        if (totalPages <= 1) return null;
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        return (
            <div className="flex space-x-2 p-2">
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm
                            ${page === currentPage
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };
}
if (typeof getMyPostsApi === 'undefined') {
    window.getMyPostsApi = async () => ({ content: [], pageable: { totalPages: 0 } });
}
if (typeof deletePostApi === 'undefined') {
    window.deletePostApi = async () => true;
}

// ===============================================
// ✅ 더미 데이터 및 상수 정의
// ===============================================
const ITEMS_PER_PAGE = 10;
const TOTAL_DUMMY_POSTS = 25;
const DUMMY_MY_POSTS_FULL = Array.from({ length: TOTAL_DUMMY_POSTS }, (_, index) => ({
    id: index + 1,
    title: `더미 게시글 ${index + 1}`,
    date: `2025-09-${(21 - index % 5).toString().padStart(2, '0')}`,
    context: `이것은 ${index + 1}번째 게시글의 상세 내용입니다.`,
    author: 'my_user_id'
}));


export function MyPost() {
    const { isLoggedIn } = useAuth();
    
    const [myPosts, setMyPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(Math.ceil(TOTAL_DUMMY_POSTS / ITEMS_PER_PAGE));
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPosts, setSelectedPosts] = useState([]);
    
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [selectedPostDetail, setSelectedPostDetail] = useState(null);
    
    const [isDeleting, setIsDeleting] = useState(false);

    const IS_UI_DEVELOPMENT_MODE = true;
    
    const pageSize = 8;

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
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const paginatedPosts = DUMMY_MY_POSTS_FULL.slice(startIndex, endIndex);
                
                setMyPosts(paginatedPosts);
                setTotalPages(Math.ceil(TOTAL_DUMMY_POSTS / pageSize));
            } catch (error) {
                console.error('더미 데이터 로드 실패 시뮬레이션:', error);
            } finally {
                setIsLoading(false);
            }
        } else if (isLoggedIn) {
            try {
                const data = await getMyPostsApi(page - 1, pageSize);
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
        if (isDeleting && selectedPosts.length > 0) {
            console.log("선택된 게시글이 삭제되었습니다.");
            setSelectedPosts([]);
            setIsDeleting(false);
            fetchMyPosts(currentPage);
        } else if (isDeleting && selectedPosts.length === 0) {
            setIsDeleting(false);
        } else {
            setIsDeleting(true);
            setSelectedPosts([]);
        }
    };
    
    const handlePostClick = (postObject) => {
        if (!isDeleting) {
            if (postObject) {
                setSelectedPostDetail(postObject);
                setShowDetailPopup(true);
            } else {
                console.error("클릭된 게시글 객체를 찾을 수 없습니다.");
            }
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
        <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {showDetailPopup && (
                <PostDetailModal 
                    isOpen={showDetailPopup}
                    onOpenChange={handleCloseDetail} 
                    post={selectedPostDetail} 
                />
            )} 

            <div className="flex flex-col lg:flex-row lg:justify-center gap-8">
                <div className="flex-1"> 
                    <WritePostForm 
                        onSuccess={handlePostSuccess} 
                        initialData={myPosts.length > 0 ? myPosts[0] : null} 
                    />
                </div>

                <div 
                    className="hidden lg:block h-auto px-4" 
                    style={{ 
                        borderLeft: '2px dashed #D1D5DB', 
                    }}
                >
                </div>

                {/* ✅ 게시글 목록 영역: H2 제목과 버튼은 그대로 유지 */}
                <div className="flex-1"> 
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-extrabold text-gray-800">My Post List</h2> 
                        <Button 
                            variant={isDeleting && selectedPosts.length > 0 ? "destructive" : "outline"}
                            size="sm" 
                            onClick={handleBulkDelete}
                            className={cn(
                                "text-sm px-4 py-2 h-auto transition-colors rounded-lg shadow-sm",
                                !isDeleting && "border-gray-400 text-gray-700 hover:bg-gray-100",
                                isDeleting && selectedPosts.length > 0 ? "bg-red-500 text-white hover:bg-red-600" :
                                isDeleting && "border-red-400 bg-white text-red-600 hover:bg-red-100"
                            )}
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {isDeleting 
                                ? (selectedPosts.length > 0 
                                    ? `Delete (${selectedPosts.length})` 
                                    : `Cancel`
                                    )
                                : 'Delete'}
                        </Button>
                    </div>

                    {/* ✅ CommonBoard 컴포넌트 사용으로 대체 */}
                    <CommonBoard
                        // 데이터 및 페이지네이션
                        posts={myPosts}
                        isLoading={isLoading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onItemClick={handlePostClick}
                        showIndex={true} 
                        caption="내가 작성한 게시글 목록입니다." 
                        rowHeightClass="h-16" // ✅ MyPost의 기존 높이 (h-16) 유지

                        // MyPost의 특수 기능 (삭제 모드 및 체크박스)
                        isDeleting={isDeleting}
                        selectedPosts={selectedPosts}
                        onCheckboxChange={handleCheckboxChange}
                        // CommonBoard 내부에 제목이 없으므로 title 속성은 생략
                    />
                </div>
            </div>
        </div>
    );
}
