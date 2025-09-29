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
        // FormData는 파일과 텍스트를 함께 보낼 때 유용합니다.
        const formData = new FormData();
        formData.append('title', title);
        formData.append('context', context);
        formData.append('url', url);
        if (photoFile) {
            formData.append('photo', photoFile);
        }

        try {
            // [수정] API 호출 함수 이름을 import한 이름과 일치시켰습니다.
            await createPostApi(formData); 
            alert('게시글 등록 성공!');
            // 폼 초기화
            setTitle('');
            setUrl('');
            setContext('');
            setPhotoFile(null);
            document.getElementById('photo-upload').value = ''; // 파일 입력 필드 초기화
            
            if(onPostSuccess) onPostSuccess(); // 부모 컴포넌트에 성공 알림
        } catch (error) {
            console.error("게시글 등록 실패:", error);
            alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
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
                            // 높이를 h-[500px]에서 h-80 (약 320px)로 줄였습니다.
                            className="resize-none h-80" // 🚀 [최종 수정] 높이를 **h-80**으로 줄였습니다.
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