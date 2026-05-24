import type { Command } from './types'

function fuzzyCharScore(query: string, target: string): number {
  if (!query) return 0
  const q = query.toLowerCase()
  const t = target.toLowerCase()

  if (t === q) return 100
  if (t.startsWith(q)) return 80
  if (t.includes(q)) return 60

  let qi = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++
  }
  if (qi === q.length) return 40 - (t.length - q.length)

  return 0
}

export interface ScoredCommand {
  command: Command
  score: number
}

const MIN_SCORE = 25

export function scoreCommand(query: string, command: Command): number {
  const titleScore = fuzzyCharScore(query, command.title)
  if (titleScore >= 80) return titleScore

  const keywordScore = command.keywords.reduce(
    (max, k) => Math.max(max, fuzzyCharScore(query, k) * 0.5),
    0
  )

  const descScore = fuzzyCharScore(query, command.description) * 0.3

  return Math.max(titleScore, keywordScore, descScore)
}

export function searchCommands(query: string, commands: Command[]): ScoredCommand[] {
  if (!query.trim()) {
    return commands.map(c => ({ command: c, score: 0 }))
  }

  return commands
    .map(c => ({ command: c, score: scoreCommand(query, c) }))
    .filter(s => s.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
}
