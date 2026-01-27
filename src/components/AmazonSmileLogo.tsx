import React from 'react';
import { cn } from '@/lib/utils';

interface AmazonSmileLogoProps {
  className?: string;
}

// A simplified, curved arrow resembling the Amazon Smile/Prime logo
const AmazonSmileLogo: React.FC<AmazonSmileLogoProps> = ({ className }) => {
  return (
    <svg
      className={cn("h-3 w-12 text-accent fill-current", className)}
      viewBox="0 0 100 30"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 0 12px #FF9900)' }}
    >
      {/* Curved line */}
      <path 
        d="M 5 15 C 25 35, 75 35, 95 15" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none"
      />
      {/* Arrowhead at the end */}
      <path 
        d="M 95 15 L 85 10 L 85 20 Z" 
        fill="currentColor"
      />
    </svg>
  );
};

export default AmazonSmileLogo;