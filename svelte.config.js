import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// For more information about preprocessors:
	preprocess: vitePreprocess(),

	kit: {
		// Use Netlify adapter for deployment
		adapter: adapter({
			edge: false,
			split: false
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
