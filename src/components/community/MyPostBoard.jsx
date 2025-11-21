// src/components/community/MyPostBoard.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import { CommonBoard } from "@/components/common/CommonBoard";

export default function MyPostBoard({
  isDeleting,
  toggleDeleteMode,
  myPosts,
  isLoading,
  currentPage,
  totalPages,
  setCurrentPage,
  openDetail,
  selectedPosts,
  toggleSelect,
  showEmpty,
  rowHeightClass = "h-12",
}) {
  return (
    <div className="w-full px-2 md:px-4 py-2 flex flex-col">
      
      {/* Delete / Submit 버튼 */}
      <div className="flex justify-end mb-3">
        <Button
          onClick={toggleDeleteMode}
          variant={isDeleting ? "default" : "outline"}
          disabled={!isDeleting && (myPosts.length === 0 || isLoading)}
          className={`
            w-[80px] text-sm font-medium
            ${
              isDeleting
                ? "bg-[#7CCF00] text-white border-[#7CCF00] hover:bg-[#6AC600]"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }
            ${
              !isDeleting && myPosts.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          `}
        >
          {isDeleting ? "Submit" : "Delete"}
        </Button>
      </div>

      {/* 게시판 영역 */}
      {!showEmpty ? (
        <CommonBoard
          posts={myPosts}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onItemClick={openDetail}
          isDeleting={isDeleting}
          selectedPosts={selectedPosts}
          onCheckboxChange={toggleSelect}
          rowHeightClass={rowHeightClass}
        />
      ) : (
        <div className="py-10 text-center text-gray-500">
          등록된 게시물이 없습니다.
        </div>
      )}
    </div>
  );
}
