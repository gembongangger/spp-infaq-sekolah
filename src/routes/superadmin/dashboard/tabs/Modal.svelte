<script lang="ts">
	import { X } from 'lucide-svelte';

	let { title, onClose, children } = $props();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
	<!-- Backdrop -->
	<div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick={onClose}></div>

	<!-- Modal -->
	<div class="relative bg-[#1e293b] rounded-2xl border border-[#334155] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
		<!-- Header -->
		<div class="flex justify-between items-center p-6 border-b border-[#334155]">
			<h3 class="text-xl font-bold text-[#f1f5f9]">{title}</h3>
			<button
				onclick={onClose}
				class="p-2 rounded-lg hover:bg-[#334155] transition-colors text-[#64748b] hover:text-[#94a3b8]"
			>
				<X size={20} />
			</button>
		</div>

		<!-- Content -->
		<div class="p-6">
			{@render children()}
		</div>
	</div>
</div>
