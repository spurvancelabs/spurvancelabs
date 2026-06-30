interface ApplicationStatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  REVIEWED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  SHORTLISTED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  ACCEPTED: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const colorClass = statusColors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
}
