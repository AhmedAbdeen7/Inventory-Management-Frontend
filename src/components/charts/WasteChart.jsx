import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

function TooltipContent({ active, payload, label }){
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <div style={{ background: 'white', padding: 8, borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ color: '#D32F2F' }}>Waste: {p.value}</div>
    </div>
  );
}

export default function WasteChart({ data = [] }){
  const colors = ['#FFEBEE','#FFCDD2','#EF9A9A','#E57373','#EF5350'];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<TooltipContent />} />
        <Bar dataKey="waste">
          {data.map((d, i) => (
            <Cell key={d.name} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
