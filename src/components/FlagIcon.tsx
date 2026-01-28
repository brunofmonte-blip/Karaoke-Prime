import React from 'react';
import { cn } from '@/lib/utils';

interface FlagIconProps {
  countryCode: 'IT' | 'PL' | 'FR' | 'US' | 'RU';
  className?: string;
}

const flagColors: Record<string, string[]> = {
  IT: ['bg-green-600', 'bg-white', 'bg-red-600'], // Italy
  PL: ['bg-white', 'bg-red-600'], // Poland
  FR: ['bg-blue-700', 'bg-white', 'bg-red-700'], // France
  US: ['bg-blue-700', 'bg-red-700', 'bg-white'], // Placeholder for US colors
  RU: ['bg-white', 'bg-blue-700', 'bg-red-700'], // Russia
};

const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, className }) => {
  const colors = flagColors[countryCode] || ['bg-gray-500'];
  
  return (
    <div className={cn("flex h-3 w-4 overflow-hidden rounded-[1px] shadow-md", className)}>
      {colors.map((colorClass, index) => (
        <div key={index} className={cn("h-full", colorClass)} style={{ flex: colors.length === 2 ? 1 : 1 }}></div>
      ))}
    </div>
  );
};

export default FlagIcon;