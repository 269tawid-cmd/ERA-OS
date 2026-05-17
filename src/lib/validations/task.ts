import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  pillar: z.enum(['HACK', 'BUILD', 'AI', 'PRESENCE']),
  month: z.number().int().min(1).max(48),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['todo', 'in_progress', 'done', 'abandoned']).default('todo'),
  xp_value: z.number().int().min(1).max(100).default(10),
  due_date: z.string().optional(),
  is_recurring: z.boolean().default(false),
  recurrence: z.enum(['daily', 'weekly']).optional(),
});

export const createTaskSchema = taskSchema.omit({ status: true, xp_value: true });

export const updateTaskSchema = taskSchema.partial().extend({
  id: z.string().uuid('Invalid task ID'),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;