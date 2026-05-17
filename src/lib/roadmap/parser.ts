export interface ParsedMonth {
  month: number;
  title: string;
  raw_content: string;
  focus_areas: string[];
  deliverables: string[];
  suggested_tasks: string[];
  lines: string[];
}

export interface ParsedRoadmap {
  title: string;
  description: string;
  year: number;
  months: ParsedMonth[];
  raw_input: string;
}

export interface ParseError {
  line?: number;
  message: string;
  severity: 'warning' | 'error';
}

export interface ParseResult {
  success: boolean;
  roadmap: ParsedRoadmap | null;
  errors: ParseError[];
  warnings: string[];
}

export interface ParsingConfidence {
  overall: number;
  title_confidence: number;
  month_confidence: number;
  task_confidence: number;
  formatting_score: number;
}

export function calculateParsingConfidence(roadmap: ParsedRoadmap, warnings: string[]): ParsingConfidence {
  const errors = warnings.filter(w => w.toLowerCase().includes('error'));
  
  let title_confidence = 0;
  if (roadmap.title && roadmap.title !== 'Untitled Roadmap') {
    title_confidence = roadmap.title.length > 5 ? 0.9 : 0.7;
  }
  
  let month_confidence = 0;
  if (roadmap.months.length > 0) {
    const hasConsecutiveMonths = roadmap.months.every((m, i) => 
      i === 0 || m.month === roadmap.months[i - 1].month + 1
    );
    month_confidence = hasConsecutiveMonths ? 0.95 : 0.75;
  }
  
  let task_confidence = 0;
  const totalTasks = roadmap.months.reduce((sum, m) => 
    sum + m.focus_areas.length + m.suggested_tasks.length, 0
  );
  if (totalTasks > 0) {
    const avgTasksPerMonth = totalTasks / roadmap.months.length;
    task_confidence = avgTasksPerMonth >= 2 ? 0.9 : 0.7;
  }
  
  let formatting_score = 1.0;
  const hasMarkdownHeaders = roadmap.raw_input.includes('#');
  const hasBulletPoints = roadmap.raw_input.includes('-') || roadmap.raw_input.includes('*');
  const hasNumbers = /\d+\./.test(roadmap.raw_input);
  
  if (hasMarkdownHeaders) formatting_score += 0.1;
  if (hasBulletPoints) formatting_score += 0.2;
  if (hasNumbers) formatting_score += 0.1;
  
  formatting_score = Math.min(1.0, formatting_score);
  
  const overall = (title_confidence * 0.2 + month_confidence * 0.3 + task_confidence * 0.3 + formatting_score * 0.2) * (1 - errors.length * 0.1);
  
  return {
    overall: Math.round(overall * 100),
    title_confidence: Math.round(title_confidence * 100),
    month_confidence: Math.round(month_confidence * 100),
    task_confidence: Math.round(task_confidence * 100),
    formatting_score: Math.round(formatting_score * 100),
  };
}

const MONTH_PATTERNS = [
  /^month\s*(\d+)/i,
  /^m\s*(\d+)/i,
  /^#?\s*(\d+)\s*[:.\-]/,
  /^phase\s*(\d+)/i,
  /^week\s*(\d+)/i,
  /^day\s*(\d+)/i,
  /^(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d+)?/i,
  /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d+)?/i,
  /^(\d+)\s*[:.\-]/,
  /^(\d+)[\.\)]\s*/,
];

function isMonthHeader(line: string): number | null {
  for (const pattern of MONTH_PATTERNS) {
    const match = line.match(pattern);
    if (match) {
      const month = parseInt(match[1] || match[2], 10);
      if (month >= 1 && month <= 48) {
        return month;
      }
    }
  }
  return null;
}

function extractTitle(line: string): string {
  return line
    .replace(/^#+\s*/, '')
    .replace(/^month\s*\d+\s*[:.\-]?\s*/i, '')
    .replace(/^m\d+\s*[:.\-]?\s*/i, '')
    .replace(/^phase\s*\d+\s*[:.\-]?\s*/i, '')
    .replace(/^\d+\s*[:.\-]\s*/, '')
    .replace(/\s*[:.\-]\s*$/, '')
    .trim();
}

function isListItem(line: string): boolean {
  return /^[\s]*[-*+]\s/.test(line) || 
         /^[\s]*\d+[\.\)]\s/.test(line) ||
         /^[\s]*[›•→]\s/.test(line) ||
         /^[\s]*>\s/.test(line);
}

function cleanListItem(line: string): string {
  return line
    .replace(/^[\s]*[-*+]\s*/, '')
    .replace(/^[\s]*\d+[\.\)]\s*/, '')
    .replace(/^[\s]*[›•→]\s*/, '')
    .replace(/^[\s]*>\s*/, '')
    .trim();
}

function isFocusKeyword(line: string): boolean {
  const focusPatterns = [
    /focus[:\s]/i,
    /learning[:\s]/i,
    /topics[:\s]/i,
    /areas[:\s]/i,
    /concepts[:\s]/i,
    /skills[:\s]/i,
  ];
  return focusPatterns.some(p => p.test(line));
}

function isDeliverableKeyword(line: string): boolean {
  const deliverablePatterns = [
    /deliverable/i,
    /outcome/i,
    /result/i,
    /goal/i,
    /milestone/i,
    /you\s+will/i,
    /by\s+the\s+end/i,
  ];
  return deliverablePatterns.some(p => p.test(line));
}

function isTaskKeyword(line: string): boolean {
  const taskPatterns = [
    /task/i,
    /exercise/i,
    /practice/i,
    /activity/i,
    /action/i,
    /do\s+this/i,
    /try\s+this/i,
    /complete/i,
  ];
  return taskPatterns.some(p => p.test(line));
}

export function parseRoadmap(input: string): ParseResult {
  const errors: ParseError[] = [];
  const warnings: string[] = [];
  
  if (!input || input.trim().length === 0) {
    return {
      success: false,
      roadmap: null,
      errors: [{ message: 'Empty input', severity: 'error' }],
      warnings: [],
    };
  }
  
  const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length < 3) {
    warnings.push('Roadmap seems very short. Consider adding more details.');
  }
  
  const months: ParsedMonth[] = [];
  let currentMonth: ParsedMonth | null = null;
  let currentSection: 'title' | 'focus' | 'deliverables' | 'tasks' | 'general' = 'general';
  
  const titleMatch = input.match(/^#\s+(.+)$/m) || input.match(/^(.+?)[\n\r]/);
  const roadmapTitle = titleMatch ? extractTitle(titleMatch[1]) : 'Untitled Roadmap';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('#') && !trimmedLine.match(/^##/)) {
      continue;
    }
    
    const monthNum = isMonthHeader(trimmedLine);
    if (monthNum !== null) {
      if (currentMonth) {
        months.push(currentMonth);
      }
      
      const title = extractTitle(trimmedLine) || `Month ${monthNum}`;
      currentMonth = {
        month: monthNum,
        title,
        raw_content: trimmedLine,
        focus_areas: [],
        deliverables: [],
        suggested_tasks: [],
        lines: [],
      };
      currentSection = 'general';
      continue;
    }
    
    if (!currentMonth) {
      if (isListItem(trimmedLine)) {
        warnings.push(`Line ${i + 1}: Found list items before any month header. Starting first month.`);
        currentMonth = {
          month: 1,
          title: 'Month 1',
          raw_content: '',
          focus_areas: [],
          deliverables: [],
          suggested_tasks: [],
          lines: [],
        };
      } else {
        continue;
      }
    }
    
    currentMonth.lines.push(trimmedLine);
    
    if (isListItem(trimmedLine)) {
      const item = cleanListItem(trimmedLine);
      
      if (item.length < 3) {
        warnings.push(`Line ${i + 1}: Very short list item, may be noise.`);
        continue;
      }
      
      if (currentSection === 'focus' || isFocusKeyword(trimmedLine.replace(cleanListItem(trimmedLine), ''))) {
        currentMonth.focus_areas.push(item);
      } else if (currentSection === 'deliverables' || isDeliverableKeyword(trimmedLine.replace(cleanListItem(trimmedLine), ''))) {
        currentMonth.deliverables.push(item);
      } else if (currentSection === 'tasks' || isTaskKeyword(trimmedLine.replace(cleanListItem(trimmedLine), ''))) {
        currentMonth.suggested_tasks.push(item);
      } else {
        const lower = item.toLowerCase();
        if (lower.includes('learn') || lower.includes('understand') || lower.includes('master')) {
          currentMonth.focus_areas.push(item);
        } else if (lower.includes('build') || lower.includes('create') || lower.includes('complete')) {
          currentMonth.deliverables.push(item);
        } else if (lower.includes('try') || lower.includes('practice') || lower.includes('do')) {
          currentMonth.suggested_tasks.push(item);
        } else {
          currentMonth.focus_areas.push(item);
        }
      }
    } else if (trimmedLine.match(/^##?\s*(focus|topics|learning)/i)) {
      currentSection = 'focus';
    } else if (trimmedLine.match(/^##?\s*(deliverable|outcome|goal)/i)) {
      currentSection = 'deliverables';
    } else if (trimmedLine.match(/^##?\s*(task|exercise|practice)/i)) {
      currentSection = 'tasks';
    } else if (isFocusKeyword(trimmedLine)) {
      currentSection = 'focus';
    } else if (isDeliverableKeyword(trimmedLine)) {
      currentSection = 'deliverables';
    } else if (isTaskKeyword(trimmedLine)) {
      currentSection = 'tasks';
    }
  }
  
  if (currentMonth) {
    months.push(currentMonth);
  }
  
  if (months.length === 0) {
    return {
      success: false,
      roadmap: null,
      errors: [{ message: 'No months found in roadmap. Use "Month 1\", "Month 2\" headers.', severity: 'error' }],
      warnings,
    };
  }
  
  const sortedMonths = months.sort((a, b) => a.month - b.month);
  
  let expectedMonth = sortedMonths[0].month;
  for (let i = 0; i < sortedMonths.length; i++) {
    if (sortedMonths[i].month !== expectedMonth) {
      warnings.push(`Month numbering gap detected: expected ${expectedMonth}, found ${sortedMonths[i].month}. Reordered.`);
      sortedMonths[i].month = expectedMonth;
    }
    expectedMonth++;
  }
  
  for (const month of sortedMonths) {
    if (month.focus_areas.length === 0 && month.suggested_tasks.length === 0) {
      warnings.push(`Month ${month.month} has no content. Consider adding focus areas or tasks.`);
    }
  }
  
  return {
    success: true,
    roadmap: {
      title: roadmapTitle,
      description: `Year 1: ${roadmapTitle}`,
      year: 1,
      months: sortedMonths,
      raw_input: input,
    },
    errors,
    warnings,
  };
}

export function validateParsedRoadmap(roadmap: ParsedRoadmap): ParseError[] {
  const errors: ParseError[] = [];
  
  if (!roadmap.title || roadmap.title === 'Untitled Roadmap') {
    errors.push({ message: 'Roadmap should have a clear title', severity: 'warning' });
  }
  
  if (roadmap.months.length === 0) {
    errors.push({ message: 'Roadmap has no months defined', severity: 'error' });
  }
  
  if (roadmap.months.length > 12) {
    errors.push({ message: 'Roadmap has more than 12 months. Consider splitting into years.', severity: 'warning' });
  }
  
  for (const month of roadmap.months) {
    if (month.focus_areas.length === 0 && month.suggested_tasks.length === 0) {
      errors.push({ 
        message: `Month ${month.month}: No content. Add focus areas or tasks.`, 
        severity: 'warning' 
      });
    }
    
    if (month.title === `Month ${month.month}` && month.focus_areas.length === 0) {
      errors.push({
        message: `Month ${month.month}: No title or focus defined`,
        severity: 'warning'
      });
    }
    
    for (const task of month.suggested_tasks) {
      if (task.length < 5) {
        errors.push({
          message: `Month ${month.month}: Task "${task}" seems too short`,
          severity: 'warning'
        });
      }
    }
  }
  
  return errors;
}