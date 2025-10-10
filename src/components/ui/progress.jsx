// src/components/ui/progress.jsx 파일

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress" 
import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        // 배경색: #F1F5F9로 고정 (채워지지 않은 부분)
        "bg-[#F1F5F9] relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        // ⭐ 수정됨: 채워지는 부분의 색상을 #7AC70C로 고정
        className="bg-[#7AC70C] h-full w-full flex-1 transition-all" 
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </ProgressPrimitive.Root>
  );
}

export { Progress }