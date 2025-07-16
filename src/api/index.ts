import { useAuthStore } from '../store/auth';

// API base URL
export const API_BASE_URL = 'http://localhost:3000';

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  USERS: `${API_BASE_URL}/api/users`,
  USER_CREATE: `${API_BASE_URL}/api/users/create`,
  USER_BY_ID: (id: string | number) => `${API_BASE_URL}/api/users/${id}`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// API request helper
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Types
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface User {
  id: number;
  username: string;
  role: string;
}

// API methods
export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    apiRequest<LoginResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Users
  getUsers: () => apiRequest<User[]>(API_ENDPOINTS.USERS),
  
  getUser: (id: string | number) => 
    apiRequest<User>(API_ENDPOINTS.USER_BY_ID(id)),
  
  createUser: (userData: Omit<User, 'id'>) =>
    apiRequest<User>(API_ENDPOINTS.USER_CREATE, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  updateUser: (id: string | number, userData: Partial<Omit<User, 'id'>>) =>
    apiRequest<User>(API_ENDPOINTS.USER_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};
