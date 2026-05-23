export type AcknowledgmentWeight = 'silent' | 'subtle' | 'standard' | 'weighty'

export interface AcknowledgmentDef {
  message: string | null
  weight: AcknowledgmentWeight
}

export const ACKNOWLEDGMENT_DURATION: Record<AcknowledgmentWeight, number> = {
  silent: 0,
  subtle: 2500,
  standard: 3500,
  weighty: 5000,
}

export const ACTION_ACKNOWLEDGMENTS: Record<string, AcknowledgmentDef> = {
  taskCreated: { message: 'operation acknowledged', weight: 'subtle' },
  taskEngaged: { message: null, weight: 'silent' },
  taskResolved: { message: 'operation resolved', weight: 'subtle' },
  tasksGenerated: { message: 'tasking sequence initiated', weight: 'standard' },
  taskDeleted: { message: null, weight: 'silent' },
  logSaved: { message: 'entry recorded', weight: 'subtle' },
  ctfLogged: { message: 'security event recorded', weight: 'subtle' },
  phaseTransition: { message: 'phase transition: cycle {n}', weight: 'weighty' },
  continuityRestored: { message: 'continuity restored', weight: 'standard' },
  pressureNormalizing: { message: 'pressure normalizing', weight: 'standard' },
  backlogCleared: { message: 'queue clear — continuity preserved', weight: 'standard' },
  error: { message: 'operational conflict detected', weight: 'standard' },
}
