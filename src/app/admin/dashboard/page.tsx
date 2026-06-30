'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';
import { ResponsiveBar } from '@nivo/bar';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, PieChart, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

const nivoTheme = {
  background: 'transparent',
  text: { fill: '#a1a1aa', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif' },
  axis: {
    domain: { line: { stroke: 'transparent' } },
    ticks: { line: { stroke: 'transparent' }, text: { fill: '#52525b', fontSize: 10 } },
  },
  grid: { line: { stroke: 'rgba(255,255,255,0.04)', strokeDasharray: '3 3' } },
  tooltip: {
    container: {
      background: '#09090b',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      fontSize: 12,
      color: '#fff',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      padding: '10px 14px',
    },
  },
  legends: { text: { fill: '#71717a', fontSize: 10 } },
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/dashboard/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tJobs = data?.totalJobs || 0;
  const tInterns = data?.totalInternships || 0;
  const tApps = data?.totalApplications || 0;
  const tUsers = data?.totalUsers || 0;

  const statCards = [
    { label: 'Total Users', value: tUsers, color: 'from-blue-500 to-blue-600', data: data?.usersByMonth || [], fill: '#3B82F6' },
    { label: 'Total Jobs', value: tJobs, color: 'from-purple-500 to-purple-600', data: data?.jobsByDepartment || [], fill: '#8B5CF6' },
    { label: 'Applications', value: tApps, color: 'from-emerald-500 to-emerald-600', data: data?.applicationsByMonth?.slice(-6) || [], fill: '#10B981' },
    { label: 'Internships', value: tInterns, color: 'from-amber-500 to-orange-600', data: data?.applicationsByMonth?.slice(-6) || [], fill: '#F59E0B' },
  ];

  const deptTotal = data?.jobsByDepartment?.reduce((a: number, b: any) => a + b.count, 0) || 0;

  const pieData = (data?.applicationsByStatus || []).map((s: any, i: number) => ({
    id: s.status,
    label: s.status,
    value: s.count,
    color: COLORS[i % COLORS.length],
  }));

  const barData = (data?.applicationsByMonth || []).map((d: any) => ({
    month: d.month,
    count: d.count,
    color: '#8B5CF6',
  }));

  return (
    <div className="grid grid-cols-6 gap-4 auto-rows-auto">

      {/* ─── Row 1: Hero Banner ─── */}
      <div className="col-span-6 rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Platform overview</p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: 'Users', value: tUsers },
              { label: 'Apps', value: tApps },
              { label: 'Listings', value: tJobs + tInterns },
            ].map((m, i) => (
              <div key={m.label} className="flex items-center gap-4">
                {i > 0 && <div className="w-px h-10 bg-white/[0.06]" />}
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{m.value}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Row 2: Stat Cards ─── */}
      <div className="col-span-6 grid grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={s.label} className="rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">{s.label}</p>
              <div className="w-16 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={s.data}>
                    <Area type="monotone" dataKey="count" stroke={s.fill} strokeWidth={1.5} fill={`${s.fill}20`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-white text-2xl sm:text-3xl font-bold tracking-tight">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* ─── Row 3: User Growth — ECharts Line ─── */}
      <div className="col-span-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 sm:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h3 className="text-white text-sm font-semibold">User Growth</h3>
            <p className="text-gray-500 text-xs mt-0.5">New users over time</p>
          </div>
          <span className="text-[10px] text-gray-600 bg-white/[0.04] px-2 py-1 rounded-md">Monthly</span>
        </div>
        {(data?.usersByMonth?.length ?? 0) > 0 ? (() => {
          const rawData = data.usersByMonth.map((d: any) => d.count);
          const months = data.usersByMonth.map((d: any) => d.month);
          return (
            <div className="flex-1 min-h-0" style={{ minHeight: 200 }}>
              <ReactEChartsCore
                echarts={echarts}
                style={{ width: '100%', height: '100%' }}
                notMerge
                lazyUpdate
                option={{
                  grid: { left: 8, right: 8, top: 10, bottom: 8, containLabel: true },
                  tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(9,9,11,0.95)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: [10, 14],
                    textStyle: { color: '#fff', fontSize: 12, fontFamily: 'Inter, sans-serif' },
                    formatter: (params: any[]) => {
                      const p = params[0];
                      return `<div style="display:flex;align-items:center;gap:8px">
                        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3B82F6"></span>
                        <span style="color:#a1a1aa">${p.axisValue}: </span>
                        <strong style="color:#fff;font-weight:600">${p.value}</strong>
                      </div>`;
                    },
                  },
                  xAxis: {
                    type: 'category',
                    data: months,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { color: '#52525b', fontSize: 10, fontFamily: 'Inter, sans-serif' },
                    splitLine: { show: false },
                  },
                  yAxis: {
                    type: 'value',
                    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' as const } },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { color: '#52525b', fontSize: 10, fontFamily: 'Inter, sans-serif' },
                  },
                  series: [
                    {
                      type: 'line',
                      data: rawData,
                      smooth: true,
                      showSymbol: false,
                      lineStyle: { width: 2.5, color: '#3B82F6' },
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0, y: 0, x2: 0, y2: 1,
                          colorStops: [
                            { offset: 0, color: 'rgba(59,130,246,0.4)' },
                            { offset: 0.5, color: 'rgba(59,130,246,0.12)' },
                            { offset: 1, color: 'rgba(59,130,246,0)' },
                          ],
                        },
                      },
                      emphasis: { focus: 'series' as const },
                    },
                  ],
                }}
              />
            </div>
          );
        })() : <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">No data</div>}
      </div>

      {/* ─── Row 3: App Status — ECharts (Excel-style) ─── */}
      <div className="col-span-1 rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-3 flex flex-col items-center justify-center">
        <p className="text-white text-xs font-semibold mb-1">App Status</p>
        {pieData.length ? (
          <div className="w-full h-[160px]">
            <ReactEChartsCore
              echarts={echarts}
              option={{
                color: COLORS,
                tooltip: {
                  trigger: 'item',
                  backgroundColor: 'rgba(9,9,11,0.95)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: [10, 14],
                  textStyle: { color: '#fff', fontSize: 12, fontFamily: 'Inter, sans-serif' },
                  formatter: (p: any) =>
                    `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};margin-right:8px"></span>` +
                    `<span style="color:#a1a1aa">${p.name}: </span>` +
                    `<strong style="color:#fff;font-weight:600">${p.value}</strong>` +
                    `<span style="color:#52525b;margin-left:4px">(${p.percent}%)</span>`,
                },
                series: [{
                  type: 'pie',
                  radius: ['48%', '72%'],
                  center: ['50%', '50%'],
                  avoidLabelOverlap: true,
                  padAngle: 1.5,
                  itemStyle: {
                    borderRadius: 4,
                    borderColor: '#09090b',
                    borderWidth: 2,
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 12,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0,0,0,0.5)',
                    },
                  },
                  label: {
                    show: true,
                    position: 'outside',
                    formatter: '{d}%',
                    color: '#71717a',
                    fontSize: 9,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                  },
                  labelLine: {
                    length: 6,
                    length2: 8,
                    smooth: true,
                    lineStyle: { color: 'rgba(255,255,255,0.08)', width: 1 },
                  },
                  data: pieData.map((s: any) => ({ name: s.id, value: s.value })),
                }],
                grid: { containLabel: true },
              }}
              style={{ width: '100%', height: '100%' }}
              notMerge
              lazyUpdate
            />
          </div>
        ) : <p className="text-gray-500 text-xs">No data</p>}
      </div>

      {/* ─── Row 3: Dept Progress ─── */}
      <div className="col-span-1 rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-4 flex flex-col justify-center">
        <p className="text-white text-xs font-semibold mb-3">Departments</p>
        {data?.jobsByDepartment?.length ? (
          <div className="space-y-2">
            {data.jobsByDepartment.slice(0, 4).map((d: any, i: number) => {
              const pct = Math.round((d.count / deptTotal) * 100);
              return (
                <div key={d.department}>
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="text-gray-400 truncate mr-1">{d.department}</span>
                    <span className="text-white font-medium">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="text-gray-500 text-xs">No data</p>}
      </div>

      {/* ─── Row 4: Applications Trend — Nivo ─── */}
      <div className="col-span-2 rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 sm:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h3 className="text-white text-sm font-semibold">Apps Trend</h3>
            <p className="text-gray-500 text-xs mt-0.5">Applications per month</p>
          </div>
        </div>
        {barData.length ? (
          <div className="flex-1 min-h-0">
            <ResponsiveBar
              data={barData}
              keys={['count']}
              indexBy="month"
              padding={0.3}
              colors={{ datum: 'data.color' }}
              borderRadius={6}
              enableLabel={false}
              enableGridY={true}
              gridYValues={4}
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                tickValues: 4,
                format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
              }}
              axisBottom={{
                tickSize: 0,
                tickPadding: 8,
                tickRotation: 0,
              }}
              motionConfig="gentle"
              theme={nivoTheme}
              tooltip={({ indexValue, value }: any) => (
                <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-2 shadow-2xl flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#8B5CF6' }} />
                  <span className="text-gray-400">{indexValue}:</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
              )}
            />
          </div>
        ) : <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">No data</div>}
      </div>

      {/* ─── Row 5: Recent Activity ─── */}
      <div className="col-span-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-sm font-semibold">Recent Activity</h3>
        </div>
        {data?.recentApplications?.length ? (
          <div className="divide-y divide-white/[0.04]">
            {data.recentApplications.slice(0, 5).map((app: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${
                  app.type === 'job' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={app.type === 'job'
                      ? 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
                      : 'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347'}
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs truncate">Application</p>
                  <p className="text-gray-600 text-[10px]">{app.status} &middot; {app.type}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  app.status === 'PENDING' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                  app.status === 'REVIEWED' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                  app.status === 'SHORTLISTED' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                  app.status === 'REJECTED' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                  'text-gray-400 border-gray-500/20 bg-gray-500/10'
                }`}>{app.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">No activity yet</p>
        )}
      </div>

      {/* ─── Row 6: Quick Stats Bar ─── */}
      <div className="col-span-6 rounded-2xl bg-zinc-900/60 border border-white/[0.06] p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Jobs', value: data?.jobs?.filter((j: any) => j.status === 'ACTIVE').length || 0 },
            { label: 'Avg Apps / Job', value: tJobs ? (tApps / tJobs).toFixed(1) : '0' },
            { label: 'Review Rate', value: data?.applicationsByStatus?.find((s: any) => s.status === 'REVIEWED')?.count || 0, suffix: 'reviewed' },
            { label: 'Total Listings', value: tJobs + tInterns },
          ].map((q) => (
            <div key={q.label} className="text-center sm:text-left">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">{q.label}</p>
              <p className="text-white text-lg font-bold mt-0.5">{q.value} {(q as any).suffix && <span className="text-gray-500 text-xs font-normal">{(q as any).suffix}</span>}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
