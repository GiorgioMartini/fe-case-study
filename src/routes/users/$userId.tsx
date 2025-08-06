import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useUser, useUpdateUser } from '../../hooks/useUsers';
import { UserForm } from '../../components/UserForm';
import type { UserFormData } from '../../lib/validations';
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

  // React Query hooks for data fetching and mutation
  const { data: user, isLoading, isError, error: fetchError } = useUser(userId);
  const updateUserMutation = useUpdateUser();

  // Stable default values for edit form
  const defaultValues = useMemo(
    () =>
      user
        ? { username: user.username, role: user.role }
        : { username: '', role: '' },
    [user]
  );

  // Handle form submission
  const handleSubmit = (data: UserFormData) => {
    updateUserMutation.mutate({ userId, userData: data });
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate({ to: '/users' });
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
        <Button variant="outline" onClick={handleCancel}>
          Back to Users
        </Button>
      </div>
    );
  }

  // Main edit form
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      <UserForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={updateUserMutation.isPending}
        apiError={updateUserMutation.error?.message}
        submitLabel={
          updateUserMutation.isPending ? 'Updating...' : 'Update User'
        }
        onCancel={handleCancel}
      />
    </div>
  );
}
