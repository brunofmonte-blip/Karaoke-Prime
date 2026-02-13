import React from "react";
import { User, Headphones } from "lucide-react";

export default function InstructorAvatar() {
  return (
    <div className="relative w-48 h-64 flex flex-col items-center justify-center animate-in fade-in duration-1000">
      {/* Studio Specialist Visual Model */}
      <div className="relative w-32 h-40 flex flex-col items-center">
        
        {/* Head */}
        <div className="w-16 h-16 rounded-full bg-[#f3f4f6] border-2 border-gray-300 relative z-10 overflow-hidden shadow-inner">
          <div className="absolute top-0 left-0 right-0 h-4 bg-[#9ca3af] rounded-t-full" />
          <div className="absolute inset-0 flex items-center justify-center pt-2">
            <User className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        
        {/* Professional Studio Headphones */}
        <div className="absolute top-[-4px] z-20 flex justify-between w-20">
          <div className="h-8 w-3 bg-[#111827] rounded-l-lg shadow-lg" />
          <div className="h-8 w-3 bg-[#111827] rounded-r-lg shadow-lg" />
          <Headphones className="absolute top-[-8px] left-1/2 -translate-x-1/2 h-20 w-20 text-yellow-500/60 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
        </div>
        
        {/* Body: Dark Blazer */}
        <div className="w-28 h-28 bg-[#1f2937] rounded-t-[40px] mt-[-10px] relative shadow-2xl border-t border-white/10">
          {/* Shirt Detail */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-[#d1d5db]" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          
          {/* Hands/Gestures */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6">
            <div className="w-3 h-3 rounded-full bg-[#f3f4f6] shadow-md animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-[#f3f4f6] shadow-md animate-bounce" style={{ animationDelay: '200ms' }} />
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-6 bg-yellow-500/20 text-yellow-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-yellow-500/40 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(234,179,8,0.2)]">
        Studio Specialist
      </div>
    </div>
  );
}