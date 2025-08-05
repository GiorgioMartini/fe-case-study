import { z } from 'zod';

// Define valid user roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Display labels for roles (capitalized for UI)
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.USER]: 'User',
} as const;

// Get role options for select field
export const getRoleOptions = () => [
  { value: USER_ROLES.ADMIN, label: ROLE_LABELS[USER_ROLES.ADMIN] },
  { value: USER_ROLES.USER, label: ROLE_LABELS[USER_ROLES.USER] },
];

// Shared validation schema for user forms
export const userSchema = z.object({
  username: z
    .string()
    .min(1, 'Name is required')
    .refine((name) => !name.toLowerCase().includes('test'), {
      message: "Name cannot contain 'test'",
    }),
  role: z
    .string()
    .min(1, 'Role is required')
    .refine(
      (role): role is (typeof USER_ROLES)[keyof typeof USER_ROLES] =>
        Object.values(USER_ROLES).includes(
          role as (typeof USER_ROLES)[keyof typeof USER_ROLES]
        ),
      {
        message: 'Role must be either admin or user',
      }
    ),
});

export type UserFormData = z.infer<typeof userSchema>;
