import { getAuthUser } from '@/lib/lms/utils'
import LMSLayoutClient from '@/components/lms/LMSLayoutClient'
import "@/global.css"

export const dynamic = 'force-dynamic'

export default async function LMSLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()

  return <LMSLayoutClient user={user}>{children}</LMSLayoutClient>
}
