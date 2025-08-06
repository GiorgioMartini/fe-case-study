import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../../store/auth';
import { useUsers } from '../../hooks/useUsers';

export const Route = createFileRoute('/users')({
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
  component: UsersLayout,
});

function UsersLayout() {
  const { data: users, isLoading, isError, error: fetchError } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {fetchError.message}</div>;

  // This component now acts as a layout for all /users/* routes
  // The <Outlet /> will render the appropriate child route
  return (
    <>
      <Outlet />
      <div>
        {users?.map((user) => (
          <div key={user.id}>{user.username}</div>
        ))}
      </div>
    </>
  );
}
