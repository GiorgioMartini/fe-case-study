import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../store/auth';

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
  // This component now acts as a layout for all /users/* routes
  // The <Outlet /> will render the appropriate child route
  return <Outlet />;
}
