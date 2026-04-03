import { init } from '../serverless.js';

export default init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.ydMOl4UC.js",app:"_app/immutable/entry/app.QedZ5FL9.js",imports:["_app/immutable/entry/start.ydMOl4UC.js","_app/immutable/chunks/DHZTObCF.js","_app/immutable/chunks/Bz6g96HP.js","_app/immutable/entry/app.QedZ5FL9.js","_app/immutable/chunks/CL7p_BHZ.js","_app/immutable/chunks/Bz6g96HP.js","_app/immutable/chunks/Bt_bj9wC.js","_app/immutable/chunks/CuqcOHGy.js","_app/immutable/chunks/B-62dReM.js","_app/immutable/chunks/alPTatSx.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/2.js')),
			__memo(() => import('../server/nodes/3.js')),
			__memo(() => import('../server/nodes/4.js')),
			__memo(() => import('../server/nodes/5.js')),
			__memo(() => import('../server/nodes/6.js')),
			__memo(() => import('../server/nodes/7.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/admin/profile",
				pattern: /^\/api\/admin\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/admin/profile/_server.ts.js'))
			},
			{
				id: "/api/auth/change-password",
				pattern: /^\/api\/auth\/change-password\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/auth/change-password/_server.ts.js'))
			},
			{
				id: "/api/auth/login",
				pattern: /^\/api\/auth\/login\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/auth/login/_server.ts.js'))
			},
			{
				id: "/api/auth/logout",
				pattern: /^\/api\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/auth/logout/_server.ts.js'))
			},
			{
				id: "/api/auth/me",
				pattern: /^\/api\/auth\/me\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/auth/me/_server.ts.js'))
			},
			{
				id: "/api/auth/reset-password",
				pattern: /^\/api\/auth\/reset-password\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/auth/reset-password/_server.ts.js'))
			},
			{
				id: "/api/health",
				pattern: /^\/api\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/health/_server.ts.js'))
			},
			{
				id: "/api/kategori",
				pattern: /^\/api\/kategori\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/kategori/_server.ts.js'))
			},
			{
				id: "/api/kategori/[id]",
				pattern: /^\/api\/kategori\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/kategori/_id_/_server.ts.js'))
			},
			{
				id: "/api/siswa",
				pattern: /^\/api\/siswa\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/siswa/_server.ts.js'))
			},
			{
				id: "/api/siswa/download-template",
				pattern: /^\/api\/siswa\/download-template\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/siswa/download-template/_server.ts.js'))
			},
			{
				id: "/api/siswa/search",
				pattern: /^\/api\/siswa\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/siswa/search/_server.ts.js'))
			},
			{
				id: "/api/siswa/upload-excel",
				pattern: /^\/api\/siswa\/upload-excel\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/siswa/upload-excel/_server.ts.js'))
			},
			{
				id: "/api/siswa/[id]",
				pattern: /^\/api\/siswa\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/siswa/_id_/_server.ts.js'))
			},
			{
				id: "/api/superadmin/admin-sekolah",
				pattern: /^\/api\/superadmin\/admin-sekolah\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/superadmin/admin-sekolah/_server.ts.js'))
			},
			{
				id: "/api/superadmin/admin-sekolah/[id]",
				pattern: /^\/api\/superadmin\/admin-sekolah\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/superadmin/admin-sekolah/_id_/_server.ts.js'))
			},
			{
				id: "/api/superadmin/sekolah",
				pattern: /^\/api\/superadmin\/sekolah\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/superadmin/sekolah/_server.ts.js'))
			},
			{
				id: "/api/superadmin/sekolah/[id]",
				pattern: /^\/api\/superadmin\/sekolah\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/superadmin/sekolah/_id_/_server.ts.js'))
			},
			{
				id: "/api/transaksi",
				pattern: /^\/api\/transaksi\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/transaksi/_server.ts.js'))
			},
			{
				id: "/api/transaksi/senders",
				pattern: /^\/api\/transaksi\/senders\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/transaksi/senders/_server.ts.js'))
			},
			{
				id: "/api/transaksi/stats",
				pattern: /^\/api\/transaksi\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/transaksi/stats/_server.ts.js'))
			},
			{
				id: "/api/transaksi/[id]",
				pattern: /^\/api\/transaksi\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../server/entries/endpoints/api/transaksi/_id_/_server.ts.js'))
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/pengirim",
				pattern: /^\/pengirim\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/reset-password",
				pattern: /^\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/superadmin/dashboard",
				pattern: /^\/superadmin\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/superadmin/login",
				pattern: /^\/superadmin\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})());

export const config = {
	path: ["/*"],
	excludedPath: ["/.netlify/*"],
	preferStatic: true
};
