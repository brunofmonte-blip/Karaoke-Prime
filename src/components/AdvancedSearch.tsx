import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Globe, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const AdvancedSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState<'Nacional' | 'Internacional' | 'All'>('All');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Redirect to library with search params
    navigate(`/library?q=${encodeURIComponent(query)}&origin=${origin}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-3xl glass-pillar border-2 border-primary/30 shadow-2xl">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Busca Avançada: Artista, Música ou Gênero..." 
            className="pl-10 h-12 rounded-xl bg-background/50 border-primary/20 focus:border-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={(v) => setOrigin(v as any)}>
          <TabsList className="grid grid-cols-3 h-12 bg-background/50 border border-primary/20 rounded-xl">
            <TabsTrigger value="All" className="rounded-lg">Tudo</TabsTrigger>
            <TabsTrigger value="Nacional" className="rounded-lg flex items-center gap-1">
              <Flag className="h-3 w-3" /> Nacional
            </TabsTrigger>
            <TabsTrigger value="Internacional" className="rounded-lg flex items-center gap-1">
              <Globe className="h-3 w-3" /> Inter
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button 
          onClick={handleSearch}
          className="h-12 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
        >
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSearch;