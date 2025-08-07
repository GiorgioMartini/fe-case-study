import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { api } from '../api';
import { useUsers, useUser, useCreateUser, useUpdateUser } from './useUsers';
import { createHookWrapper } from '../test/test-utils';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

const mockUsers = [
  {
    id: 1,
    username: 'admin',
    role: 'admin',
  },
  {
    id: 2,
    username: 'customer',
    role: 'user',
  },
];

const mockCreatedUser = {
  id: 3,
  username: 'New User',
  role: 'user',
};

vi.mock('../api', () => ({
  api: {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    getUser: vi.fn(),
  },
}));

describe('useUsers hook', () => {
  it('should return users', async () => {
    vi.mocked(api.getUsers).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createHookWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUsers);
    });
  });
});

describe('useUser hook', () => {
  it('should return a single user', async () => {
    const userId = '1';
    const mockUser = mockUsers[0];
    vi.mocked(api.getUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(userId), {
      wrapper: createHookWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUser);
    });
  });
});

describe('useCreateUser hook', () => {
  it('should create a user when mutate is called', async () => {
    vi.mocked(api.createUser).mockResolvedValue(mockCreatedUser);

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createHookWrapper(),
    });

    result.current.mutate({ username: 'New User', role: 'user' });

    await waitFor(() => {
      expect(api.createUser).toHaveBeenCalledWith({
        username: 'New User',
        role: 'user',
      });
    });
  });
});

describe('useUpdateUser hook', () => {
  it('should update a user when mutate is called', async () => {
    const updatedUser = { ...mockUsers[0], username: 'Updated Name' };
    vi.mocked(api.updateUser).mockResolvedValue(updatedUser);

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createHookWrapper(),
    });

    result.current.mutate({
      userId: '1',
      userData: { username: 'Updated Name' },
    });

    await waitFor(() => {
      expect(api.updateUser).toHaveBeenCalledWith('1', {
        username: 'Updated Name',
      });
    });
  });
});
