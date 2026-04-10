<script lang="ts">
  interface Props {
    shape?: 'rect' | 'circle';
    width?: string;
    height?: string;
    count?: number;
    className?: string;
  }

  let {
    shape = 'rect',
    width = 'w-full',
    height = 'h-4',
    count = 1,
    className = ''
  }: Props = $props();

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded';
  const finalClass = $derived(`${shapeClass} ${width} ${height} bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`.trim());
</script>

{#each Array(count) as _}
  <div
    class={finalClass}
    role="status"
    aria-label="Loading"
  ></div>
{/each}
