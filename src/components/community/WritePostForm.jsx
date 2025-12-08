// src/components/community/WritePostForm.jsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CameraIcon, X } from 'lucide-react';
import { toast } from "sonner";
import { createPostApi } from '@/api/community';
import heic2any from 'heic2any';

const WritePostForm = ({ formState, setFormState, onPostSuccess }) => {
  const { title, url, context, photoFile, previewUrl } = formState;

  const update = (key, value) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = async (e) => {
    let file = e.target.files && e.target.files[0];

    if (!file) return;

    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith('.heic');

    if (isHeic) {
      const convertingToast = toast.loading("이미지 포맷 변환 중...");
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });

        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

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
        toast.error("이미지 변환 실패. 다른 이미지를 사용해주세요.");
        return;
      }
    }

    update("photoFile", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      update("previewUrl", reader.result);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleCancelPreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    update("photoFile", null);
    update("previewUrl", null);

    const input = document.getElementById('photo-upload');
    if (input) input.value = '';
  };

  const resetForm = () => {
    setFormState({
      title: "",
      url: "",
      context: "",
      photoFile: null,
      previewUrl: null,
    });

    const input = document.getElementById('photo-upload');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !context.trim()) {
      toast.warning("제목과 내용을 입력해주세요.");
      return;
    }

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
    }
  };

  return (
    <div className="w-full h-full flex flex-col">

      {/* 이미지 업로드 */}
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

      {/* 입력 영역 */}
      <div className="flex flex-col space-y-3 mt-6 flex-grow">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => update("title", e.target.value)}
          className="text-[16px] md:text-sm"
        />

        <Input
          placeholder="URL (선택)"
          value={url}
          onChange={(e) => update("url", e.target.value)}
          className="text-[16px] md:text-sm"
        />

        <Textarea
          placeholder="Context"
          value={context}
          onChange={(e) => update("context", e.target.value)}
          className="resize-none min-h-[200px] max-h-[200px] overflow-y-auto text-[16px] md:text-sm"
        />
      </div>

      {/* 버튼 */}
      <div className="mt-4 flex-none">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full text-sm font-medium"
          style={{ backgroundColor: '#7CCF00' }}
        >
          Write
        </Button>
      </div>
    </div>
  );
};

export default WritePostForm;
