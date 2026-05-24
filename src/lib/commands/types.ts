export type CommandCategory = 'navigation' | 'creation' | 'action'

export interface Command {
  id: string
  title: string
  description: string
  category: CommandCategory
  keywords: string[]
}
