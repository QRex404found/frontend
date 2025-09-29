// src/api/auth.js

import { getToken } from '../utils/tokenUtils';

/**
 * 1. 로그인 API (더미)
 * @param {object} credentials - { id, password }
 */
export function loginApi(credentials) {
    console.log("로그인 API 호출 (더미):", credentials);
    return Promise.resolve({ 
        success: true, 
        token: "dummy_token",
        user: { id: credentials.id, name: "홍길동" }
    });
}

/**
 * 2. ID 중복 확인 API (더미)
 * @param {string} id
 * @returns {Promise<object>}
 */
export function checkIdApi(id) {
    console.log("ID 중복 확인 API 호출 (더미):", id);
    return new Promise(resolve => {
        setTimeout(() => {
            const isAvailable = id !== 'testuser'; // "testuser"라는 ID만 사용 불가능하게 시뮬레이션
            resolve({ isAvailable });
        }, 300);
    });
}

/**
 * 3. 회원가입 API (더미)
 * @param {object} userData
 * @returns {Promise<object>}
 */
export function signupApi(userData) {
    console.log("회원가입 API 호출 (더미):", userData);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: "회원가입 성공!" });
        }, 500);
    });
}

/**
 * 4. 프로필 수정 API (더미)
 */
export function updateProfileApi(profileData) {
    console.log("프로필 수정 API 호출 (더미):", profileData);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: "프로필이 성공적으로 수정되었습니다." });
        }, 500);
    });
}

/**
 * 5. 회원 탈퇴 API (더미)
 */
export function deleteAccountApi() {
    console.log("회원 탈퇴 API 호출 (더미)");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: "계정이 삭제되었습니다." });
        }, 500);
    });
}