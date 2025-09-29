import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthPopup } from '@/components/common/AuthPopup';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { getCommunityPostsApi } from '@/api/community';
import { Loader2 } from 'lucide-react';
import { CommonBoard } from '@/components/common/CommonBoard'; // ✅ CommonBoard 임포트

// ✅ 문법 오류 수정: DUMMY_POSTS를 하나의 배열로 올바르게 정의했습니다.
const DUMMY_POSTS = [
    // 기존 35개 게시글
    ...Array.from({ length: 35 }, (_, i) => ({
        id: i + 1,
        title: `QREX 사용자들과 정보를 공유하세요 (${i + 1})`,
        date: `2025-09-${(i % 30) + 1}`,
        context: `게시글 상세 내용 ${i + 1}`,
        photo: null, 
        url: `http://example.com/${i + 1}`, 
        author: `user${i + 1}` 
    })),
    // ID 36번: 긴 제목과 내용을 가진 테스트 게시글
    {
        id: 36,
        title: "웹 애플리케이션의 반응형 UI 테스트를 위한 게시글입니다. 모바일, 태블릿, 데스크톱 등 다양한 화면 크기에서 제목이 올바르게 줄 바꿈되고 표시되는지 확인하는 것이 주 목적입니다. 이 글은 UI/UX 최적화를 위한 기초 데이터로 활용됩니다. 제목이 너무 길어서 UI를 벗어나지 않는지, 폰트 크기나 레이아웃에 문제가 없는지 확인해주세요. 개발팀에서 성능 테스트와 디자인 검수를 위해 사용되는 테스트용 게시글입니다. 이 제목은 특별한 의미 없이 오로지 테스트 목적으로 작성되었습니다. 이 글을 통해 사용자 경험을 개선하고, 더 안정적인 서비스를 제공할 수 있기를 바랍니다. 감사합니다.",
        date: "2025-09-30",
        context: "이 게시글의 내용은 전반적인 서비스 안정성 및 기능 테스트를 위한 목적으로 작성되었습니다. 게시글 내용이 많아질 때 로딩 속도, 스크롤 성능, 그리고 이미지나 링크와 같은 추가 요소들이 정상적으로 작동하는지 확인합니다. 이 더미 데이터는 실제 사용자에게 영향을 주지 않으면서도 다양한 시나리오를 시뮬레이션하는 데 중요한 역할을 합니다. 특히, 댓글 기능과 좋아요 기능의 부하 테스트를 위해 여러 개의 가짜 댓글을 추가하는 데 사용될 수 있습니다. 이 내용은 임시로 생성된 것이며, 테스트가 완료되면 삭제될 예정입니다. 이 글을 통해 발견되는 모든 문제는 신속하게 해결하여 더 나은 사용자 환경을 구축하겠습니다.",
        photo: null,
        url: null,
        author: "admin_test"
    }
];

// ************************************************
// ✅ UI 개발 모드 플래그 (로그인 상태 무시하고 즉시 렌더링)
// ************************************************
const IS_UI_DEVELOPMENT_MODE = true;
const PAGE_SIZE = 8;

export function Community() {
    const { isLoggedIn, isChecked } = useAuth();
    
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);

    // ************************************************
    // ✅ UI 개발 모드 조건부 렌더링 (인증 로직 건너뛰기)
    // ************************************************
    if (!IS_UI_DEVELOPMENT_MODE) {
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
    }

    useEffect(() => {
        if (IS_UI_DEVELOPMENT_MODE) {
            // 더미 데이터 페이징 시뮬레이션
            const totalElements = DUMMY_POSTS.length;
            const totalPagesCalculated = Math.ceil(totalElements / PAGE_SIZE);
            
            const start = (currentPage - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            
            setPosts(DUMMY_POSTS.slice(start, end));
            setTotalPages(totalPagesCalculated || 1); 
        } else {
            fetchPosts(currentPage);
        }
    }, [currentPage]); // currentPage만 추적하여 무한 루프 방지

    const fetchPosts = async (page) => {
        try {
            const data = await getCommunityPostsApi(page - 1, PAGE_SIZE);
            setPosts(data.posts); 
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('게시글 목록 로드 실패:', error);
        }
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Community</h1>
                
                <CommonBoard
                    posts={posts}
                    isLoading={false}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onItemClick={handlePostClick}
                    showIndex={true}
                />
            </div>

            {/* ✅ PostDetailModal 호출 수정: boardId 대신 post 객체 전달 */}
            <PostDetailModal 
                isOpen={!!selectedPost} // selectedPost가 있으면 true
                onOpenChange={handleCloseModal} // 닫기 핸들러
                post={selectedPost} // 게시글 객체 전체를 전달
            />
        </div>
    );
}
