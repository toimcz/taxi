<script lang="ts">
  import { Logo } from './index.js';

  type Props = {
    src: string;
    href: string;
    text?: string;
  };

  const { src, href, text }: Props = $props();
</script>

<div>
  <Logo {src} />
  <a {href} class="logo-text text-2xl font-bold uppercase">{text}</a>
</div>
