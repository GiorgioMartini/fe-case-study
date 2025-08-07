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
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-8 rounded-lg shadow-lg border-0"
      >
        {/* Username Field */}
        <FormItem className="space-y-3">
          <FormLabel
            htmlFor="username"
            className="text-lg font-semibold text-gray-900"
          >
            Name
          </FormLabel>
          <FormControl>
            <Input
              id="username"
              {...register('username')}
              placeholder="Enter user name"
              disabled={isSubmitting}
              className="h-12 text-lg px-4 border-2 border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all"
            />
          </FormControl>
          {errors.username && (
            <FormMessage className="text-red-600 font-medium">
              {errors.username.message}
            </FormMessage>
          )}
        </FormItem>

        {/* Role Field */}
        <FormItem className="space-y-3">
          <FormLabel
            htmlFor="role"
            className="text-lg font-semibold text-gray-900"
          >
            Role
          </FormLabel>
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
                  <SelectTrigger className="h-12 text-lg px-4 border-2 border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="text-lg">
                    {getRoleOptions().map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-lg py-3"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormControl>
          {errors.role && (
            <FormMessage className="text-red-600 font-medium">
              {errors.role.message}
            </FormMessage>
          )}
        </FormItem>

        {/* API Error Display */}
        {apiError && (
          <div className="text-red-700 text-base bg-red-50 border-2 border-red-200 rounded-lg p-4 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              {apiError}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 !text-black font-semibold h-12 px-8 text-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : submitLabel}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-12 px-8 text-lg font-medium border-2 border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
          >
            {cancelLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
