const SIGNUPS_CLOSED = true
const CLOSED_MESSAGE = 'No more signups are expected now'

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {SIGNUPS_CLOSED && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-sm rounded-xl border border-yellow-500/40 bg-yellow-500/10 backdrop-blur-sm px-6 py-4 text-center shadow-lg shadow-yellow-500/10">
            <p className="text-sm font-semibold text-yellow-300">{CLOSED_MESSAGE}</p>
          </div>
        </div>
      )}
      <div className={SIGNUPS_CLOSED ? 'pointer-events-none select-none opacity-30' : ''}>
        {children}
      </div>
    </>
  )
}
