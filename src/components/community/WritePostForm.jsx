// src/components/community/WritePostForm.jsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { createPostApi } from '@/api/community';
import { CameraIcon, X } from 'lucide-react';
import { toast } from "sonner";

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
    };

    const handleCancelPreview = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPhotoFile(null);
        setPreviewUrl(null);
        document.getElementById('photo-upload').value = '';
    };

    const resetForm = () => {
        setTitle('');
        setUrl('');
        setContext('');
        setPhotoFile(null);
        setPreviewUrl(null);
        document.getElementById('photo-upload').value = '';
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
        <Card className="w-full min-h-[500px]">
            <CardContent className="pt-6">
                {/* ✅ 간격은 space-y-3 유지 */}
                <form onSubmit={handleSubmit} className="space-y-3">

                    {/* ✅ PHOTO (중간 크기: w-44 h-40) */}
                    <div className="flex flex-col items-center">
                        <label
                            htmlFor="photo-upload"
                            className="relative flex flex-col items-center justify-center w-44 h-40 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition"
                        >
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="미리보기" className="object-cover w-full h-full rounded-md" />
                                    <button
                                        onClick={handleCancelPreview}
                                        className="absolute top-1 right-1 p-0.5 bg-gray-900 bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <CameraIcon className="w-6 h-6 text-gray-500" />
                                    <span className="mt-1 text-sm text-gray-500">PHOTO</span>
                                </>
                            )}
                        </label>

                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {previewUrl && photoFile && (
                            <span className="text-xs truncate max-w-[200px] mt-1">{photoFile.name}</span>
                        )}
                    </div>

                    {/* TITLE */}
                    <Input
                        placeholder="TITLE"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-sm"
                    />

                    {/* URL */}
                    <Input
                        placeholder="URL (선택)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="text-sm"
                    />

                    {/* CONTEXT (적절히 줄인 높이 유지) */}
                    <Textarea
                        placeholder="CONTEXT"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="resize-none h-28 text-sm"
                    />

                    {/* ✅ 버튼 위 간격 유지 */}
                    <Button
                        type="submit"
                        className="w-full mt-2 text-sm font-medium"
                        style={{ backgroundColor: '#7CCF00' }}
                        disabled={isLoading}
                    >
                        {isLoading ? '등록 중...' : 'Write'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default WritePostForm;
