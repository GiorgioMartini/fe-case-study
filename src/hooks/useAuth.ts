import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { useNavigate } from '@tanstack/react-router';

// Login API function - separated for reusability and cleaner code
const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
};

export const useLogin = () => {
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Handle successful login
      console.log('Login successful! Token:', data.token);
      setToken(data.token);
      navigate({ to: '/users' });
    },
    onError: (error: Error) => {
      // Error handling is automatic with TanStack Query
      console.error('Login failed:', error.message);
    },
  });
};
