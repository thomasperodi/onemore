import type { User } from '@/types';

// Simulated API calls for authentication

export const getUser = async (): Promise<User | null> => {
  // Simula il recupero dell'utente dal server
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1, name: 'Mario Rossi', email: 'mario.rossi@example.com' }), 1000);
  });
};

export const login = async (email: string, password: string): Promise<User> => {
    // Simula una chiamata di login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === 'password123') {
          resolve({ id: 1, name: 'Mario Rossi', email });
        } else {
          reject(new Error('Password non valida'));
        }
      }, 1000);
    });
  };
  

export const logout = async (): Promise<void> => {
  // Simula una chiamata di logout
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
};
