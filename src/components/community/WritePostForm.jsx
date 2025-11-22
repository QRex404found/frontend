// src/components/community/WritePostForm.jsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CameraIcon, X } from 'lucide-react';
import { toast } from "sonner";
import { createPostApi } from '@/api/community';

const WritePostForm = ({ onPostSuccess }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [context, setContext] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
        // [수정] 모바일/PC에서 동일 파일 재선택 및 이벤트 트리거 보장을 위해 초기화
        e.target.value = ''; 
    };

    const handleCancelPreview = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPhotoFile(null);
        setPreviewUrl(null);
        const input = document.getElementById('photo-upload');
        if (input) input.value = '';
    };

    const resetForm = () => {
        setTitle('');
        setUrl('');
        setContext('');
        setPhotoFile(null);
        setPreviewUrl(null);
        const input = document.getElementById('photo-upload');
        if (input) input.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !context.trim()) {
            toast.warning("제목과 내용은 반드시 입력해야 합니다.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('postTitle', title);
        formData.append('postContents', context);
        formData.append('url', url);
        if (photoFile) formData.append('photoFile', photoFile);

        try {
            await createPostApi(formData);
            toast.success("게시글이 등록되었습니다!");
            resetForm();
            onPostSuccess?.();
        } catch {
            toast.error("게시글 등록 실패");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">

            {/* PHOTO 영역 */}
            {/* [수정] relative 추가하여 내부의 absolute input이 영역 밖으로 튀지 않게 함 */}
            <div className="flex flex-col items-center justify-center flex-none relative">
                <label
                    htmlFor="photo-upload"
                    className="
                        relative flex flex-col items-center justify-center
                        w-48 h-44 border-2 border-dashed rounded-md cursor-pointer
                        hover:bg-gray-50 transition z-10
                    "
                >
                    {previewUrl ? (
                        <>
                            <img
                                src={previewUrl}
                                alt="미리보기"
                                className="object-cover w-full h-full rounded-md"
                            />
                            <button
                                onClick={handleCancelPreview}
                                className="absolute top-1 right-1 p-0.5 bg-gray-900 bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <>
                            <CameraIcon className="w-7 h-7 text-gray-500" />
                            <span className="mt-1 text-sm text-gray-500">Photo(선택)</span>
                        </>
                    )}
                </label>

                {/* [수정] hidden 클래스 제거 
                    대신 absolute, opacity-0, w-0, h-0을 사용하여 
                    '보이지 않지만 존재하는' 상태로 만듦 (모바일 버그 해결 핵심)
                */}
                <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute opacity-0 w-0 h-0 overflow-hidden"
                />

                {previewUrl && photoFile && (
                    <span className="text-xs truncate max-w-[200px] mt-1">{photoFile.name}</span>
                )}
            </div>

            {/* INPUT + CONTEXT 영역 */}
            <div className="flex flex-col space-y-3 mt-6 flex-grow">

                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-sm"
                />

                <Input
                    placeholder="URL (선택)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-sm"
                />

                {/* 스크롤 가능 Textarea (높이 고정 + 내용 많으면 스크롤) */}
                <Textarea
                    placeholder="Context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="
                        resize-none 
                        min-h-[200px]
                        max-h-[200px]
                        overflow-y-auto
                        text-sm
                    "
                />
            </div>

            {/* BUTTON 영역 */}
            <div className="mt-4 flex-none">
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full text-sm font-medium"
                    style={{ backgroundColor: '#7CCF00' }}
                    disabled={isLoading}
                >
                    {isLoading ? '등록 중...' : 'Write'}
                </Button>
            </div>

        </div>
    );
};

export default WritePostForm;