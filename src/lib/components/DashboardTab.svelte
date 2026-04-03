<script lang="ts">
	import { TrendingUp, Heart, TrendingDown, Wallet } from 'lucide-svelte';
	import StatsCard from './StatsCard.svelte';
	import FinanceChart from './FinanceChart.svelte';

	interface Props {
		stats: {
			totalInfaq: number;
			totalJariyah: number;
			totalKeluar: number;
			saldo: number;
		};
	}

	let { stats }: Props = $props();
</script>

<div class="fade-in">
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
		<StatsCard
			label="Total Infaq"
			value={stats.totalInfaq}
			icon={TrendingUp}
			color="#10b981"
			borderColor="#1e3a2f"
			bgColor="rgba(16,185,129,0.15)"
		/>
		<StatsCard
			label="Total Jariyah"
			value={stats.totalJariyah}
			icon={Heart}
			color="#a855f7"
			borderColor="#2d1b3d"
			bgColor="rgba(168,85,247,0.15)"
		/>
		<StatsCard
			label="Total Keluar"
			value={stats.totalKeluar}
			icon={TrendingDown}
			color="#ef4444"
			borderColor="#3b1f2b"
			bgColor="rgba(239,68,68,0.15)"
		/>
		<StatsCard
			label="Saldo"
			value={stats.saldo}
			icon={Wallet}
			color="#3b82f6"
			borderColor="#1e2d3d"
			bgColor="rgba(59,130,246,0.15)"
		/>
	</div>

	<!-- Chart -->
	<FinanceChart />
</div>
