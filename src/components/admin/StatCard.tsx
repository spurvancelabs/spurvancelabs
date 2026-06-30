interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-white text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          {icon}
        </div>
      </div>
    </div>
  );
}
