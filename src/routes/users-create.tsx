import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useCreateUser } from '../hooks/useUsers';
import { UserForm } from '../components/UserForm';
import type { UserFormData } from '../lib/validations';

export const Route = createFileRoute('/users-create')({
  component: UserCreatePage,
});

function UserCreatePage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  // Stable default values for create form (empty strings)
  const defaultValues = useMemo(() => ({ username: '', role: '' }), []);

  // Handle form submission
  const handleSubmit = (data: UserFormData) => {
    createUserMutation.mutate(data);
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate({ to: '/users' });
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>

      <UserForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={createUserMutation.isPending}
        apiError={createUserMutation.error?.message}
        submitLabel={
          createUserMutation.isPending ? 'Creating...' : 'Create User'
        }
        onCancel={handleCancel}
      />
    </div>
  );
}
