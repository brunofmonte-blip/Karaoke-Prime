import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from 'recharts';
import { cn } from '@/lib/utils';
import { Sparkles, Music, Swords, User } from 'lucide-react';

export interface ChartDataItem {
  name: string;
  pitch: number; // 0-100
  frequency?: number;
  breath?: number; 
}

interface VocalEvolutionChartProps {
  data: ChartDataItem[];
  title: string;
  height?: number | string;
  opponentTrace?: ChartDataItem[]; 
}

// Cores Oficiais da Arena de Duelo
const COLOR_USER = "#06b6d4"; // Cyan Neon
const COLOR_OPPONENT = "#ec4899"; // Pink/Magenta Neon

const CustomDot = (props: any) => {
  const { cx, cy, payload, dataKey, data } = props;
  const maxPitch = Math.max(...data.map((d: ChartDataItem) => d.pitch));
  
  if (dataKey === 'pitch' && payload.pitch === maxPitch && maxPitch > 0) {
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill={COLOR_USER} style={{ filter: `drop-shadow(0 0 8px ${COLOR_USER})` }} />
        <text x="10" y="10" dy={4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          MAX
        </text>
      </svg>
    );
  }
  return null;
};

const VocalEvolutionChart: React.FC<VocalEvolutionChartProps> = ({ data, title, height = "100%", opponentTrace = [] }) => {
  const isEmpty = data.length === 0 || data.every(d => d.pitch === 0);
  const isDuel = opponentTrace && opponentTrace.length > 0;

  return (
    <div className={cn(
      "w-full p-4 md:p-6 rounded-2xl shadow-2xl h-full relative overflow-hidden flex flex-col",
      "bg-zinc-950/80 backdrop-blur-xl border-2 border-cyan-500/20"
    )} style={{ height: height }}>
      
      {/* HEADER DA ARENA */}
      <div className="flex items-center justify-between mb-4 z-10">
        <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-widest drop-shadow-md">
          {isDuel ? "Arena de Batalha Vocal" : title}
        </h3>
        
        {/* LEGENDA DO DUELO */}
        {isDuel && (
          <div className="flex items-center gap-4 bg-black/50 px-4 py-1.5 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Você</span>
            </div>
            <Swords size={14} className="text-gray-500" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Oponente</span>
              <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>
            </div>
          </div>
        )}
      </div>
      
      {isEmpty && !isDuel ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-sm z-20">
          <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4 animate-pulse shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Music className="h-10 w-10 text-cyan-400" />
          </div>
          <h4 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Aguardando Voz</h4>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-bold uppercase tracking-widest">
            Inicie a captação para ver suas ondas vocais em tempo real.
          </p>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '1rem', color: '#fff', fontWeight: 'bold' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number, name: string) => [
                  `${Math.round(value)}%`, 
                  name === 'opponent' ? 'Oponente' : 'Você'
                ]}
                labelStyle={{ display: 'none' }}
              />
              <defs>
                <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLOR_USER} stopOpacity={0.6}/>
                  <stop offset="95%" stopColor={COLOR_USER} stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorOpponent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLOR_OPPONENT} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={COLOR_OPPONENT} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              
              {/* LINHA DO OPONENTE (GHOST TRACE) */}
              {isDuel && (
                <Area 
                  type="monotone" 
                  dataKey="pitch" 
                  data={opponentTrace}
                  name="opponent"
                  stroke={COLOR_OPPONENT} 
                  fill="url(#colorOpponent)" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: COLOR_OPPONENT, stroke: '#fff', strokeWidth: 2 }}
                  style={{ filter: `drop-shadow(0 0 8px ${COLOR_OPPONENT})` }}
                />
              )}

              {/* LINHA DO USUÁRIO (VOCÊ) */}
              <Area 
                type="monotone" 
                dataKey="pitch" 
                name="user"
                stroke={COLOR_USER} 
                fill="url(#colorUser)" 
                strokeWidth={4} 
                dot={false}
                activeDot={{ r: 8, fill: COLOR_USER, stroke: '#fff', strokeWidth: 2 }}
                style={{ filter: `drop-shadow(0 0 10px ${COLOR_USER})` }}
              />

              {/* PONTO MÁXIMO DO USUÁRIO */}
              <Line 
                type="monotone" 
                dataKey="pitch" 
                stroke="transparent" 
                strokeWidth={0} 
                dot={<CustomDot dataKey="pitch" data={data} />}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default VocalEvolutionChart;