// 커뮤니티 게시글, 댓글 관련 API (더미 응답 버전)

// NOTE: 이 파일은 백엔드 개발 전 프론트엔드 UI 테스트를 위해 더미 데이터를 반환합니다.

import { getToken } from '../utils/tokenUtils';

// --- 더미 데이터 정의 ---
const DUMMY_USER_ID = 'testuser123';
let DUMMY_POST_ID_COUNTER = 11;

let DUMMY_POSTS = [
    { id: 1, title: "QR 코드 오해를 풀어봅시다", context: "최근 QR 코드 스캔 시 피싱 위험에 대한 오해가 많습니다. 출처를 잘 확인하면 대부분 안전합니다.", url: "https://safeurl.com/a", photo: null, author: "운영자", authorId: "admin", date: "2025-09-29", viewCount: 150, commentCount: 5 },
    { id: 2, title: "스마트폰으로 QR 스캔이 안돼요", context: "카메라 설정에서 QR 코드 인식이 켜져 있는지 확인해보세요.", url: null, photo: null, author: "김사용", authorId: "testuser123", date: "2025-09-28", viewCount: 30, commentCount: 2 },
    { id: 3, title: "QR 코드가 이상하게 생겼습니다", context: "픽셀이 깨진 것처럼 보이는 QR 코드는 조심해야 합니다.", url: "https://badurl.com/z", photo: null, author: "박지성", authorId: "user456", date: "2025-09-27", viewCount: 88, commentCount: 0 },
    // 내 게시글 테스트를 위해 더 추가
    { id: 10, title: "더미: 내가 작성한 최신글", context: "이 글은 MyPost 페이지 테스트용입니다.", url: null, photo: null, author: "김사용", authorId: "testuser123", date: "2025-09-30", viewCount: 5, commentCount: 1 },
];

let DUMMY_COMMENTS = {
    1: [
        { id: 101, postId: 1, author: "익명1", authorId: "anon1", content: "좋은 정보 감사합니다!", date: "2025-09-29" },
        { id: 102, postId: 1, author: "운영자", authorId: "admin", content: "더 궁금한 점은 댓글로 문의해주세요.", date: "2025-09-30" },
    ],
    2: [
        { id: 201, postId: 2, author: "김사용", authorId: "testuser123", content: "설정 확인해보니 되네요, 감사합니다!", date: "2025-09-28" },
    ],
    10: [
        { id: 301, postId: 10, author: "익명10", authorId: "anon10", content: "게시글 잘 봤습니다.", date: "2025-09-30" },
    ]
};

const PAGE_SIZE = 10;
const DELAY = 500; // 0.5초 지연 시뮬레이션

// --- 유틸리티 함수 (더미 환경에서는 인증 헤더 사용 안 함) ---

const getCurrentUserId = () => DUMMY_USER_ID; 
// getToken 함수는 실제 환경을 위해 남겨두되, 더미에서는 사용하지 않음
// const getAuthHeaders = (contentType = 'application/json') => { ... }; 

// --- 게시글 조회/관리 ---

/**
 * 1. 모든 게시글 목록 조회 (더미)
 */
export const getCommunityPostsApi = async (page = 0, size = PAGE_SIZE) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const start = page * size;
            const end = start + size;
            const content = DUMMY_POSTS.slice(start, end);

            resolve({ 
                content,
                pageable: { pageNumber: page, pageSize: size, totalPages: Math.ceil(DUMMY_POSTS.length / size), totalElements: DUMMY_POSTS.length }
            });
        }, DELAY);
    });
};

/**
 * 2. 내가 작성한 게시글 목록 조회 (더미)
 */
export const getMyPostsApi = async (page = 0, size = PAGE_SIZE) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const userId = getCurrentUserId();
            const myPosts = DUMMY_POSTS.filter(p => p.authorId === userId);
            const start = page * size;
            const end = start + size;
            const content = myPosts.slice(start, end);

            resolve({
                content,
                pageable: { pageNumber: page, pageSize: size, totalPages: Math.ceil(myPosts.length / size), totalElements: myPosts.length }
            });
        }, DELAY);
    }); 
};

/**
 * 3. 특정 게시글 상세 조회 (더미)
 */
export const getPostDetailApi = async (boardId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const post = DUMMY_POSTS.find(p => p.id === boardId);
            if (post) {
                // 조회수 증가 시뮬레이션
                post.viewCount += 1;
                resolve(post);
            } else {
                reject(new Error(`게시글 ID ${boardId}를 찾을 수 없습니다.`));
            }
        }, DELAY);
    }); 
};

/**
 * 4. 새 게시글 작성 (더미)
 */
export const createPostApi = async (postData) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newPost = {
                id: DUMMY_POST_ID_COUNTER++,
                author: "김사용", 
                authorId: getCurrentUserId(),
                date: new Date().toISOString().slice(0, 10),
                viewCount: 0,
                commentCount: 0,
                ...postData
            };
            DUMMY_POSTS.unshift(newPost); // 맨 앞에 추가
            resolve(newPost);
        }, DELAY);
    });
};

/**
 * 5. 게시글 삭제 (더미)
 */
export const deletePostApi = async (boardId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = DUMMY_POSTS.length;
            DUMMY_POSTS = DUMMY_POSTS.filter(p => p.id !== boardId);
            delete DUMMY_COMMENTS[boardId]; // 관련 댓글 삭제
            
            if (DUMMY_POSTS.length < initialLength) {
                resolve({ success: true });
            } else {
                reject(new Error("삭제할 게시글을 찾을 수 없습니다."));
            }
        }, DELAY);
    });
};

// --- 댓글 조회/관리 ---

/**
 * 6. 댓글 목록 조회 (더미)
 */
export const getCommentsApi = async (boardId) => {
    return new Promise(resolve => {
        setTimeout(() => {
            // 더미 데이터의 깊은 복사본을 반환
            const comments = JSON.parse(JSON.stringify(DUMMY_COMMENTS[boardId] || []));
            resolve(comments);
        }, DELAY);
    });
};


/**
 * 7. 댓글 추가 (더미)
 */
export const addCommentApi = async (boardId, commentContent) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const post = DUMMY_POSTS.find(p => p.id === boardId);
            if (post) post.commentCount += 1;

            const newComment = {
                id: Math.floor(Math.random() * 1000) + 500,
                postId: boardId,
                author: "김사용",
                authorId: getCurrentUserId(),
                content: commentContent,
                date: new Date().toISOString().slice(0, 10),
            };
            if (!DUMMY_COMMENTS[boardId]) {
                DUMMY_COMMENTS[boardId] = [];
            }
            DUMMY_COMMENTS[boardId].push(newComment);
            resolve(newComment);
        }, DELAY);
    });
};

/**
 * 8. 댓글 삭제 (더미)
 */
export const deleteCommentApi = async (commentId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let deleted = false;
            for (const postId in DUMMY_COMMENTS) {
                const initialLength = DUMMY_COMMENTS[postId].length;
                DUMMY_COMMENTS[postId] = DUMMY_COMMENTS[postId].filter(c => c.id !== commentId);
                
                if (DUMMY_COMMENTS[postId].length < initialLength) {
                    deleted = true;
                    const post = DUMMY_POSTS.find(p => p.id === parseInt(postId));
                    if(post) post.commentCount -= 1;
                    break;
                }
            }

            if (deleted) {
                resolve({ success: true });
            } else {
                reject(new Error("삭제할 댓글을 찾을 수 없습니다."));
            }
        }, DELAY);
    });
};

// --- 신고 기능 ---

/**
 * 9. 게시글 신고 (더미)
 */
export const reportPostApi = async (boardId) => {
    console.log(`게시글 ${boardId} 신고 시뮬레이션 (더미)`);
    return new Promise(resolve => {
        setTimeout(() => {
            // 신고 성공 가정
            resolve({ success: true, message: "게시글이 신고되었습니다." });
        }, DELAY);
    });
};

/**
 * 10. 댓글 신고 (더미)
 */
export const reportCommentApi = async (commentId) => {
    console.log(`댓글 ${commentId} 신고 시뮬레이션 (더미)`);
    return new Promise(resolve => {
        setTimeout(() => {
            // 신고 성공 가정
            resolve({ success: true, message: "댓글이 신고되었습니다." });
        }, DELAY);
    });
};
