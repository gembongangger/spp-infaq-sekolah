<script lang="ts">
	import { onMount } from 'svelte';
	import { transactions, theme } from '$lib/stores';
	import { formatDate, formatRupiah } from '$lib/utils';

	type ChartPayload = {
		labels: string[];
		datasets: Array<{
			name: string;
			values: number[];
		}>;
	};

	type FrappeChartCtor = new (
		parent: HTMLElement,
		options: Record<string, unknown>
	) => {
		update: (data: ChartPayload) => void;
		destroy: () => void;
	};

	const maxPoints = 7;
	const colors = ['#10b981', '#a855f7', '#ef4444'];

	let chartContainer = $state<HTMLDivElement | undefined>(undefined);
	let chart: { update: (data: ChartPayload) => void; destroy: () => void } | null = null;
	let ChartCtor: FrappeChartCtor | null = null;
	let mounted = false;
	let renderedTheme: 'dark' | 'light' | null = null;

	let allTransactions = $derived($transactions);
	let currentTheme = $derived($theme);

	let chartPayload = $derived.by<ChartPayload>(() => {
		const grouped = new Map<string, { infaq: number; jariyah: number; keluar: number }>();
		const sorted = [...allTransactions].sort((a, b) => a.tanggal.localeCompare(b.tanggal));

		for (const transaction of sorted) {
			const key = transaction.tanggal;
			if (!grouped.has(key)) {
				grouped.set(key, { infaq: 0, jariyah: 0, keluar: 0 });
			}

			const current = grouped.get(key)!;
			if (transaction.jenis === 'masuk') {
				if (transaction.kategori === 'infaq') current.infaq += transaction.jumlah;
				else current.jariyah += transaction.jumlah;
			} else {
				current.keluar += transaction.jumlah;
			}
		}

		const points = Array.from(grouped.entries()).slice(-maxPoints);

		return {
			labels: points.map(([date]) => formatDate(date)),
			datasets: [
				{ name: 'Infaq', values: points.map(([, values]) => values.infaq) },
				{ name: 'Jariyah', values: points.map(([, values]) => values.jariyah) },
				{ name: 'Keluar', values: points.map(([, values]) => values.keluar) }
			]
		};
	});

	const wrapperClass = $derived(
		currentTheme === 'dark'
			? 'finance-chart finance-chart-dark bg-[#0f172a]'
			: 'finance-chart finance-chart-light bg-slate-50'
	);

	function buildOptions(data: ChartPayload) {
		return {
			data,
			type: 'bar',
			height: 220,
			colors,
			barOptions: {
				spaceRatio: 0.45
			},
			axisOptions: {
				xIsSeries: 1,
				shortenYAxisNumbers: 1
			},
			tooltipOptions: {
				formatTooltipY: (value: number) => formatRupiah(value || 0)
			}
		};
	}

	function recreateChart() {
		if (!ChartCtor || !chartContainer) return;

		chart?.destroy();
		chartContainer.innerHTML = '';
		chart = new ChartCtor(chartContainer, buildOptions(chartPayload));
		renderedTheme = currentTheme;
	}

	onMount(async () => {
		const module = await import('frappe-charts');
		ChartCtor = module.Chart as FrappeChartCtor;
		mounted = true;
		recreateChart();

		return () => {
			chart?.destroy();
			chart = null;
		};
	});

	$effect(() => {
		if (!mounted || !ChartCtor || !chartContainer) return;

		const data = chartPayload;
		const theme = currentTheme;

		if (!chart || renderedTheme !== theme) {
			recreateChart();
			return;
		}

		chart.update(data);
	});
</script>

<div class="space-y-3">
	<div class="flex flex-wrap items-center gap-3">
		<div class="flex items-center gap-2 text-xs {currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-600'}">
			<span class="h-2.5 w-2.5 rounded-full bg-[#10b981]"></span>
			<span>Infaq</span>
		</div>
		<div class="flex items-center gap-2 text-xs {currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-600'}">
			<span class="h-2.5 w-2.5 rounded-full bg-[#a855f7]"></span>
			<span>Jariyah</span>
		</div>
		<div class="flex items-center gap-2 text-xs {currentTheme === 'dark' ? 'text-[#94a3b8]' : 'text-slate-600'}">
			<span class="h-2.5 w-2.5 rounded-full bg-[#ef4444]"></span>
			<span>Keluar</span>
		</div>
	</div>

	<div class="relative overflow-hidden rounded-2xl p-3 {wrapperClass}">
		{#if chartPayload.labels.length === 0}
			<div class="flex h-[220px] items-center justify-center text-sm {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-400'}">
				Belum ada data transaksi
			</div>
		{:else}
			<div bind:this={chartContainer} class="h-[220px] w-full"></div>
			<div class="pointer-events-none absolute right-3 top-3 rounded-xl px-3 py-2 text-xs {currentTheme === 'dark' ? 'bg-[#1e293b]/80 text-[#94a3b8]' : 'bg-white/90 text-slate-500'}">
				7 hari terakhir
			</div>
		{/if}
	</div>
</div>

<style>
	:global(.finance-chart .chart-container) {
		width: 100%;
	}

	:global(.finance-chart .chart-legend) {
		display: none;
	}

	:global(.finance-chart .graph-svg-tip) {
		border-radius: 14px;
		box-shadow: 0 10px 30px rgba(15, 23, 42, 0.18);
	}

	:global(.finance-chart.finance-chart-dark .graph-svg-tip) {
		background: #1e293b;
		border-color: #334155;
	}

	:global(.finance-chart.finance-chart-dark .graph-svg-tip .title),
	:global(.finance-chart.finance-chart-dark .graph-svg-tip ul li) {
		color: #f1f5f9;
	}

	:global(.finance-chart.finance-chart-dark text) {
		fill: #94a3b8;
	}

	:global(.finance-chart.finance-chart-dark .chart-line) {
		stroke: #334155;
	}

	:global(.finance-chart.finance-chart-dark .dataset-units.dataset-y text) {
		fill: #64748b;
	}

	:global(.finance-chart.finance-chart-light text) {
		fill: #64748b;
	}

	:global(.finance-chart.finance-chart-light .chart-line) {
		stroke: #e2e8f0;
	}
</style>
