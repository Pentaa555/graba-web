import { atom, computed } from 'nanostores';

export type Role = 'student' | 'teacher' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  courses?: string[];
  password: string;
};

export const currentUser = atom<User | null>(null);
export const activeRole = atom<Role | null>(null);
export const isAuthenticated = computed(currentUser, (u) => u !== null);

export function login(user: User) {
  currentUser.set(user);
  activeRole.set(user.role);
}

export function logout() {
  currentUser.set(null);
  activeRole.set(null);
}
