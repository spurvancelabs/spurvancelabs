import prisma from '@/lib/prisma'

export function projectKeyFromName(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean)
  const initials = words.map(word => word[0]).join('').toUpperCase()
  const fallback = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  return (initials || fallback || 'PROJ').slice(0, 10)
}

export async function getAvailableProjectKey(name: string, requestedKey?: string | null): Promise<string> {
  const base = (requestedKey || projectKeyFromName(name)).replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 10)
  if (!base) throw new Error('Unable to generate a project key from the project name')

  const existing = await prisma.project.findUnique({ where: { key: base }, select: { id: true } })
  if (!existing) return base

  for (let suffix = 2; suffix <= 99; suffix++) {
    const suffixText = String(suffix)
    const candidate = `${base.slice(0, 10 - suffixText.length)}${suffixText}`
    const conflict = await prisma.project.findUnique({ where: { key: candidate }, select: { id: true } })
    if (!conflict) return candidate
  }

  throw new Error('Unable to generate a unique project key. Please enter one manually.')
}
