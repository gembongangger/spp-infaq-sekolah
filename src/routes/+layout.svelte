<script lang="ts">
	import '../index.css';
	import { theme } from '$lib/stores';
	import { onMount } from 'svelte';

	let { children } = $props();
	let currentTheme = $state<'dark' | 'light'>('dark');

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
		if (savedTheme) {
			currentTheme = savedTheme;
			theme.set(savedTheme);
		}
	});

	$effect(() => {
		const unsubscribe = theme.subscribe((v) => {
			currentTheme = v;
			if (typeof window !== 'undefined') {
				localStorage.setItem('theme', v);
				if (v === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		});
		return unsubscribe;
	});
</script>

<div class="min-h-screen transition-colors duration-300 {currentTheme === 'dark' ? 'bg-[#0f172a] text-[#f1f5f9]' : 'bg-white text-[#0f172a]'}">
	{@render children()}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
