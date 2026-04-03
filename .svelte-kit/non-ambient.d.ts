
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/admin" | "/api/admin/profile" | "/api/auth" | "/api/auth/change-password" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/me" | "/api/auth/reset-password" | "/api/health" | "/api/kategori" | "/api/kategori/[id]" | "/api/siswa" | "/api/siswa/download-template" | "/api/siswa/search" | "/api/siswa/upload-excel" | "/api/siswa/[id]" | "/api/superadmin" | "/api/superadmin/admin-sekolah" | "/api/superadmin/admin-sekolah/[id]" | "/api/superadmin/sekolah" | "/api/superadmin/sekolah/[id]" | "/api/transaksi" | "/api/transaksi/senders" | "/api/transaksi/stats" | "/api/transaksi/[id]" | "/login" | "/pengirim" | "/reset-password" | "/superadmin" | "/superadmin/dashboard" | "/superadmin/dashboard/tabs" | "/superadmin/login";
		RouteParams(): {
			"/api/kategori/[id]": { id: string };
			"/api/siswa/[id]": { id: string };
			"/api/superadmin/admin-sekolah/[id]": { id: string };
			"/api/superadmin/sekolah/[id]": { id: string };
			"/api/transaksi/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": { id?: string };
			"/api/admin": Record<string, never>;
			"/api/admin/profile": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/auth/change-password": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/auth/me": Record<string, never>;
			"/api/auth/reset-password": Record<string, never>;
			"/api/health": Record<string, never>;
			"/api/kategori": { id?: string };
			"/api/kategori/[id]": { id: string };
			"/api/siswa": { id?: string };
			"/api/siswa/download-template": Record<string, never>;
			"/api/siswa/search": Record<string, never>;
			"/api/siswa/upload-excel": Record<string, never>;
			"/api/siswa/[id]": { id: string };
			"/api/superadmin": { id?: string };
			"/api/superadmin/admin-sekolah": { id?: string };
			"/api/superadmin/admin-sekolah/[id]": { id: string };
			"/api/superadmin/sekolah": { id?: string };
			"/api/superadmin/sekolah/[id]": { id: string };
			"/api/transaksi": { id?: string };
			"/api/transaksi/senders": Record<string, never>;
			"/api/transaksi/stats": Record<string, never>;
			"/api/transaksi/[id]": { id: string };
			"/login": Record<string, never>;
			"/pengirim": Record<string, never>;
			"/reset-password": Record<string, never>;
			"/superadmin": Record<string, never>;
			"/superadmin/dashboard": Record<string, never>;
			"/superadmin/dashboard/tabs": Record<string, never>;
			"/superadmin/login": Record<string, never>
		};
		Pathname(): "/" | "/api/admin/profile" | "/api/auth/change-password" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/me" | "/api/auth/reset-password" | "/api/health" | "/api/kategori" | `/api/kategori/${string}` & {} | "/api/siswa" | "/api/siswa/download-template" | "/api/siswa/search" | "/api/siswa/upload-excel" | `/api/siswa/${string}` & {} | "/api/superadmin/admin-sekolah" | `/api/superadmin/admin-sekolah/${string}` & {} | "/api/superadmin/sekolah" | `/api/superadmin/sekolah/${string}` & {} | "/api/transaksi" | "/api/transaksi/senders" | "/api/transaksi/stats" | `/api/transaksi/${string}` & {} | "/login" | "/pengirim" | "/reset-password" | "/superadmin/dashboard" | "/superadmin/login";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}