import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  children?: React.ReactNode;
}

/**
 * Skeleton loading component for better loading experience
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
  children,
}) => {
  const skeletonClasses = `
    bg-gray-200 rounded-md
    ${animation === 'pulse' ? 'animate-pulse' : ''}
    ${animation === 'wave' ? 'animate-shimmer' : ''}
    ${className}
  `;

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || '1.2em',
  };

  const baseClasses = variant === 'circular' 
    ? 'rounded-full' 
    : variant === 'text' 
    ? 'rounded' 
    : 'rounded-md';

  if (children) {
    return (
      <div className="relative overflow-hidden">
        <div 
          className={`${skeletonClasses} ${baseClasses}`}
          style={style}
        />
        <div className="invisible">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${skeletonClasses} ${baseClasses}`}
      style={style}
    />
  );
};

/**
 * Table skeleton component
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}> = ({ 
  rows = 5, 
  columns = 4, 
  showHeader = true 
}) => {
  return (
    <div className="w-full">
      {showHeader && (
        <div className="border-b border-gray-200 pb-3 mb-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={`header-${index}`} height={40} variant="text" />
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={`row-${rowIndex}`}
            className="border border-gray-100 rounded-lg p-4"
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={`cell-${rowIndex}-${colIndex}`} 
                  height={32} 
                  variant="text" 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Card skeleton component
 */
export const CardSkeleton: React.FC<{
  showAvatar?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showContent?: boolean;
  lines?: number;
}> = ({ 
  showAvatar = false,
  showTitle = true,
  showSubtitle = true,
  showContent = true,
  lines = 3 
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton width={48} height={48} variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={20} variant="text" />
            <Skeleton width="40%" height={16} variant="text" />
          </div>
        </div>
      )}
      
      {showTitle && (
        <Skeleton width="80%" height={24} className="mb-2" />
      )}
      
      {showSubtitle && (
        <Skeleton width="60%" height={16} className="mb-4" />
      )}
      
      {showContent && (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton 
              key={`line-${index}`} 
              width={index === lines - 1 ? '80%' : '100%'} 
              height={16} 
              variant="text" 
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Form skeleton component
 */
export const FormSkeleton: React.FC<{
  fieldCount?: number;
  showButton?: boolean;
}> = ({ fieldCount = 4, showButton = true }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div key={`field-${index}`} className="space-y-2">
            <Skeleton width="30%" height={16} variant="text" />
            <Skeleton height={44} className="w-full" />
          </div>
        ))}
      </div>
      
      {showButton && (
        <Skeleton width={120} height={44} className="rounded-lg" />
      )}
    </div>
  );
};

/**
 * List skeleton component
 */
export const ListSkeleton: React.FC<{
  items?: number;
  showAvatar?: boolean;
  avatarSize?: number;
  showTitle?: boolean;
  showSubtitle?: boolean;
}> = ({ 
  items = 5,
  showAvatar = false,
  avatarSize = 40,
  showTitle = true,
  showSubtitle = true 
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div 
          key={`item-${index}`} 
          className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg"
        >
          {showAvatar && (
            <Skeleton 
              width={avatarSize} 
              height={avatarSize} 
              variant="circular" 
            />
          )}
          
          <div className="flex-1 space-y-2">
            {showTitle && (
              <Skeleton width="60%" height={16} variant="text" />
            )}
            {showSubtitle && (
              <Skeleton width="40%" height={14} variant="text" />
            )}
          </div>
          
          <Skeleton width={24} height={24} variant="rectangular" />
        </div>
      ))}
    </div>
  );
};

/**
 * Loading overlay component
 */
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
  spinnerSize?: 'small' | 'medium' | 'large';
  backdrop?: boolean;
}> = ({ 
  isVisible, 
  message = 'Cargando...', 
  spinnerSize = 'medium',
  backdrop = true 
}) => {
  if (!isVisible) return null;

  const spinnerSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${backdrop ? 'bg-black/50 backdrop-blur-sm' : ''}
      `}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center space-y-3">
        <div className={`${spinnerSizeClasses[spinnerSize]} border-2 border-indigo-600 border-t-transparent rounded-full animate-spin`} />
        {message && (
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Page loading skeleton
 */
export const PageSkeleton: React.FC<{
  type?: 'dashboard' | 'table' | 'form' | 'cards';
}> = ({ type = 'table' }) => {
  const skeletons = {
    dashboard: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={`stat-${index}`} showAvatar={false} lines={2} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton lines={4} />
          <CardSkeleton lines={4} />
        </div>
      </div>
    ),
    table: () => <TableSkeleton rows={8} columns={6} />,
    form: () => <FormSkeleton fieldCount={6} />,
    cards: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={`card-${index}`} />
        ))}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton width={300} height={32} className="mb-2" />
          <Skeleton width={500} height={16} />
        </div>
        {skeletons[type]()}
      </div>
    </div>
  );
};

/**
 * Custom shimmer animation CSS - add to your global CSS
 */
export const shimmerCSS = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
`;