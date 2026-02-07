import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const getBarColor = (index, total) => {
    const opacity = 1 - (index * 0.15);
    return `rgba(211, 47, 47, ${Math.max(0.3, opacity)})`;
};

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div style={{
            background: 'white',
            padding: '8px 12px',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #E0E0E0'
        }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
            <div style={{ color: '#D32F2F' }}>DKK {payload[0].value.toLocaleString()}</div>
        </div>
    );
}

export default function WasteBarChart({ data = [] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                />
                <YAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `DKK ${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="waste" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(index, data.length)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
