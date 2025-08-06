import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../test/test-utils';

const createMockUseLogin = (overrides = {}) => ({
  mutate: vi.fn(),
  isPending: false,
  error: null,
  data: undefined,
  variables: undefined,
  isError: false,
  isIdle: true,
  isSuccess: false,
  status: 'idle' as const,
  mutateAsync: vi.fn(),
  reset: vi.fn(),
  ...overrides,
});

vi.mock('@/hooks/useAuth', () => ({
  useLogin: vi.fn(),
}));

import { LoginPage } from './login';
import { useLogin } from '@/hooks/useAuth';

const mockUseLogin = vi.mocked(useLogin);

describe('LoginPage', () => {
  it('should render login form', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseLogin.mockReturnValue(createMockUseLogin() as any);

    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should submit login with correct credentials', async () => {
    const mockMutate = vi.fn();
    mockUseLogin.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMockUseLogin({ mutate: mockMutate }) as any
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Password'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockMutate).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin123',
    });
  });

  it('should show loading state', () => {
    // Setup: Loading state
    mockUseLogin.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMockUseLogin({ isPending: true }) as any
    );

    render(<LoginPage />);

    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show error message', () => {
    // Setup: Error state
    const error = new Error('Invalid credentials');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseLogin.mockReturnValue(createMockUseLogin({ error }) as any);

    render(<LoginPage />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
