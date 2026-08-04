'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BurndownPoint {
  date: string;
  ideal: number;
  actual: number | null;
}

export default function BurndownChart({ projectId, sprintId }: { projectId: string; sprintId: string }) {
  const [data, setData] = useState<BurndownPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !sprintId) return;
    setLoading(true);
    fetch(`/api/projects/${projectId}/reports/burndown?sprintId=${sprintId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        const ideal = d.data?.idealLine || [];
        const actual = d.data?.actualData || [];
        const actualMap = new Map<string, number>();
        for (const pt of actual) {
          actualMap.set(pt.date, pt.points);
        }
        const merged = ideal.map((pt: { date: string; points: number }) => ({
          date: pt.date,
          ideal: Math.round(pt.points * 10) / 10,
          actual: actualMap.has(pt.date) ? Math.round(actualMap.get(pt.date)! * 10) / 10 : null,
        }));
        setData(merged);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId, sprintId]);

  if (loading) {
    return <div className="flex items-center justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  if (data.length === 0) {
    return <p className="text-gray-600 text-sm text-center py-8">No burndown data available for this sprint</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="date"
          stroke="#71717a"
          fontSize={11}
          tickFormatter={v => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis stroke="#71717a" fontSize={11} />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}
          labelStyle={{ color: '#fff' }}
          labelFormatter={v => new Date(v).toLocaleDateString()}
        />
        <Legend />
        <Line type="monotone" dataKey="ideal" stroke="#6366f1" strokeDasharray="5 5" name="Ideal" dot={false} />
        <Line type="monotone" dataKey="actual" stroke="#22c55e" name="Actual" connectNulls strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
