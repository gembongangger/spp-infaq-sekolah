/**
 * Authentication API Service
 * Now using SvelteKit backend with relative paths
 */

export interface AuthUser {
	id: string;
	username: string;
	email: string;
	role: string;
	isActive: boolean;
	nama_lengkap: string | null;
	no_hp: string | null;
	foto_url: string | null;
	createdAt: string;
	updatedAt: string;
}

interface LoginResponse {
	success: boolean;
	message: string;
	data: AuthUser;
}

interface ResetPasswordResponse {
	success: boolean;
	message: string;
	data: {
		email: string;
		temporary_password: string;
		note: string;
	};
}

export const authApi = {
	/** Login user */
	login: async (email: string, password: string): Promise<LoginResponse> => {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Login failed');
		}

		return data;
	},

	/** Logout user */
	logout: async (): Promise<void> => {
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Logout failed');
		}
	},

	/** Get current user */
	getCurrentUser: async (): Promise<LoginResponse> => {
		const response = await fetch('/api/auth/me', {
			method: 'GET',
			credentials: 'include',
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Not authenticated');
		}

		return data;
	},

	/** Reset password */
	resetPassword: async (email: string): Promise<ResetPasswordResponse['data']> => {
		const response = await fetch('/api/auth/reset-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ email }),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Reset password failed');
		}

		return data.data;
	},

	/** Change password */
	changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
		const response = await fetch('/api/auth/change-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Change password failed');
		}
	},

	/** Update profile */
	updateProfile: async (data: {
		nama_lengkap?: string | null;
		no_hp?: string | null;
		foto_url?: string | null;
	}): Promise<LoginResponse['data']> => {
		const response = await fetch('/api/admin/profile', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(data),
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.message || 'Update profile failed');
		}

		return result.data;
	},
};
