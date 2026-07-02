export default function LandingLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        <p className="text-white/60 text-sm font-light tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
