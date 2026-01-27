import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <footer className="w-full bg-card border-t border-border/40 mt-12 p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Vocal Note Evolution Chart */}
          <div className="lg:col-span-2 h-48 w-full">
            <h3 className="text-lg font-semibold mb-2 text-primary">Vocal Note Evolution (Last Session)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '0.5rem' 
                  }}
                />
                {/* Neon Blue Line */}
                <Line type="monotone" dataKey="pitch" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                {/* Prime Gold Line for secondary metric (Breath) */}
                <Line type="monotone" dataKey="breath" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} opacity={0.6} />
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