import type { MonthlyRoadmap } from '@/types';

export const YEAR1_ROADMAP: MonthlyRoadmap[] = [
  {
    month: 1,
    title: 'Linux Fundamentals',
    focus: [
      'CLI fluency',
      'File system mastery',
      'Basic commands (ls, cd, cat, grep, find, chmod, chown)',
      'Package management (apt, yum)',
      'User and group management',
    ],
    deliverables: [
      'Navigate Linux file system without GUI',
      'Write a bash script for automation',
      'Manage file permissions',
    ],
    suggested_tasks: [
      'Complete Linux basics on TryHackMe',
      'Create a directory structure for notes',
      'Write a backup script',
    ],
  },
  {
    month: 2,
    title: 'Networking + Python Basics',
    focus: [
      'TCP/IP model',
      'OSI model layers',
      'IP addressing and subnetting',
      'DNS, HTTP, HTTPS protocols',
      'Python fundamentals',
    ],
    deliverables: [
      'Understand network layers and protocols',
      'Write a Python script for network scanning',
      'Set up a lab environment',
    ],
    suggested_tasks: [
      'Complete Networking TryHackMe path',
      'Write a port scanner in Python',
      'Set up VirtualBox with Kali Linux',
    ],
  },
  {
    month: 3,
    title: 'Linux Deep Dive',
    focus: [
      'Advanced file permissions',
      'Process management',
      'Bash scripting',
      'Cron jobs',
      'Systemd services',
      'Log analysis',
    ],
    deliverables: [
      'Write complex bash scripts',
      'Automate daily tasks with cron',
      'Analyze system logs',
    ],
    suggested_tasks: [
      'Write a log monitoring script',
      'Create a system health check script',
      'Automate file organization with bash',
    ],
  },
  {
    month: 4,
    title: 'OWASP Top 10 + DVWA',
    focus: [
      'OWASP Top 10 (2021)',
      'DVWA setup and exercises',
      'SQL Injection',
      'Cross-Site Scripting (XSS)',
      'Broken Access Control',
      'Security Misconfiguration',
    ],
    deliverables: [
      'Complete all DVWA modules',
      'Document each vulnerability found',
      'Write remediation notes',
    ],
    suggested_tasks: [
      'Set up DVWA locally',
      'Complete SQLi labs in DVWA',
      'Practice XSS payloads',
    ],
  },
  {
    month: 5,
    title: 'Burp Suite',
    focus: [
      'Burp Suite interface',
      'Proxy configuration',
      'Repeater usage',
      'Intruder basics',
      'Spider and crawler',
      'Decoder tool',
    ],
    deliverables: [
      'Intercept and modify requests',
      'Automate attacks with Intruder',
      'Decode various encodings',
    ],
    suggested_tasks: [
      'Complete Burp Suite TryHackMe path',
      'Practice on DVWA with Burp',
      'Build custom wordlists',
    ],
  },
  {
    month: 6,
    title: 'Project Security',
    focus: [
      'Security audit methodology',
      'Source code review',
      'Documentation writing',
      'MMS-Ar-Rashid security review',
      'Report writing',
    ],
    deliverables: [
      'Complete security audit of MMS-Ar-Rashid',
      'Write formal security report',
      'Provide remediation recommendations',
    ],
    suggested_tasks: [
      'Review MMS-Ar-Rashid codebase for vulnerabilities',
      'Create a security checklist',
      'Write findings report',
    ],
  },
  {
    month: 7,
    title: 'Python Security Tools',
    focus: [
      'Python for security',
      'Building recon tools',
      'Web scrapers',
      'API interaction',
      'Automation scripts',
    ],
    deliverables: [
      'Build a recon tool',
      'Create an automated scanner',
      'Script common attack patterns',
    ],
    suggested_tasks: [
      'Build a subdomain enumerator',
      'Create a directory busting tool',
      'Write an API vulnerability scanner',
    ],
  },
  {
    month: 8,
    title: 'CTF Season',
    focus: [
      'PicoCTF challenges',
      'HackTheBox challenges',
      'CTF problem solving',
      'Flag hunting techniques',
      'Time management',
    ],
    deliverables: [
      'Solve 5+ CTF challenges',
      'Complete PicoCTF beginner path',
      'Document writeups',
    ],
    suggested_tasks: [
      'Complete PicoCTF 2024 challenges',
      'Solve HackTheBox Easy boxes',
      'Write CTF writeups',
    ],
  },
  {
    month: 9,
    title: 'TryHackMe Jr Pentester',
    focus: [
      'Jr Pentester learning path',
      'Reconnaissance',
      'Enumeration',
      'Vulnerability scanning',
      'Exploitation basics',
    ],
    deliverables: [
      'Complete Jr Pentester path',
      'Practice on vulnerable machines',
      'Build methodology notes',
    ],
    suggested_tasks: [
      'Complete TryHackMe Jr Pentester path',
      'Practice on designated vulnerable boxes',
      'Create a personal methodology doc',
    ],
  },
  {
    month: 10,
    title: 'Nmap + Enumeration',
    focus: [
      'Nmap advanced usage',
      'Port enumeration',
      'Service detection',
      'OS fingerprinting',
      'NSE scripts',
      'Network mapping',
    ],
    deliverables: [
      'Master Nmap advanced flags',
      'Create NSE scripts',
      'Build enumeration methodology',
    ],
    suggested_tasks: [
      'Complete Nmap advanced course',
      'Write custom NSE scripts',
      'Practice on network scan challenges',
    ],
  },
  {
    month: 11,
    title: 'Metasploit + Privesc',
    focus: [
      'Metasploit framework',
      'Exploit modules',
      'Meterpreter usage',
      'Privilege escalation techniques',
      'Post-exploitation',
    ],
    deliverables: [
      'Complete Metasploit labs',
      'Document privesc techniques',
      'Build a lab environment',
    ],
    suggested_tasks: [
      'Complete Metasploit TryHackMe path',
      'Practice Linux privesc techniques',
      'Create privesc checklist',
    ],
  },
  {
    month: 12,
    title: 'Consolidation',
    focus: [
      'Review all Year 1 topics',
      'Write English blog post',
      'eJPT preparation',
      'Gap analysis',
      'Plan Year 2',
    ],
    deliverables: [
      'Write a blog post in English',
      'Complete eJPT practice exam',
      'Create Year 2 plan',
    ],
    suggested_tasks: [
      'Write security blog post',
      'Take eJPT practice test',
      'Review and document Year 1 learnings',
    ],
  },
];

export const YEAR1_MILESTONES = [
  { month: 3, name: 'Linux Basic', description: 'Complete Linux fundamentals' },
  { month: 6, name: 'Web Security Foundation', description: 'Complete OWASP + DVWA' },
  { month: 9, name: 'Jr Pentester Path', description: 'Complete TryHackMe Jr Pentester' },
  { month: 12, name: 'Year 1 Complete', description: 'Finish first year of journey' },
];