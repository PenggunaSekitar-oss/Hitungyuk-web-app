import { User, LoginFormData, RegisterFormData } from './auth-types';
import { v4 as uuidv4 } from 'uuid';

// LocalStorage keys
const USERS_STORAGE_KEY = 'hitungyuk_users';
const CURRENT_USER_KEY = 'hitungyuk_current_user';

// Authentication service for handling user operations
export const AuthService = {
  // Get all users from localStorage
  getUsers: (): User[] => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  },

  // Save users to localStorage
  saveUsers: (users: User[]): void => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  // Register a new user
  register: (data: RegisterFormData): User | null => {
    const users = AuthService.getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === data.email)) {
      return null; // Email already exists
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      username: data.username,
      email: data.email,
      password: data.password, // In a real app, this would be hashed
      createdAt: new Date()
    };

    // Save user
    AuthService.saveUsers([...users, newUser]);
    return newUser;
  },

  // Login user
  login: (data: LoginFormData): User | null => {
    const users = AuthService.getUsers();
    const user = users.find(
      user => user.email === data.email && user.password === data.password
    );

    if (user) {
      // Save current user to localStorage (session)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    return user;
  },

  // Get current logged in user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!AuthService.getCurrentUser();
  }
};
