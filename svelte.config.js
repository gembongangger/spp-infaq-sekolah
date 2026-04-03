import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// For more information about preprocessors:
	preprocess: vitePreprocess(),

	kit: {
		// Use Node.js adapter for API routes support
		adapter: adapter({
			out: 'build',
			precompress: false,
			envPrefix: 'VITE_'
		}),
		alias: {
			$lib: './src/lib',
			'$lib/*': './src/lib/*'
		},
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
