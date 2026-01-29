import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartDataItem {
  name: string;
  pitch: number; // 0-100
  breath: number; // 0-100 (Placeholder for future use)
}

interface VocalEvolutionChartProps {
  data: ChartDataItem[];
  title: string;
  height?: number | string;
}

// Custom Dot component to highlight peak performance
const CustomDot = (props: any) => {
  const { cx, cy, payload, dataKey, data } = props;
  
  // Find the maximum pitch value in the entire dataset
  const maxPitch = Math.max(...data.map((d: ChartDataItem) => d.pitch));
  
  if (dataKey === 'pitch' && payload.pitch === maxPitch && maxPitch > 0) {
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

const VocalEvolutionChart: React.FC<VocalEvolutionChartProps> = ({ data, title, height = "100%" }) => {
  return (
    <div className={cn(
      "w-full p-4 rounded-2xl shadow-xl h-full",
      "glass-pillar"
    )} style={{ height: height }}>
      <h3 className="text-lg font-semibold mb-4 text-primary neon-blue-glow">{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          
          <CartesianGrid 
            stroke="hsl(var(--primary)/0.2)" 
            strokeDasharray="3 3" 
          />
          
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

          <Line 
            type="monotone" 
            dataKey="pitch" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3} 
            dot={<CustomDot dataKey="pitch" data={data} />}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--primary))', strokeWidth: 2 }} 
            style={{ filter: 'drop-shadow(0 0 5px hsl(var(--primary)/0.8))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VocalEvolutionChart;