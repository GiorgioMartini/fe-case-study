import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { api, type User } from '../api';

// Query keys for consistent cache management
export const userKeys = {
  all: ['users'] as const,
  detail: (id: string | number) => ['users', id] as const,
};

// Hook for fetching all users
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: api.getUsers,
  });
};

// Hook for fetching a single user
export const useUser = (userId: string | number) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => api.getUser(userId),
    enabled: !!userId, // Only run if userId exists
  });
};

// Hook for creating a user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      // Navigate back to users list
      navigate({ to: '/users' });
    },
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string | number;
      userData: Partial<Omit<User, 'id'>>;
    }) => api.updateUser(userId, userData),
    onSuccess: (_, { userId }) => {
      // Invalidate both the users list and the specific user cache
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      // Navigate back to users list
      navigate({ to: '/users' });
    },
  });
};
