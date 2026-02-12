import React from 'react';
import { academyLessons } from '@/data/lessons';
import LessonCard from '@/components/LessonCard';
import { cn } from '@/lib/utils';

const Tagline: React.FC = () => (
  <div className="text-center py-12 px-4 mt-12 border-t border-border/40">
    <h2 className={cn(
      "text-2xl md:text-4xl font-extrabold uppercase tracking-widest leading-tight",
      "text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
    )}>
      CANTE. EVOLUA. CONQUISTAR O 
      <span className="block md:inline-block md:ml-4 text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        MUNDO.
      </span>
    </h2>
  </div>
);

const Academy = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 min-h-[80vh] bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary neon-blue-glow mb-4 text-center">
          ACADEMY LOADED
        </h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Explore o currículo de 10 níveis e comece sua jornada para a maestria vocal.
        </p>

        {/* Lessons Grid - Direct Render */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {academyLessons.map((lesson) => (
            <LessonCard key={lesson.level} lesson={lesson} />
          ))}
        </div>

        <Tagline />
      </div>
    </div>
  );
};

export default Academy;