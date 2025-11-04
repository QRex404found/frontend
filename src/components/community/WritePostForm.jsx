// 게시글 작성 폼
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createPostApi } from '@/api/community'; // 게시글 등록 API
import { CameraIcon } from 'lucide-react';

/**
 * 게시글 작성 폼
 * @param {function} onPostSuccess - 게시글 등록 성공 시 호출할 함수 (목록 갱신 등)
 */
const WritePostForm = ({ onPostSuccess }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [context, setContext] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setPhotoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !context.trim()) {
            alert("제목과 내용은 필수 입력 사항입니다.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();

        // 🌟 [수정] 키 이름을 백엔드 DTO(BoardCreateRequest)와 일치시킵니다.
        formData.append('postTitle', title);       // 👈 'title' -> 'postTitle'
        formData.append('postContents', context);  // 👈 'context' -> 'postContents'
        formData.append('url', url);               // 👈 'url'은 DTO와 일치

        if (photoFile) {
            // ❗️ [참고] 'photoFile'이라는 이름으로 파일을 보냅니다.
            // 백엔드 컨트롤러는 이 'photoFile'을 @RequestPart("photoFile") MultipartFile photoFile 로 받아야 합니다.
            // (만약 DTO의 imagePath만 사용한다면, 파일 업로드는 별도 로직이 필요합니다)
            formData.append('photoFile', photoFile);
        }

        try {
            await createPostApi(formData); 
            alert('게시글 등록 성공!');
            // 폼 초기화
            setTitle('');
            setUrl('');
            setContext('');
            setPhotoFile(null);
            document.getElementById('photo-upload').value = ''; 
            
            if(onPostSuccess) onPostSuccess();
        } catch (error) {
            console.error("게시글 등록 실패:", error);
            // 🌟 [수정] 백엔드에서 보낸 오류 메시지를 우선적으로 표시합니다.
            const errorMessage = error.response?.data || '게시글 등록에 실패했습니다. 다시 시도해주세요.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* 1. PHOTO */}
                    <div className="space-y-2">
                        <div className="flex flex-col items-center space-y-2">
                            <label 
                                htmlFor="photo-upload" 
                                className="w-48 h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                            >
                                <CameraIcon className="w-6 h-6 text-gray-500" />
                                <span className="text-sm text-gray-500 mt-1">PHOTO</span>
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {photoFile && <span className="text-sm truncate max-w-[200px]">{photoFile.name}</span>}
                        </div>
                    </div>

                    {/* 2. TITLE */}
                    <div className="space-y-1">
                        <Input 
                            id="title" 
                            placeholder="TITLE" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                        />
                    </div>
                    
                    {/* 3. URL */}
                    <div className="space-y-1">
                        <Input 
                            id="url" 
                            placeholder="URL" 
                            value={url} 
                            onChange={(e) => setUrl(e.target.value)} 
                        />
                    </div>

                    {/* 4. CONTEXT */}
                    <div className="space-y-1">
                        <Textarea 
                            id="context" 
                            placeholder="CONTEXT" 
                            value={context} 
                            onChange={(e) => setContext(e.target.value)} 
                            className="resize-none h-80"
                        />
                    </div>

                    {/* Write 버튼 */}
                    <Button 
                        type="submit" 
                        className="w-full mt-6" 
                        disabled={isLoading}
                        style={{ backgroundColor: '#8EE000' }} 
                    >
                        {isLoading ? '등록 중...' : 'Write'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default WritePostForm;