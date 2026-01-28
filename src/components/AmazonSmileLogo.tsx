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
      {/* Solid, filled smile/arrow shape */}
      <path 
        d="M 0 15 C 25 0, 75 0, 100 15 L 90 20 C 70 8, 30 8, 10 20 Z" 
        fill="currentColor"
      />
    </svg>
  );
};

export default AmazonSmileLogo;