'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VelocityData {
  sprint: string;
  committed: number;
  completed: number;
}

export default function VelocityChart({ projectId }: { projectId: string }) {
  const [data, setData] = useState<VelocityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/reports/velocity`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        const sprints = (d.data?.sprints || []).map((s: { sprintName: string; completedPoints: number; totalTickets: number }) => ({
          sprint: s.sprintName,
          committed: s.totalTickets,
          completed: s.completedPoints,
        }));
        setData(sprints);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return <div className="flex items-center justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  if (data.length === 0) {
    return <p className="text-gray-600 text-sm text-center py-8">No velocity data yet. Complete sprints to see velocity.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="sprint" stroke="#71717a" fontSize={11} />
        <YAxis stroke="#71717a" fontSize={11} />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend />
        <Bar dataKey="committed" fill="#6366f1" name="Committed Tickets" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" fill="#22c55e" name="Completed Points" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
