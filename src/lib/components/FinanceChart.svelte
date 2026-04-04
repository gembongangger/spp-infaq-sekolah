<script lang="ts">
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
	import { transactions, theme } from '$lib/stores';
	import { formatDate, formatRupiah } from '$lib/utils';
	import Chart from 'chart.js/auto';

	const maxPoints = 7;
	const colors = {
		infaq: '#10b981',
		jariyah: '#a855f7',
		keluar: '#ef4444'
	};

	let chartCanvas = $state<HTMLCanvasElement | undefined>(undefined);
	let chartInstance: Chart | null = null;
	let mounted = false;
	let canvasReady = false;
	let resizeObserver: ResizeObserver | null = null;

	let allTransactions = $derived($transactions);
	let currentTheme = $derived($theme);

	let chartData = $derived.by(() => {
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
			infaq: points.map(([, values]) => values.infaq),
			jariyah: points.map(([, values]) => values.jariyah),
			keluar: points.map(([, values]) => values.keluar)
		};
	});

	const wrapperClass = $derived(
		currentTheme === 'dark'
			? 'bg-[#0f172a]'
			: 'bg-slate-50'
	);

	const textColor = $derived(currentTheme === 'dark' ? '#94a3b8' : '#64748b');
	const gridColor = $derived(currentTheme === 'dark' ? '#334155' : '#e2e8f0');

	async function createChart() {
		await tick();
		if (!chartCanvas || !mounted) return;

		chartInstance?.destroy();

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) return;

		chartInstance = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: chartData.labels,
				datasets: [
					{
						label: 'Infaq',
						data: chartData.infaq,
						backgroundColor: colors.infaq,
						borderRadius: 4,
						borderSkipped: false
					},
					{
						label: 'Jariyah',
						data: chartData.jariyah,
						backgroundColor: colors.jariyah,
						borderRadius: 4,
						borderSkipped: false
					},
					{
						label: 'Keluar',
						data: chartData.keluar,
						backgroundColor: colors.keluar,
						borderRadius: 4,
						borderSkipped: false
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: true,
						callbacks: {
							label: (context) => {
								return `${context.dataset.label}: ${formatRupiah(context.raw as number)}`;
							}
						},
						backgroundColor: currentTheme === 'dark' ? '#1e293b' : '#ffffff',
						titleColor: currentTheme === 'dark' ? '#f1f5f9' : '#1e293b',
						bodyColor: currentTheme === 'dark' ? '#94a3b8' : '#64748b',
						borderColor: currentTheme === 'dark' ? '#334155' : '#e2e8f0',
						borderWidth: 1,
						cornerRadius: 12,
						padding: 12
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							color: textColor
						}
					},
					y: {
						grid: {
							color: gridColor
						},
						ticks: {
							color: textColor,
							callback: (value) => {
								const num = Number(value);
								if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
								if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
								return value;
							}
						}
					}
				},
				animation: {
					duration: 500
				}
			}
		});
	}

	onMount(() => {
		mounted = true;
		
		// Delay chart creation to ensure canvas has dimensions
		setTimeout(() => {
			createChart();
		}, 100);

		return () => {
			chartInstance?.destroy();
			resizeObserver?.disconnect();
		};
	});

	$effect(() => {
		if (!mounted) return;

		// Watch for canvas binding
		if (chartCanvas && !chartInstance) {
			createChart();
			return;
		}

		const data = chartData;
		const theme = currentTheme;

		if (!chartInstance) {
			createChart();
			return;
		}

		chartInstance.data.labels = data.labels;
		chartInstance.data.datasets[0].data = data.infaq;
		chartInstance.data.datasets[1].data = data.jariyah;
		chartInstance.data.datasets[2].data = data.keluar;

		if (chartInstance.options.scales?.x) {
			chartInstance.options.scales.x.ticks!.color = theme === 'dark' ? '#94a3b8' : '#64748b';
		}
		if (chartInstance.options.scales?.y) {
			chartInstance.options.scales.y.grid!.color = theme === 'dark' ? '#334155' : '#e2e8f0';
			chartInstance.options.scales.y.ticks!.color = theme === 'dark' ? '#94a3b8' : '#64748b';
		}
		if (chartInstance.options.plugins?.tooltip) {
			chartInstance.options.plugins.tooltip.backgroundColor = theme === 'dark' ? '#1e293b' : '#ffffff';
			chartInstance.options.plugins.tooltip.titleColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';
			chartInstance.options.plugins.tooltip.bodyColor = theme === 'dark' ? '#94a3b8' : '#64748b';
			chartInstance.options.plugins.tooltip.borderColor = theme === 'dark' ? '#334155' : '#e2e8f0';
		}

		chartInstance.update();
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
		{#if chartData.labels.length === 0}
			<div class="flex h-[220px] items-center justify-center text-sm {currentTheme === 'dark' ? 'text-[#64748b]' : 'text-slate-400'}">
				Belum ada data transaksi
			</div>
		{:else}
			<div class="h-[220px] w-full">
				<canvas bind:this={chartCanvas}></canvas>
			</div>
			<div class="pointer-events-none absolute right-3 top-3 rounded-xl px-3 py-2 text-xs {currentTheme === 'dark' ? 'bg-[#1e293b]/80 text-[#94a3b8]' : 'bg-white/90 text-slate-500'}">
				7 hari terakhir
			</div>
		{/if}
	</div>
</div>
