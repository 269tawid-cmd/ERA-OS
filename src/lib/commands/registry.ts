import type { Command } from './types'

export const COMMANDS: Command[] = [
  {
    id: 'nav-dashboard',
    title: 'Go to Dashboard',
    description: 'Return to operational briefing',
    category: 'navigation',
    keywords: ['home', 'briefing', 'main', 'overview', 'hub'],
  },
  {
    id: 'nav-roadmap',
    title: 'Open Roadmap',
    description: 'View strategic roadmap phases',
    category: 'navigation',
    keywords: ['phases', 'strategy', 'plan', 'months', 'progression'],
  },
  {
    id: 'nav-import',
    title: 'Import Blueprint',
    description: 'Load a roadmap blueprint',
    category: 'navigation',
    keywords: ['upload', 'load', 'blueprint', 'schema', 'ingest'],
  },
  {
    id: 'create-task',
    title: 'Create Task',
    description: 'Initiate a new operation task',
    category: 'creation',
    keywords: ['operation', 'new', 'add', 'todo', 'task', 'action item'],
  },
  {
    id: 'create-log',
    title: 'New Learning Log',
    description: 'Record a session log entry',
    category: 'creation',
    keywords: ['journal', 'note', 'session', 'learning', 'log', 'record'],
  },
  {
    id: 'create-ctf',
    title: 'New CTF Entry',
    description: 'Log a security challenge solve',
    category: 'creation',
    keywords: ['challenge', 'capture the flag', 'security', 'hack', 'solve'],
  },
  {
    id: 'generate-tasking',
    title: 'Generate Tasking',
    description: 'Auto-generate tasks from current roadmap phase',
    category: 'action',
    keywords: ['generate', 'auto', 'mission', 'tasks', 'populate', 'roadmap tasks'],
  },
  {
    id: 'advance-phase',
    title: 'Advance Phase',
    description: 'Progress to next roadmap month',
    category: 'action',
    keywords: ['next', 'progress', 'month', 'advance', 'cycle', 'phase up'],
  },
]

export type CommandHandlerMap = Record<string, () => void | Promise<void>>
