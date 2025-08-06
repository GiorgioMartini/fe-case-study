import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../test/test-utils';

// Simple: Create a fresh mock for each test scenario
const createMockUseLogin = (overrides = {}) => ({
  mutate: vi.fn(),
  isPending: false,
  error: null,
  ...overrides,
});

// Mock the hook - we'll override it in each test
const mockUseLogin = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useLogin: mockUseLogin,
}));

import { UserForm } from './UserForm';

describe('LoginPage', () => {
  it('should render create user form', () => {
    // Setup: Normal state
    mockUseLogin.mockReturnValue(createMockUseLogin());

    render(
      <UserForm
        defaultValues={{ username: '', role: '' }}
        onSubmit={() => {}}
        isSubmitting={false}
        submitLabel="Create User"
        onCancel={() => {}}
      />
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText('Select a role')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create User' })
    ).toBeInTheDocument();
  });
});
