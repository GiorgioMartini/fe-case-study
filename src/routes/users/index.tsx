import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../../store/auth';
import { useUsers } from '../../hooks/useUsers';
import { UsersList } from '../../components/UsersList';

export const Route = createFileRoute('/users/')({
  beforeLoad: async ({ location }) => {
    const { token } = useAuthStore.getState();
    console.log('token =>', token);
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
  component: UsersLayout,
});

function UsersLayout() {
  const { data: users, isLoading, isError, error: fetchError } = useUsers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg font-semibold">
            Failed to load users
          </div>
          <p className="text-muted-foreground">
            {fetchError?.message || 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  // This component now acts as a layout for all /users/* routes
  // The <Outlet /> will render the appropriate child route
  return (
    <div className="container mx-auto py-6 px-4">
      <Outlet />
      {/* Main users list - only show when no child route is active */}
      {users && <UsersList users={users} />}
    </div>
  );
}
