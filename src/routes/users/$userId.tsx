import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useUser, useUpdateUser } from '../../hooks/useUsers';
import { userSchema, type UserFormData } from '../../lib/validations';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/auth';

// export const Route = createFileRoute('/users/$userId')({
//   component: UserEditPage,
// });

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

  // React Query hooks
  const { data: user, isLoading, isError, error: fetchError } = useUser(userId);
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Pre-populate form when user data is loaded
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
            <Input
              id="role"
              {...register('role')}
              placeholder="Enter user role (e.g., admin, user)"
              disabled={updateUserMutation.isPending}
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
