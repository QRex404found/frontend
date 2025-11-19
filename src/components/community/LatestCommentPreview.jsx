// 최신 댓글 1개 표시
import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const LatestCommentPreview = ({ comments }) => {

  const latestComment =
    comments && comments.length > 0 ? comments[comments.length - 1] : null;

  return (
    <>
      <Card
        className={cn(
          'mt-4 p-3 cursor-pointer hover:bg-gray-50 transition-colors',
          'shadow-sm border-2 border-transparent hover:border-lime-500',
        )}
      >
        {latestComment ? (
          // 댓글이 있는 경우
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3 truncate">
              {/* 프로필 동그라미 */}
              <div className="flex-shrink-0 w-8 h-8 mt-1 bg-gray-300 rounded-full"></div>

              <div className="flex flex-col min-w-0">
                {/* 사용자 ID */}
                <p className="text-sm font-medium text-gray-800 truncate">
                  {latestComment.userId || '익명'}
                </p>
                {/* 댓글 내용 */}
                <p className="text-xs text-gray-500 truncate">
                  {latestComment.contents}
                </p>
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 ml-2 text-gray-400 shrink-0" />
          </div>
        ) : (
          // 댓글이 없는 경우
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-sm">Add a comment...</span>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </Card>
    </>
  );
};