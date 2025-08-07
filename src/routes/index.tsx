import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/auth';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  // Get the authentication token to check if user is logged in
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = !!token;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Hero Section with Big Humanoo Text */}
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
          Humanoo
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Welcome to your user management platform
        </p>
      </div>

      {/* Conditional Button based on login status */}
      <div className="flex gap-4">
        {isLoggedIn ? (
          // Show "Users" button if logged in
          <Link to="/users">
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-lg px-8 py-3 !text-black cursor-pointer"
            >
              Go to Users
            </Button>
          </Link>
        ) : (
          // Show "Login" button if not logged in
          <Link to="/login">
            <Button size="lg" className="bg-yellow-400 text-lg px-8 py-3">
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
