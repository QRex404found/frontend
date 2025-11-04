import apiClient from './index';
import { setToken, removeToken } from '../utils/tokenUtils';

// ==========================================================
// 1. 로그인 API
// ==========================================================
export async function loginApi(credentials) {
  try {
    const response = await apiClient.post('/api/auth/login', {
      userId: credentials.userId,
      password: credentials.password,
    });

    const token = response.data.token;
    setToken(token);

    return { success: true, token: token };
  } catch (error) {
    console.error('로그인 API 오류:', error.response);
    const errorMessage = error.response?.data || '로그인에 실패했습니다.';
    throw new Error(errorMessage);
  }
}

// ==========================================================
// 2. ID 중복 확인 API
// ==========================================================
export async function checkIdApi(userId) {
  try {
    const response = await apiClient.post('/api/auth/check-id', { userId });
    return response.data.isAvailable;
  } catch (error) {
    console.error('ID 중복 확인 API 오류:', error.response);
    return false;
  }
}

// ==========================================================
// 3. 회원가입 API
// ==========================================================
export const signupApi = async (signupData) => {
  try {
    const response = await apiClient.post('/api/auth/signup', {
      userId: signupData.userId,
      userName: signupData.userName,
      userPw: signupData.userPw,
      phone: signupData.phone || null,
    });
    console.log('회원가입 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('회원가입 API 오류:', error.response);
    throw new Error(error.response?.data || '회원가입 실패');
  }
};

// ==========================================================
// 4. 프로필 수정 API
// ==========================================================
export async function updateProfileApi(profileData) {
  try {
    const response = await apiClient.put('/api/auth/profile', {
      newName: profileData.newName,
      newPassword: profileData.newPassword,
      verifyPassword: profileData.verifyPassword,
    });
    return { success: true, message: response.data };
  } catch (error) {
    console.error('프로필 수정 API 오류:', error.response);
    const errorMessage = error.response?.data || '프로필 수정에 실패했습니다.';
    throw new Error(errorMessage);
  }
}

// ==========================================================
// 5. 회원 탈퇴 API
// ==========================================================
export async function deleteAccountApi() {
  try {
    const response = await apiClient.delete('/api/auth/profile');
    removeToken();
    return { success: true, message: response.data };
  } catch (error) {
    console.error('회원 탈퇴 API 오류:', error.response);
    const errorMessage = error.response?.data || '회원 탈퇴에 실패했습니다.';
    throw new Error(errorMessage);
  }
}
