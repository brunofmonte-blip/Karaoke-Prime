import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MadeWithDyad } from "@/components/made-with-dyad";

const chartData = [
  { name: 'Note 1', pitch: 65, breath: 80 },
  { name: 'Note 2', pitch: 70, breath: 75 },
  { name: 'Note 3', pitch: 85, breath: 90 },
  { name: 'Note 4', pitch: 92, breath: 88 },
  { name: 'Note 5', pitch: 78, breath: 82 },
  { name: 'Note 6', pitch: 88, breath: 95 },
  { name: 'Note 7', pitch: 95, breath: 98 },
];

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border/40 p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Vocal Note Evolution Chart - Fixed Height Container */}
          <div className="lg:col-span-2 h-48 w-full">
            <h3 className="text-lg font-semibold mb-2 text-primary neon-blue-glow">Vocal Note Evolution (Pitch Accuracy 0-100)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                {/* XAxis represents Time/Notes (hidden) */}
                <XAxis dataKey="name" hide />
                {/* YAxis represents Pitch Accuracy (0-100) (hidden, but domain set for logic) */}
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '0.5rem' 
                  }}
                  formatter={(value, name) => [`${value}%`, name === 'pitch' ? 'Pitch Accuracy' : 'Breath Control']}
                />
                {/* Neon Blue Line for Pitch */}
                <Line 
                  type="monotone" 
                  dataKey="pitch" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={false} 
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--primary))', strokeWidth: 2 }} 
                  style={{ filter: 'drop-shadow(0 0 5px hsl(var(--primary)/0.8))' }} // Soft glow style
                />
                {/* Prime Gold Line for secondary metric (Breath) */}
                <Line type="monotone" dataKey="breath" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} opacity={0.6} activeDot={{ r: 4, fill: 'hsl(var(--accent))', stroke: 'hsl(var(--accent))', strokeWidth: 1 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Links and Branding */}
          <div className="text-right space-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Karaoke Prime. All rights reserved.
            </p>
            <MadeWithDyad />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;