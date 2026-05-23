export const TERM_MAP = {
  dashboard: 'Briefing',
  tasks: 'Operations',
  task: 'Operation',
  streaks: 'Continuity',
  streak: 'Continuity',
  xp: 'Domain Value',
  learningLog: 'Session Log',
  ctfTracker: 'Security Log',
  insights: 'Operational Intel',
  todaysFocus: 'Primary Objective',
  pillarProgress: 'Domain Distribution',
  newTask: 'Initiate Operation',
  generateMission: 'Generate Tasking',
  importRoadmap: 'Load Blueprint',
  viewRoadmap: 'Strategic View',
  home: 'Briefing',
  roadmap: 'Strategic Roadmap',
  currentPhase: 'Active Phase',
  focusAreas: 'Objectives',
  keyDeliverables: 'Required Outputs',
  yearProgress: 'Cycle Progress',
  daysRemaining: 'Remaining in Cycle',
} as const;

export const TASK_STATUS_LABELS = {
  todo: 'Pending',
  in_progress: 'Engaged',
  done: 'Resolved',
  abandoned: 'Archived',
} as const;

export const TASK_STATUS_ACTIONS = {
  todo: 'Engage',
  in_progress: 'Resolve',
  done: null,
  abandoned: null,
} as const;

export const PRIORITY_LABELS = {
  high: 'Priority',
  medium: 'Standard',
  low: 'Background',
} as const;

export const SUBSYSTEM_IDENTITY = [
  {
    id: 'MISSION-SYS-01',
    label: 'mission-console',
    name: 'Mission Subsystem',
    glyph: '◇',
    bootMessage: 'Initializing mission subsystems',
    operationalSignature: 'M-SYS',
    stateMarkers: { idle: '○', active: '◐', focused: '◆' },
  },
  {
    id: 'MENTOR-SYS-02',
    label: 'mentor-subsystem',
    name: 'Mentor Subsystem',
    glyph: '○',
    bootMessage: 'Linking mentor interface',
    operationalSignature: 'MN-SYS',
    stateMarkers: { idle: '○', active: '◐', focused: '◆' },
  },
  {
    id: 'ROADMAP-SYS-03',
    label: 'roadmap-status',
    name: 'Roadmap Subsystem',
    glyph: '◈',
    bootMessage: 'Syncing strategic roadmap',
    operationalSignature: 'RM-SYS',
    stateMarkers: { idle: '○', active: '◐', focused: '◆' },
  },
  {
    id: 'TELEM-SYS-04',
    label: 'system-telemetry',
    name: 'Telemetry Subsystem',
    glyph: '●',
    bootMessage: 'Calibrating telemetry sensors',
    operationalSignature: 'TL-SYS',
    stateMarkers: { idle: '○', active: '◐', focused: '◆' },
  },
] as const;

export const BOOT_RITUAL = {
  init: { text: 'ERA-OS', duration: 600 },
  systemCheck: { text: 'Running system integrity check', duration: 800 },
  subsystems: { text: 'Initializing subsystems', duration: 200 },
  handshake: { text: 'Establishing subsystem links', duration: 900 },
  environment: { text: 'Calibrating operational environment', duration: 1200 },
  operational: { text: 'OPERATIONAL', duration: 1500 },
} as const;

export const OPERATIONAL_STATES = {
  calm: {
    label: 'Operational Clarity',
    description: 'Low pressure, high bandwidth',
    tension: 'low',
    compression: 'minimal',
    signature: '⟡',
  },
  normal: {
    label: 'Standard Operations',
    description: 'Baseline operational state',
    tension: 'moderate',
    compression: 'nominal',
    signature: '●',
  },
  tense: {
    label: 'Compression',
    description: 'Elevated pressure, reduced bandwidth',
    tension: 'elevated',
    compression: 'increasing',
    signature: '▲',
  },
  critical: {
    label: 'Saturation Risk',
    description: 'Capacity limits approaching',
    tension: 'high',
    compression: 'severe',
    signature: '■',
  },
  momentum: {
    label: 'Flow State',
    description: 'Aligned execution cadence',
    tension: 'low',
    compression: 'minimal',
    signature: '⟡',
  },
  fatigue: {
    label: 'Depletion',
    description: 'Reduced operational capacity',
    tension: 'moderate',
    compression: 'accumulating',
    signature: '▽',
  },
  overload: {
    label: 'Saturation',
    description: 'Capacity exceeded',
    tension: 'high',
    compression: 'critical',
    signature: '■',
  },
} as const;

export const PERSISTENCE_MESSAGES = {
  returnVisit: 'Session continuity established',
  offline: 'Operations continuing in local mode',
  reconnected: 'Link restored — synchronizing',
  continuity: 'Operational continuity maintained',
  cycleResumed: 'Cycle resumed',
} as const;

export const INITIALIZATION_SIGNATURE = 'init-seq-' as const;
