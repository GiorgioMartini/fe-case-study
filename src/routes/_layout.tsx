import { createFileRoute, Outlet } from '@tanstack/react-router';
// TODO: Implement route protection here (redirect to /login if not authenticated)
// You can use Zustand store (src/store/auth.ts) for auth state
export const Route = createFileRoute('/_layout')({
  component: () => <Outlet />,
});
