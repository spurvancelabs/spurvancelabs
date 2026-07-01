const SIGNUPS_CLOSED = true
const CLOSED_TITLE = 'Registrations Closed'
const CLOSED_DESCRIPTION = 'No more signups are expected at this time. Please check back later.'

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {SIGNUPS_CLOSED && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/15 to-amber-500/5 backdrop-blur-xl px-8 py-6 text-center shadow-2xl shadow-amber-500/10">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
              <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-amber-300">{CLOSED_TITLE}</h3>
            <p className="mt-2 text-sm text-amber-200/70 leading-relaxed">{CLOSED_DESCRIPTION}</p>
          </div>
        </div>
      )}
      <div className={SIGNUPS_CLOSED ? 'pointer-events-none select-none opacity-25' : ''}>
        {children}
      </div>
    </>
  )
}
