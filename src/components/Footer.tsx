import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { MadeWithDyad } from "@/components/made-with-dyad";
import UserProfileCard from './UserProfileCard';
import { cn } from '@/lib/utils';

const chartData = [
  { name: 'Note 1', pitch: 65, breath: 80 },
  { name: 'Note 2', pitch: 70, breath: 75 },
  { name: 'Note 3', pitch: 85, breath: 90 },
  { name: 'Note 4', pitch: 92, breath: 88 },
  { name: 'Note 5', pitch: 78, breath: 82 },
  { name: 'Note 6', pitch: 88, breath: 95 },
  { name: 'Note 7', pitch: 95, breath: 98 },
];

// Custom Dot component to highlight peak performance
const CustomDot = (props: any) => {
  const { cx, cy, payload, dataKey } = props;
  
  // Find the maximum pitch value
  const maxPitch = Math.max(...chartData.map(d => d.pitch));
  
  if (dataKey === 'pitch' && payload.pitch === maxPitch) {
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="hsl(var(--accent))" style={{ filter: 'drop-shadow(0 0 5px hsl(var(--accent)/0.9))' }} />
        <text x="10" y="10" dy={4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          P
        </text>
      </svg>
    );
  }
  return null;
};

const Footer = () => {
  // Placeholder data for the profile card
  const userData = {
    userName: "VocalPro_88",
    bestNote: 98,
    academyLevel: 7,
    rankingOnline: 12,
    rankingOffline: 5,
  };

  return (
    <footer className="w-full bg-background border-t border-border/40 p-6">
      <div className="container mx-auto">
        
        {/* Main Content Grid: Chart (2/3) and Profile (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          
          {/* Vocal Note Evolution Chart */}
          <div className={cn(
            "lg:col-span-2 h-64 w-full p-4 rounded-2xl border-2 border-primary/50 backdrop-blur-md",
            "bg-card/10 shadow-xl",
            "glass-pillar" // Using the custom glassmorphism class
          )}>
            <h3 className="text-lg font-semibold mb-4 text-primary neon-blue-glow">Vocal Note Evolution (Pitch Accuracy 0-100)</h3>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                
                {/* Soft Neon Grid */}
                <CartesianGrid 
                  stroke="hsl(var(--primary)/0.2)" 
                  strokeDasharray="3 3" 
                />
                
                {/* Hiding X and Y axes for a minimalist, transparent look */}
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} hide />
                
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '0.5rem' 
                  }}
                  formatter={(value, name) => [`${value}%`, name === 'pitch' ? 'Pitch Accuracy' : 'Breath Control']}
                />
                
                {/* Semi-transparent Cyan Fill (Area) */}
                <defs>
                  <linearGradient id="colorPitch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="pitch" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#colorPitch)" 
                  strokeWidth={3} 
                />

                {/* Neon Blue Line for Pitch */}
                <Line 
                  type="monotone" 
                  dataKey="pitch" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={<CustomDot dataKey="pitch" />} // Use CustomDot for peak marker
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--primary))', strokeWidth: 2 }} 
                  style={{ filter: 'drop-shadow(0 0 5px hsl(var(--primary)/0.8))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <UserProfileCard 
              userName={userData.userName}
              bestNote={userData.bestNote}
              academyLevel={userData.academyLevel}
              rankingOnline={userData.rankingOnline}
              rankingOffline={userData.rankingOffline}
            />
          </div>
        </div>
        
        {/* Footer Links and Branding (Moved to bottom center/right) */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground order-2 md:order-1 mt-4 md:mt-0">
            © {new Date().getFullYear()} Karaoke Prime. All rights reserved.
          </p>
          <div className="order-1 md:order-2">
            <MadeWithDyad />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;