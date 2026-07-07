import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireInstructor } from '@/lib/lms/utils'

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = parseCSVLine(lines[0])
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === 0 || values.every(v => !v.trim())) continue
    const row: Record<string, string> = {}
    headers.forEach((h, j) => { row[h.trim().toLowerCase()] = (values[j] || '').trim() })
    rows.push(row)
  }
  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current); current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

export async function POST(req: NextRequest) {
  try {
    await requireInstructor()

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const quizId = formData.get('quizId') as string | null

    if (!file || !quizId) {
      return NextResponse.json({ error: 'file and quizId are required' }, { status: 400 })
    }

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    const text = await file.text()
    const rows = parseCSV(text)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty or has no data rows' }, { status: 400 })
    }

    const validTypes = ['multiple_choice', 'true_false', 'short_answer', 'essay']
    const created: { question: string; type: string }[] = []
    const errors: { row: number; message: string }[] = []

    let maxOrder = await prisma.question.findFirst({
      where: { quizId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })
    let nextOrder = (maxOrder?.sortOrder ?? -1) + 1

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const type = (row.type || '').toLowerCase().replace(/\s+/g, '_')
      const question = row.question
      const correctAnswer = row.correctanswer ?? row.correct_answer ?? ''
      const points = parseInt(row.points || '1', 10)

      if (!validTypes.includes(type)) {
        errors.push({ row: i + 2, message: `Invalid type "${row.type}". Must be one of: ${validTypes.join(', ')}` })
        continue
      }
      if (!question) {
        errors.push({ row: i + 2, message: 'Question text is required' })
        continue
      }

      let options: string[] = []
      if (type === 'multiple_choice') {
        const optRaw = row.options || ''
        options = optRaw.split('|').map(s => s.trim()).filter(Boolean)
        if (options.length < 2) {
          errors.push({ row: i + 2, message: 'Multiple choice questions need at least 2 options (pipe-separated)' })
          continue
        }
      }

      await prisma.question.create({
        data: {
          quizId,
          type,
          question,
          options,
          correctAnswer,
          points: isNaN(points) ? 1 : points,
          sortOrder: nextOrder++,
        },
      })
      created.push({ question: question.substring(0, 80), type })
    }

    return NextResponse.json({
      created: created.length,
      errors,
      questions: created,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Quiz import error:', error)
    return NextResponse.json({ error: 'Failed to import quiz questions' }, { status: 500 })
  }
}
