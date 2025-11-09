// src/components/community/WritePostForm.jsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { createPostApi } from '@/api/community';
import { CameraIcon, X } from 'lucide-react';
import { toast } from "sonner"; // ✅ 추가

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
            toast.success("게시글이 등록되었습니다! ");
            resetForm();
            onPostSuccess?.();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                '게시글 등록에 실패했습니다. 다시 시도해주세요.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* PHOTO */}
                    <div className="space-y-2">
                        <div className="flex flex-col items-center space-y-2">
                            <label
                                htmlFor="photo-upload"
                                className="relative flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
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
                                <span className="text-sm truncate max-w-[200px]">{photoFile.name}</span>
                            )}
                        </div>
                    </div>

                    {/* TITLE */}
                    <Input
                        id="title"
                        placeholder="TITLE"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* URL */}
                    <Input
                        id="url"
                        placeholder="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    {/* CONTEXT */}
                    <Textarea
                        id="context"
                        placeholder="CONTEXT"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="px-2 break-all resize-none h-33"
                    />

                    <Button
                        type="submit"
                        className="w-full mt-6"
                        disabled={isLoading}
                        style={{ backgroundColor: '#7CCF00' }}
                    >
                        {isLoading ? '등록 중...' : 'Write'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default WritePostForm;
