import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  isDarkBg?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  completed,
  total,
  isDarkBg = false,
  className
}) => {
  const percentage = Math.round((completed / total) * 100);
  
  const getProgressColor = () => {
    if (percentage <= 33) return 'bg-red-500';
    if (percentage <= 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            getProgressColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className={cn(
          "text-[8px] font-medium",
          isDarkBg ? "text-white/90" : "text-gray-600"
        )}>{`${completed}/${total} tareas`}</span>
        <span className={cn(
          "text-[8px] font-semibold px-1 py-0.5 rounded-full",
          percentage <= 33 ? "bg-red-100 text-red-700" :
          percentage <= 66 ? "bg-yellow-100 text-yellow-700" :
          "bg-green-100 text-green-700",
          "min-w-[2rem] text-center"
        )}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};