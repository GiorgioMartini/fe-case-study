import { createFileRoute, redirect } from '@tanstack/react-router';
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
  component: UsersListPage,
});

function UsersListPage() {
  // TODO: Fetch users from API using TanStack Query
  // TODO: Display users in a table using shadcn/ui components
  // TODO: Add actions for edit and delete
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <p className="text-muted-foreground">Users list coming soon...</p>
    </div>
  );
}
