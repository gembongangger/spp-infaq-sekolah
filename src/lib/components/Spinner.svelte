<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'emerald' | 'blue' | 'white' | 'slate' | 'red';
    fullScreen?: boolean;
    text?: string;
  }

  let {
    size = 'md',
    color = 'emerald',
    fullScreen = false,
    text = ''
  }: Props = $props();

  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colorClasses: Record<string, string> = {
    emerald: 'border-[#10b981]/20 border-t-[#10b981]',
    blue: 'border-blue-200 border-t-blue-500',
    white: 'border-white/30 border-t-white',
    slate: 'border-slate-700 border-t-emerald-500',
    red: 'border-red-500/30 border-t-red-500'
  };
</script>

{#if fullScreen}
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col items-center gap-3">
      <div
        class="{sizeClasses[size]} {colorClasses[color]} rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      ></div>
      {#if text}
        <p class="text-sm text-gray-500 dark:text-gray-400">{text}</p>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center">
    <div class="flex flex-col items-center gap-3">
      <div
        class="{sizeClasses[size]} {colorClasses[color]} rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      ></div>
      {#if text}
        <p class="text-sm text-gray-500 dark:text-gray-400">{text}</p>
      {/if}
    </div>
  </div>
{/if}
