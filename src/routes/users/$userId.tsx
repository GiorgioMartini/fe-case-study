import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useUser, useUpdateUser } from '../../hooks/useUsers';
import {
  userSchema,
  type UserFormData,
  getRoleOptions,
} from '../../lib/validations';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/auth';

export const Route = createFileRoute('/users/$userId')({
  beforeLoad: async ({ location }) => {
    // Check if user is authenticated by checking if token exists
    const { token } = useAuthStore.getState();
    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          // Use current location to power redirect after login
          redirect: location.href,
        },
      });
    }
  },
  component: UserEditPage,
});

function UserEditPage() {
  const navigate = useNavigate();
  const { userId } = Route.useParams();

  // React Query hooks - called first, always
  const { data: user, isLoading, isError, error: fetchError } = useUser(userId);
  const updateUserMutation = useUpdateUser();

  // Form setup - called always, with empty defaults initially
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      role: '',
    },
  });

  // Simple: reset form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        role: user.role,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UserFormData) => {
    updateUserMutation.mutate({ userId, userData: data });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  // Error state (user not found)
  if (isError) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3 mb-4">
          {fetchError?.message || 'User not found'}
        </div>
        <Button variant="outline" onClick={() => navigate({ to: '/users' })}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <FormItem>
          <FormLabel htmlFor="username">Name</FormLabel>
          <FormControl>
            <Input
              id="username"
              {...register('username')}
              placeholder="Enter user name"
              disabled={updateUserMutation.isPending}
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
              render={({ field }) => {
                // Only render Select after user data is loaded and field has value
                if (!user || !field.value) {
                  return (
                    <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground">
                      Select a role
                    </div>
                  );
                }

                return (
                  <Select
                    disabled={updateUserMutation.isPending}
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
                );
              }}
            />
          </FormControl>
          {errors.role && <FormMessage>{errors.role.message}</FormMessage>}
        </FormItem>

        {/* API Error Display */}
        {updateUserMutation.isError && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-3">
            {updateUserMutation.error?.message || 'Failed to update user'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={updateUserMutation.isPending}>
            {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/users' })}
            disabled={updateUserMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
