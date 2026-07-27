'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectHeader from '@/components/projects/ProjectHeader';

interface Ticket {
  id: string;
  key: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  storyPoints: number | null;
  startDate: string | null;
  dueDate: string | null;
  assignee: { id: string; name: string | null; email: string } | null;
  sprint: { id: string; name: string; status: string } | null;
  parentId: string | null;
  parent: { id: string; key: string; title: string } | null;
  _count: { comments: number; attachments: number };
}

interface Sprint {
  id: string;
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
}

const TYPE_COLORS: Record<string, string> = {
  EPIC: '#a855f7',
  STORY: '#22c55e',
  TASK: '#3b82f6',
  BUG: '#ef4444',
  SUB_TASK: '#6b7280',
};

const STATUS_COLORS: Record<string, string> = {
  BACKLOG: '#6b7280',
  TODO: '#eab308',
  IN_PROGRESS: '#3b82f6',
  IN_REVIEW: '#a855f7',
  DONE: '#22c55e',
  CANCELLED: '#ef4444',
};

const SPRINT_COLORS = ['#3b82f620', '#22c55e20', '#a855f720', '#eab30820', '#ef444420'];

const DAY_MS = 86400000;

function parseDate(d: string | null): Date | null {
  if (!d) return null;
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date;
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * DAY_MS);
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatMonth(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function RoadmapPage({ params }: { params: Promise<{ projectId: string }> }) {
  const [projectId, setProjectId] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<{ id: string; name: string; key: string } | null>(null);
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'months' | 'weeks'>('months');
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => { params.then(p => setProjectId(p.projectId)); }, [params]);

  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      fetch(`/api/projects/${projectId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/tickets`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/projects/${projectId}/sprints`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([pData, tData, sData]) => {
      setProject(pData.data);
      setTickets(tData.data || []);
      setSprints(sData.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [projectId]);

  const { epics, ticketsByParent, timelineStart, timelineEnd } = useMemo(() => {
    const epicsList = tickets.filter(t => t.type === 'EPIC');
    const childMap: Record<string, Ticket[]> = {};
    for (const t of tickets) {
      if (t.parentId) {
        if (!childMap[t.parentId]) childMap[t.parentId] = [];
        childMap[t.parentId].push(t);
      }
    }

    const allDates: Date[] = [];
    for (const t of tickets) {
      const s = parseDate(t.startDate);
      const d = parseDate(t.dueDate);
      if (s) allDates.push(s);
      if (d) allDates.push(d);
    }
    for (const s of sprints) {
      const sd = parseDate(s.startDate);
      const ed = parseDate(s.endDate);
      if (sd) allDates.push(sd);
      if (ed) allDates.push(ed);
    }

    if (allDates.length === 0) {
      const now = new Date();
      allDates.push(addDays(now, -30), addDays(now, 60));
    }

    allDates.sort((a, b) => a.getTime() - b.getTime());
    const start = addDays(allDates[0], -7);
    const end = addDays(allDates[allDates.length - 1], 14);

    return { epics: epicsList, ticketsByParent: childMap, timelineStart: start, timelineEnd: end };
  }, [tickets, sprints]);

  const totalDays = daysBetween(timelineStart, timelineEnd);

  const dayToPercent = (d: Date) => {
    const days = daysBetween(timelineStart, d);
    return Math.max(0, Math.min(100, (days / totalDays) * 100));
  };

  const toggleEpic = (id: string) => {
    setExpandedEpics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const months = useMemo(() => {
    const result: { label: string; date: Date; percent: number }[] = [];
    let current = new Date(timelineStart.getFullYear(), timelineStart.getMonth(), 1);
    while (current <= timelineEnd) {
      result.push({
        label: formatMonth(current),
        date: new Date(current),
        percent: dayToPercent(current),
      });
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }
    return result;
  }, [timelineStart, timelineEnd]);

  const weeks = useMemo(() => {
    const result: { label: string; date: Date; percent: number }[] = [];
    let current = new Date(timelineStart);
    current.setDate(current.getDate() - current.getDay());
    while (current <= timelineEnd) {
      result.push({
        label: formatDate(current),
        date: new Date(current),
        percent: dayToPercent(current),
      });
      current = addDays(current, 7);
    }
    return result;
  }, [timelineStart, timelineEnd]);

  const todayPercent = dayToPercent(new Date());

  const TicketBar = ({ ticket, depth = 0 }: { ticket: Ticket; depth?: number }) => {
    const start = parseDate(ticket.startDate);
    const due = parseDate(ticket.dueDate);
    if (!start && !due) return null;

    const barStart = start || due!;
    const barEnd = due || start!;
    const left = dayToPercent(barStart);
    const width = Math.max(0.5, dayToPercent(barEnd) - left);
    const color = STATUS_COLORS[ticket.status] || '#6b7280';

    return (
      <div className="flex items-center h-7 group" style={{ paddingLeft: `${depth * 20}px` }}>
        <div className="absolute left-0 w-[280px] md:w-[340px] shrink-0 flex items-center gap-2 px-3 h-7 z-10 bg-zinc-950">
          {ticket.type !== 'EPIC' && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: TYPE_COLORS[ticket.type] || '#6b7280' }} />}
          <span className="text-[10px] font-mono text-gray-500 shrink-0">{ticket.key}</span>
          <span className="text-[11px] text-gray-300 truncate">{ticket.title}</span>
        </div>
        <div className="flex-1 relative h-full">
          <div
            className="absolute top-1.5 h-4 rounded-sm flex items-center px-1.5 cursor-default transition-opacity group-hover:opacity-90"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              backgroundColor: color + '30',
              borderLeft: `2px solid ${color}`,
            }}
            title={`${ticket.key}: ${ticket.title}\n${formatDate(barStart)} → ${formatDate(barEnd)}\nStatus: ${ticket.status.replace('_', ' ')}`}
          >
            <span className="text-[9px] text-white/70 truncate">{ticket.key}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-zinc-950">
        <ProjectSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <ProjectSidebar project={project || undefined} />
      <div className="flex-1 lg:ml-64">
        <ProjectHeader projectName={project?.name} projectKey={project?.key} projectId={projectId} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">Roadmap</h1>
              <p className="text-gray-500 text-sm mt-1">High-level project timeline with epics and sprints</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedEpics(new Set(epics.map(e => e.id)))}
                className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                Expand all
              </button>
              <span className="text-gray-600">·</span>
              <button
                onClick={() => setExpandedEpics(new Set())}
                className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                Collapse all
              </button>
              <div className="ml-3 bg-zinc-800 rounded-lg flex overflow-hidden border border-white/[0.06]">
                <button
                  onClick={() => setViewMode('months')}
                  className={`text-xs px-3 py-1.5 cursor-pointer ${viewMode === 'months' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Months
                </button>
                <button
                  onClick={() => setViewMode('weeks')}
                  className={`text-xs px-3 py-1.5 cursor-pointer ${viewMode === 'weeks' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Weeks
                </button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/[0.06] rounded-xl overflow-hidden">
            {/* Timeline Header */}
            <div className="flex border-b border-white/[0.06] sticky top-0 z-20 bg-zinc-900">
              <div className="w-[280px] md:w-[340px] shrink-0 px-3 py-2 text-[11px] text-gray-500 uppercase tracking-wider font-medium border-r border-white/[0.06]">
                Epics & Tickets
              </div>
              <div className="flex-1 relative h-8">
                {(viewMode === 'months' ? months : weeks).map((m, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full border-l border-white/[0.04] flex items-center"
                    style={{ left: `${m.percent}%` }}
                  >
                    <span className="text-[10px] text-gray-500 pl-2 whitespace-nowrap">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint Bands */}
            <div className="flex border-b border-white/[0.06]">
              <div className="w-[280px] md:w-[340px] shrink-0 px-3 py-1.5 text-[10px] text-gray-600 border-r border-white/[0.06] flex items-center">
                Sprints
              </div>
              <div className="flex-1 relative h-7">
                {sprints.map((sprint, i) => {
                  const sd = parseDate(sprint.startDate);
                  const ed = parseDate(sprint.endDate);
                  if (!sd && !ed) return null;
                  const left = dayToPercent(sd || ed!);
                  const right = dayToPercent(ed || sd!);
                  return (
                    <div
                      key={sprint.id}
                      className="absolute top-0.5 h-6 rounded-sm flex items-center px-2"
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(1, right - left)}%`,
                        backgroundColor: SPRINT_COLORS[i % SPRINT_COLORS.length],
                        border: `1px solid ${SPRINT_COLORS[i % SPRINT_COLORS.length].replace('20', '40')}`,
                      }}
                      title={`${sprint.name} (${sprint.status})\n${sd ? formatDate(sd) : '?'} → ${ed ? formatDate(ed) : '?'}`}
                    >
                      <span className="text-[9px] text-gray-400 truncate">{sprint.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Epics & Tickets */}
            <div className="relative max-h-[65vh] overflow-y-auto">
              {/* Today line */}
              <div
                className="absolute top-0 bottom-0 w-px bg-red-500/50 z-10 pointer-events-none"
                style={{ left: `calc(280px + ${todayPercent}% * (100% - 280px) / 100)` }}
              >
                <div className="absolute -top-0 -left-3.5 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                  Today
                </div>
              </div>

              {epics.length === 0 ? (
                <div className="py-16 text-center text-gray-600 text-sm">
                  No epics found. Create tickets with type <span className="text-purple-400 font-medium">EPIC</span> and set start/due dates to see them on the roadmap.
                </div>
              ) : (
                epics.map(epic => {
                  const children = ticketsByParent[epic.id] || [];
                  const isExpanded = expandedEpics.has(epic.id);
                  return (
                    <div key={epic.id} className="border-b border-white/[0.03]">
                      <div
                        className="flex items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => toggleEpic(epic.id)}
                      >
                        <div className="w-[280px] md:w-[340px] shrink-0 flex items-center gap-2 px-3 h-9 border-r border-white/[0.03]">
                          <svg
                            className={`w-3 h-3 text-gray-500 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TYPE_COLORS.EPIC }} />
                          <span className="text-[10px] font-mono text-gray-500 shrink-0">{epic.key}</span>
                          <span className="text-xs text-white font-medium truncate">{epic.title}</span>
                          <span className="text-[9px] text-gray-600 ml-auto shrink-0">{children.length}</span>
                        </div>
                        <div className="flex-1 relative h-9">
                          <TicketBar ticket={epic} />
                        </div>
                      </div>

                      {isExpanded && children.map(child => (
                        <div key={child.id} className="flex items-center border-t border-white/[0.02] hover:bg-white/[0.01]">
                          <div className="w-[280px] md:w-[340px] shrink-0 border-r border-white/[0.03]">
                            <TicketBar ticket={child} depth={1} />
                          </div>
                          <div className="flex-1 relative h-7">
                            {(() => {
                              const start = parseDate(child.startDate);
                              const due = parseDate(child.dueDate);
                              if (!start && !due) return null;
                              const barStart = start || due!;
                              const barEnd = due || start!;
                              const left = dayToPercent(barStart);
                              const width = Math.max(0.5, dayToPercent(barEnd) - left);
                              const color = STATUS_COLORS[child.status] || '#6b7280';
                              return (
                                <div
                                  className="absolute top-1.5 h-4 rounded-sm flex items-center px-1.5 cursor-default hover:opacity-80"
                                  style={{
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    backgroundColor: color + '25',
                                    borderLeft: `2px solid ${color}`,
                                  }}
                                  title={`${child.key}: ${child.title}\n${formatDate(barStart)} → ${formatDate(barEnd)}\nStatus: ${child.status.replace('_', ' ')}`}
                                >
                                  <span className="text-[9px] text-white/60 truncate">{child.key}</span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}

              {/* Standalone tickets (no epic parent) */}
              {tickets.filter(t => !t.parentId && t.type !== 'EPIC').length > 0 && (
                <div className="border-t border-white/[0.06]">
                  <div className="px-3 py-2 text-[10px] text-gray-600 uppercase tracking-wider bg-zinc-900/50">
                    Other Tickets
                  </div>
                  {tickets
                    .filter(t => !t.parentId && t.type !== 'EPIC')
                    .map(ticket => (
                      <div key={ticket.id} className="flex items-center border-t border-white/[0.02] hover:bg-white/[0.01]">
                        <div className="w-[280px] md:w-[340px] shrink-0 border-r border-white/[0.03]">
                          <TicketBar ticket={ticket} />
                        </div>
                        <div className="flex-1 relative h-7">
                          {(() => {
                            const start = parseDate(ticket.startDate);
                            const due = parseDate(ticket.dueDate);
                            if (!start && !due) return null;
                            const barStart = start || due!;
                            const barEnd = due || start!;
                            const left = dayToPercent(barStart);
                            const width = Math.max(0.5, dayToPercent(barEnd) - left);
                            const color = STATUS_COLORS[ticket.status] || '#6b7280';
                            return (
                              <div
                                className="absolute top-1.5 h-4 rounded-sm flex items-center px-1.5 cursor-default hover:opacity-80"
                                style={{
                                  left: `${left}%`,
                                  width: `${width}%`,
                                  backgroundColor: color + '25',
                                  borderLeft: `2px solid ${color}`,
                                }}
                                title={`${ticket.key}: ${ticket.title}\n${formatDate(barStart)} → ${formatDate(barEnd)}`}
                              >
                                <span className="text-[9px] text-white/60 truncate">{ticket.key}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">Status:</span>
            {Object.entries(STATUS_COLORS).filter(([k]) => k !== 'CANCELLED').map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: v }} />
                <span className="text-[10px] text-gray-400">{k.replace('_', ' ')}</span>
              </div>
            ))}
            <span className="text-gray-600">·</span>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">Type:</span>
            {Object.entries(TYPE_COLORS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v }} />
                <span className="text-[10px] text-gray-400">{k.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
