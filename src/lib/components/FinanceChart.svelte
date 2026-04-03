<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { transactions, theme } from '$lib/stores';
	import { formatDate } from '$lib/utils';

	Chart.register(...registerables);

	let canvas: HTMLCanvasElement;
	let chart: Chart;
	let allTransactions = $derived($transactions);
	let currentTheme = $derived($theme);

	function updateChart() {
		if (!chart) return;

		const byDate: Record<string, { infaq: number; jariyah: number; keluar: number }> = {};
		const sorted = [...allTransactions].sort((a, b) => a.tanggal.localeCompare(b.tanggal));

		sorted.forEach((d) => {
			const key = d.tanggal;
			if (!byDate[key]) byDate[key] = { infaq: 0, jariyah: 0, keluar: 0 };
			if (d.jenis === 'masuk') {
				if (d.kategori === 'infaq') byDate[key].infaq += d.jumlah;
				else byDate[key].jariyah += d.jumlah;
			} else {
				byDate[key].keluar += d.jumlah;
			}
		});

		const labels = Object.keys(byDate);
		const infaqData = labels.map((l) => byDate[l].infaq);
		const jariyahData = labels.map((l) => byDate[l].jariyah);
		const keluarData = labels.map((l) => byDate[l].keluar);

		chart.data.labels = labels.map(formatDate);
		chart.data.datasets[0].data = infaqData;
		chart.data.datasets[1].data = jariyahData;
		chart.data.datasets[2].data = keluarData;
		chart.update();
	}

	onMount(() => {
		const isDark = currentTheme === 'dark';
		const gridColor = isDark ? '#1e293b' : '#e2e8f0';
		const tickColor = isDark ? '#64748b' : '#94a3b8';
		const tooltipBg = isDark ? '#334155' : '#ffffff';
		const tooltipColor = isDark ? '#f1f5f9' : '#0f172a';
		const tooltipBorder = isDark ? '#475569' : '#e2e8f0';
		
		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: [],
				datasets: [
					{ label: 'Infaq', data: [], backgroundColor: '#10b981', borderRadius: 4 },
					{ label: 'Jariyah', data: [], backgroundColor: '#a855f7', borderRadius: 4 },
					{ label: 'Keluar', data: [], backgroundColor: '#ef4444', borderRadius: 4 }
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: tooltipBg,
						titleColor: tooltipColor,
						bodyColor: tooltipColor,
						borderColor: tooltipBorder,
						borderWidth: 1
					}
				},
				scales: {
					x: { grid: { display: false }, ticks: { color: tickColor, font: { size: 10 } } },
					y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 } } }
				}
			}
		});

		// Subscribe to transactions store for real-time updates
		const unsubscribe = transactions.subscribe(() => {
			updateChart();
		});

		return () => {
			unsubscribe();
			chart.destroy();
		};
	});
</script>

<div class="relative h-[200px] w-full">
	<canvas bind:this={canvas}></canvas>
</div>
