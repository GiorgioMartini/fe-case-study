import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../test/test-utils';
import { UserForm } from './UserForm';

describe('UserForm', () => {
  const defaultProps = {
    defaultValues: { username: '', role: '' },
    onSubmit: vi.fn(),
    isSubmitting: false,
    submitLabel: 'Create User',
    onCancel: vi.fn(),
  };

  it('should render create user form with all required elements', () => {
    render(<UserForm {...defaultProps} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText('Select a role')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create User' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should render with custom submit and cancel labels', () => {
    render(
      <UserForm
        {...defaultProps}
        submitLabel="Save User"
        cancelLabel="Go Back"
      />
    );

    expect(
      screen.getByRole('button', { name: 'Save User' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
  });

  it('should render with pre-filled values for edit mode', () => {
    render(
      <UserForm
        {...defaultProps}
        defaultValues={{ username: 'admin', role: 'admin' }}
      />
    );

    expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('Admin');
  });

  it('should disable form elements when submitting', () => {
    render(<UserForm {...defaultProps} isSubmitting={true} />);

    const nameInput = screen.getByLabelText('Name');
    const submitButton = screen.getByRole('button', { name: 'Create User' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(nameInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should display API error message when provided', () => {
    const apiError = 'User already exists with this name';
    render(<UserForm {...defaultProps} apiError={apiError} />);

    expect(screen.getByText(apiError)).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn();
    render(<UserForm {...defaultProps} onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
