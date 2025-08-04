import { createFileRoute, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { useAuthStore } from '../store/auth';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with Tanstack
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      setToken(data.token);
      navigate({ to: '/users' });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormItem>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </FormItem>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button
            className="w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
