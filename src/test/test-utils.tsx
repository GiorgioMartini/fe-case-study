import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Simple test wrapper with just query context - router hooks are mocked
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: createTestWrapper(), ...options });

export {
  screen,
  fireEvent,
  waitFor,
  within,
  cleanup,
} from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
