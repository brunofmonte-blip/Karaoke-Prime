import React from 'react';
import { cn } from '@/lib/utils';

interface AmazonSmileLogoProps {
  className?: string;
}

// A simplified, curved arrow resembling the Amazon Smile/Prime logo
const AmazonSmileLogo: React.FC<AmazonSmileLogoProps> = ({ className }) => {
  return (
    <svg
      className={cn("h-3 w-[120px] text-accent fill-current amazon-gold-glow", className)}
      viewBox="0 0 100 30"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shallow upward curve (Smile) */}
      <path 
        d="M 5 20 C 30 5, 70 5, 95 20" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none"
        strokeLinecap="round"
      />
      {/* Arrowhead at the end (pointing right) */}
      <path 
        d="M 95 20 L 85 15 L 85 25 Z" 
        fill="currentColor"
      />
    </svg>
  );
};

export default AmazonSmileLogo;