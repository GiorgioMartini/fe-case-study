import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/users-create')({
  component: UserCreatePage,
});

function UserCreatePage() {
  // TODO: Implement user creation form with validation (use shadcn/ui components)
  // TODO: Submit form to API and handle errors
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <p className="text-muted-foreground">User creation form coming soon...</p>
    </div>
  );
}
