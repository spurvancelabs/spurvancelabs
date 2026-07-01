'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

function PremiumTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-gray-500 text-xs font-medium mb-1.5 tracking-wide uppercase">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-400">{p.name}:</span>
          <span className="text-white font-semibold">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function KpiCard({ label, value, sub, trend, trendUp }: {
  label: string; value: string | number; sub?: string; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="relative group">
      <div className="absolute -inset-px bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-zinc-900/80 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-xl">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-white text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
        {trend && (
          <p className={`text-xs font-medium flex items-center gap-1 mt-2 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trendUp ? 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' : 'M2.25 6L9 12.75l4.286-4.286a11.95 11.95 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181'} />
            </svg>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, badge, children }: {
  title: string; subtitle: string; badge?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-4 sm:p-6 hover:border-white/[0.12] transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white text-sm font-semibold">{title}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>
        </div>
        {badge && typeof badge === 'string' ? <span className="text-[10px] text-gray-600 bg-white/[0.04] px-2 py-1 rounded-md tracking-wide">{badge}</span> : badge}
      </div>
      {children}
    </div>
  );
}

const PERIODS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('monthly');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics', period],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-0.5">Deep insights into platform performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Total Users" value={data?.totalUsers || 0} trend={data?.userGrowthRate > 0 ? `+${data.userGrowthRate}%` : `${data.userGrowthRate}%`} trendUp={data?.userGrowthRate >= 0} />
        <KpiCard label="Total Applications" value={data?.totalApplications || 0} trend={data?.appGrowthRate > 0 ? `+${data.appGrowthRate}%` : `${data.appGrowthRate}%`} trendUp={data?.appGrowthRate >= 0} />
        <KpiCard label="Conversion Rate" value={`${data?.conversionRate || 0}%`} sub="Reviewed / Shortlisted" />
        <KpiCard label="Avg Apps / Job" value={data?.appsPerJob || 0} sub="Across all listings" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="User Growth" subtitle="Signups over time" badge={
          <div className="flex gap-1 bg-white/[0.04] rounded-md p-0.5">
            {PERIODS.map(p => (
              <button key={p.key} onClick={() => setPeriod(p.key)}
                className={`text-[10px] px-2 py-1 rounded-md transition-colors ${period === p.key ? 'bg-zinc-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >{p.label}</button>
            ))}
          </div>
        }>
          {data?.usersByMonth && data.usersByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.usersByMonth} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGradientA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" stroke="#555" fontSize={11} tickLine={false} axisLine={false} tickMargin={6} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} tickMargin={6} />
                <Tooltip content={<PremiumTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2.5} fill="url(#userGradientA)" name="Users" dot={false} activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2, fill: '#0a0a0a' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 text-sm">No data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Application Trends" subtitle="Applications over time" badge={
          <div className="flex gap-1 bg-white/[0.04] rounded-md p-0.5">
            {PERIODS.map(p => (
              <button key={p.key} onClick={() => setPeriod(p.key)}
                className={`text-[10px] px-2 py-1 rounded-md transition-colors ${period === p.key ? 'bg-zinc-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >{p.label}</button>
            ))}
          </div>
        }>
          {data?.applicationsByMonth && data.applicationsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.applicationsByMonth} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradientA" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" stroke="#555" fontSize={11} tickLine={false} axisLine={false} tickMargin={6} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} tickMargin={6} />
                <Tooltip content={<PremiumTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="count" fill="url(#barGradientA)" radius={[6, 6, 0, 0]} maxBarSize={44} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 text-sm">No data yet</div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <ChartCard title="Jobs by Department" subtitle="Distribution across teams">
          {data?.jobsByDepartment && data.jobsByDepartment.length > 0 ? (() => {
            const total = data.jobsByDepartment.reduce((s: number, d: any) => s + d.count, 0);
            return (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.jobsByDepartment} dataKey="count" nameKey="department" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0} activeShape={{ outerRadius: 93, strokeWidth: 2, stroke: '#0a0a0a' }}>
                    {data.jobsByDepartment.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={20} fontWeight={700}>{total}</text>
                  <Tooltip content={<PremiumTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#888', paddingTop: 8 }} iconType="circle" iconSize={8} formatter={(v: string) => <span className="text-gray-400">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            );
          })() : (
            <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">No data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Jobs by Type" subtitle="Full-time, Part-time, Contract">
          {data?.jobsByType && data.jobsByType.length > 0 ? (() => {
            const total = data.jobsByType.reduce((s: number, d: any) => s + d.count, 0);
            return (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.jobsByType} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0} activeShape={{ outerRadius: 93, strokeWidth: 2, stroke: '#0a0a0a' }}>
                    {data.jobsByType.map((_: any, i: number) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={20} fontWeight={700}>{total}</text>
                  <Tooltip content={<PremiumTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#888', paddingTop: 8 }} iconType="circle" iconSize={8} formatter={(v: string) => <span className="text-gray-400">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            );
          })() : (
            <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">No data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Application Status" subtitle="Current status breakdown">
          {data?.applicationsByStatus && data.applicationsByStatus.length > 0 ? (() => {
            const total = data.applicationsByStatus.reduce((s: number, d: any) => s + d.count, 0);
            return (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.applicationsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0} activeShape={{ outerRadius: 93, strokeWidth: 2, stroke: '#0a0a0a' }}>
                    {data.applicationsByStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />)}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={20} fontWeight={700}>{total}</text>
                  <Tooltip content={<PremiumTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#888', paddingTop: 8 }} iconType="circle" iconSize={8} formatter={(v: string) => <span className="text-gray-400">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            );
          })() : (
            <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">No data yet</div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Job Status Overview" subtitle="Active vs Closed vs Draft">
          {data?.activeJobs !== undefined ? (
            <div className="space-y-4 pt-2">
              {[
                { label: 'Active', value: data.activeJobs, color: 'bg-emerald-500', percent: data.totalJobs ? Math.round((data.activeJobs / data.totalJobs) * 100) : 0 },
                { label: 'Closed', value: data.closedJobs, color: 'bg-red-500', percent: data.totalJobs ? Math.round((data.closedJobs / data.totalJobs) * 100) : 0 },
                { label: 'Draft', value: data.draftJobs, color: 'bg-yellow-500', percent: data.totalJobs ? Math.round((data.draftJobs / data.totalJobs) * 100) : 0 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-white font-medium">{item.value} <span className="text-gray-500 font-normal">({item.percent}%)</span></span>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-500 text-sm">No data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Internship Status Overview" subtitle="Active vs Closed">
          {data?.activeInternships !== undefined ? (
            <div className="space-y-4 pt-2">
              {[
                { label: 'Active', value: data.activeInternships, color: 'bg-emerald-500', percent: data.totalInternships ? Math.round((data.activeInternships / data.totalInternships) * 100) : 0 },
                { label: 'Closed', value: data.closedInternships, color: 'bg-red-500', percent: data.totalInternships ? Math.round((data.closedInternships / data.totalInternships) * 100) : 0 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-white font-medium">{item.value} <span className="text-gray-500 font-normal">({item.percent}%)</span></span>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
              {data.totalInternships === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">No internships yet</div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-500 text-sm">No data yet</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
