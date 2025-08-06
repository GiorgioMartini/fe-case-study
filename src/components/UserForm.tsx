import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  userSchema,
  type UserFormData,
  getRoleOptions,
} from '../lib/validations';
import { FormItem, FormLabel, FormControl, FormMessage } from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';

interface UserFormProps {
  // Initial values for the form fields
  defaultValues: UserFormData;
  // Handler for form submission - receives the validated form data
  onSubmit: (data: UserFormData) => void;
  // Loading state to disable form during submission
  isSubmitting: boolean;
  // API error message to display
  apiError?: string;
  // Text for the submit button
  submitLabel: string;
  // Text for the cancel button (optional, defaults to "Cancel")
  cancelLabel?: string;
  // Handler for cancel button click
  onCancel: () => void;
}

export function UserForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  apiError,
  submitLabel,
  cancelLabel = 'Cancel',
  onCancel,
}: UserFormProps) {
  // Form setup with validation and default values
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  // Reset form when default values change (useful for edit mode when user data loads)
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Username Field */}
      <FormItem>
        <FormLabel htmlFor="username">Name</FormLabel>
        <FormControl>
          <Input
            id="username"
            {...register('username')}
            placeholder="Enter user name"
            disabled={isSubmitting}
          />
        </FormControl>
        {errors.username && (
          <FormMessage>{errors.username.message}</FormMessage>
        )}
      </FormItem>

      {/* Role Field */}
      <FormItem>
        <FormLabel htmlFor="role">Role</FormLabel>
        <FormControl>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                disabled={isSubmitting}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {getRoleOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormControl>
        {errors.role && <FormMessage>{errors.role.message}</FormMessage>}
      </FormItem>

      {/* API Error Display */}
      {apiError && (
        <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
          {apiError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      </div>
    </form>
  );
}
