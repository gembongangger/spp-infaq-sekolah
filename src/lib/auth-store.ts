import { writable, readable } from 'svelte/store';
import { authApi, type AuthUser } from './auth';

export type User = AuthUser;

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	isLoading: boolean;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	isLoading: true,
};

export const authStore = writable<AuthState>(initialState);

// Auth status checker
export const authStatus = readable<boolean>(false, (set) => {
	async function checkAuth() {
		try {
			const response = await authApi.getCurrentUser();
			set(response.success);
			authStore.update((state) => ({
				...state,
				isAuthenticated: response.success,
				user: response.success ? response.data : null,
				isLoading: false,
			}));
		} catch {
			set(false);
			authStore.update((state) => ({
				...state,
				isAuthenticated: false,
				user: null,
				isLoading: false,
			}));
		}
	}

	checkAuth();

	return () => {};
});

// Login function
export async function login(email: string, password: string) {
	try {
		const response = await authApi.login(email, password);
		
		authStore.update((state) => ({
			...state,
			isAuthenticated: true,
			user: response.data,
			isLoading: false,
		}));

		return response;
	} catch (error) {
		authStore.update((state) => ({
			...state,
			isAuthenticated: false,
			user: null,
			isLoading: false,
		}));
		throw error;
	}
}

// Logout function
export async function logout() {
	try {
		await authApi.logout();
		
		authStore.update((state) => ({
			...state,
			isAuthenticated: false,
			user: null,
			isLoading: false,
		}));
	} catch (error) {
		console.error('Logout error:', error);
		throw error;
	}
}

// Reset password function
export async function resetPassword(email: string) {
	return await authApi.resetPassword(email);
}

// Change password function
export async function changePassword(currentPassword: string, newPassword: string) {
	return await authApi.changePassword(currentPassword, newPassword);
}

// Update profile function
export async function updateProfile(data: {
	nama_lengkap?: string | null;
	no_hp?: string | null;
	foto_url?: string | null;
}) {
	try {
		const updatedData = await authApi.updateProfile(data);

		authStore.update((state) => ({
			...state,
			user: {
				...state.user!,
				nama_lengkap: updatedData.nama_lengkap,
				no_hp: updatedData.no_hp,
				foto_url: updatedData.foto_url,
				updatedAt: new Date().toISOString(),
			},
		}));

		return updatedData;
	} catch (error) {
		console.error('Update profile error:', error);
		throw error;
	}
}
