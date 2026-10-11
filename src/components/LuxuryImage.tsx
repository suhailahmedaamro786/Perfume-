import React, { useState } from 'react';

interface LuxuryImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
  label?: string;
}

/**
 * Resilient luxury image component with SVG bottle silhouette fallback
 * so no broken image frame ever appears.
 */
export const LuxuryImage: React.FC<LuxuryImageProps> = ({
  src,
  alt,
  className = '',
  aspectClassName = 'aspect-[4/3]',
  priority = false,
  label,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#141414] ${aspectClassName}`}
    >
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#171717] via-[#221F17] to-[#121212]"
        />
      )}

      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#171717] to-[#0B0B0B] p-6 text-center">
          <svg
            viewBox="0 0 64 80"
            fill="none"
            className="mb-3 h-14 w-14 text-[#D4AF37]/70"
            aria-hidden="true"
          >
            <rect x="24" y="6" width="16" height="10" stroke="currentColor" strokeWidth="1.5" />
            <rect x="27" y="16" width="10" height="6" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M16 28C16 24.6863 18.6863 22 22 22H42C45.3137 22 48 24.6863 48 28V68C48 70.2091 46.2091 72 44 72H20C17.7909 72 16 70.2091 16 68V28Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect x="22" y="36" width="20" height="18" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="font-serif-display text-sm tracking-wide text-[#F1D27A]">
            {label || alt}
          </span>
          <span className="mt-0.5 text-[11px] text-[#A39E93]">SK PERFUMES</span>
        </div>
      )}
    </div>
  );
};
