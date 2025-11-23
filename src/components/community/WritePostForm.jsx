// src/components/community/WritePostForm.jsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CameraIcon, X } from 'lucide-react';
import { toast } from "sonner";
import { createPostApi } from '@/api/community';
// ✅ [추가됨] HEIC 변환을 위한 라이브러리 import
import heic2any from 'heic2any'; 

const WritePostForm = ({ onPostSuccess }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [context, setContext] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    // ✅ [수정됨] async 키워드 추가 및 HEIC 변환 로직 적용
    const handleFileChange = async (e) => {
        let file = e.target.files && e.target.files[0];

        if (!file) return;

        // 1. HEIC 파일인지 확인 (MIME 타입 또는 확장자 확인)
        const isHeic = 
            file.type === "image/heic" || 
            file.type === "image/heif" || 
            file.name.toLowerCase().endsWith('.heic');

        if (isHeic) {
            // 변환 중임을 알리는 토스트 (선택 사항)
            const convertingToast = toast.loading("이미지 포맷 변환 중...");

            try {
                // 2. heic2any를 사용하여 JPG로 변환
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.8, // 화질 설정 (0 ~ 1)
                });

                // heic2any가 배열을 반환하는 경우 대비 (단일 이미지 처리)
                const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

                // 3. 변환된 Blob을 다시 File 객체로 생성 (확장자 .jpg로 변경)
                file = new File(
                    [finalBlob], 
                    file.name.replace(/\.(heic|heif)$/i, ".jpg"), 
                    { type: "image/jpeg", lastModified: new Date().getTime() }
                );

                toast.dismiss(convertingToast);
                toast.success("이미지 변환 완료!");

            } catch (error) {
                console.error("HEIC 변환 실패:", error);
                toast.dismiss(convertingToast);
                toast.error("이미지 변환에 실패했습니다. 다른 이미지를 사용해주세요.");
                return;
            }
        }

        // 4. (변환된 혹은 원래의) 파일을 state에 저장
        setPhotoFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // 동일 파일 다시 선택해도 onChange가 다시 호출되도록 초기화
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
        if (photoFile) {
            formData.append('photoFile', photoFile);
        }

        try {
            await createPostApi(formData);
            toast.success("게시글이 등록되었습니다!");
            resetForm();
            onPostSuccess?.();
        } catch (err) {
            toast.error("게시글 등록 실패");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col">

            {/* PHOTO 영역 */}
            <div className="flex flex-col items-center justify-center flex-none relative">
                <label
                    className="
                        relative flex flex-col items-center justify-center
                        w-48 h-44 border-2 border-dashed rounded-md cursor-pointer
                        hover:bg-gray-50 transition z-10
                    "
                    style={{ overflow: 'hidden' }}
                >
                    {previewUrl ? (
                        <>
                            <img
                                src={previewUrl}
                                alt="미리보기"
                                className="object-cover w-full h-full rounded-md pointer-events-none"
                            />
                            <button
                                onClick={handleCancelPreview}
                                className="absolute top-1 right-1 p-0.5 bg-gray-900 bg-opacity-50 text-white rounded-full hover:bg-opacity-75 z-20"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <>
                            <CameraIcon className="w-7 h-7 text-gray-500 pointer-events-none" />
                            <span className="mt-1 text-sm text-gray-500 pointer-events-none">
                                Photo(선택)
                            </span>
                        </>
                    )}

                    {/* input을 label 안으로 넣고, 전체를 투명하게 덮게 함 */}
                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </label>

                {previewUrl && photoFile && (
                    <span className="text-xs truncate max-w-[200px] mt-1">
                        {photoFile.name}
                    </span>
                )}
            </div>

            {/* INPUT + CONTEXT 영역 */}
            <div className="flex flex-col space-y-3 mt-6 flex-grow">
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base md:text-sm"
                />

                <Input
                    placeholder="URL (선택)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-base md:text-sm"
                />

                <Textarea
                    placeholder="Context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="
                        resize-none 
                        min-h-[200px]
                        max-h-[200px]
                        overflow-y-auto
                        text-base md:text-sm
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