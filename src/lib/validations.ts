import { z } from 'zod';

// Shared validation schema for user forms
export const userSchema = z.object({
  username: z
    .string()
    .min(1, 'Name is required')
    .refine((name) => !name.toLowerCase().includes('test'), {
      message: "Name cannot contain 'test'",
    }),
  role: z.string().min(1, 'Role is required'),
});

export type UserFormData = z.infer<typeof userSchema>;
