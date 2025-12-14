<script lang="ts">
import { MenuIcon, XIcon } from "@lucide/svelte";
import { cubicOut } from "svelte/easing";
import { slide } from "svelte/transition";
import { invalidateAll } from "$app/navigation";
import { page } from "$app/state";
import { LogoText } from "$lib/components/Logo";
import { useLogout } from "$lib/hooks/use-auth.svelte";
import { useToastStore } from "$lib/stores";

type Page = {
	title: string;
	slug: string;
};

type Props = {
	pages: Page[];
};

let { pages }: Props = $props();
let showLinks = $state(false);

const toast = useToastStore();
const { submit: submitLogout } = useLogout({
	onSuccess: async () => {
		await invalidateAll();
		toast.add("message", "Odhlášení proběhlo úspěšně");
	},
	onError: async () => {
		toast.add("error", "Nepodařilo se odhlásit");
	},
});
const staticPages: Page[] = [
	{
		title: "Naše vozy",
		slug: "/nase-vozy",
	},
	{
		title: "Kontakt",
		slug: "/kontakt",
	},
];

$effect(() => {
	if (page.url.pathname) {
		showLinks = false;
	}
});
</script>

<nav class="relative py-5 print:hidden">
  <div class="container flex items-center justify-between">
    <div class="flex items-center gap-6">
      <div class="pr-3">
        <LogoText />
      </div>
      <ul class="hidden items-center gap-6 lg:flex">
        {#each pages as page, i (i)}
          <li>
            <a href={page.slug}>{page.title}</a>
          </li>
        {/each}
        {#each staticPages as page, i (i)}
          <li>
            <a href={page.slug}>{page.title}</a>
          </li>
        {/each}
      </ul>
    </div>
    <div>
      <ul class="hidden items-center gap-6 lg:flex">
        {#if !page.data.isAuthenticated}
          <li>
            <a href="/novy-ucet">Nový účet</a>
          </li>
          <li>
            <a href="/prihlasit">Přihlásit se</a>
          </li>
        {:else}
          <li>
            <a href="/ucet">Můj účet</a>
          </li>
          <li>
            <form method="POST" onsubmit={submitLogout}>
              <button type="submit">Odhlásit se</button>
            </form>
          </li>
        {/if}
      </ul>
      <div class="flex items-center lg:hidden">
        <button type="button" onclick={() => (showLinks = !showLinks)}>
          {#if showLinks}
            <XIcon />
          {:else}
            <MenuIcon />
          {/if}
        </button>
      </div>
    </div>
  </div>
  {#if showLinks}
    <div
      class="absolute left-0 top-full z-10 mt-4 w-full bg-white p-8 shadow-lg"
      transition:slide={{ duration: 200, easing: cubicOut }}
    >
      <ul class="flex flex-col gap-6">
        {#each pages as page, i (i)}
          <li><a href={page.slug}>{page.title}</a></li>
        {/each}
        {#each staticPages as page, i (i)}
          <li><a href={page.slug}>{page.title}</a></li>
        {/each}
        {#if !page.data.isAuthenticated}
          <li>
            <a href="/novy-ucet">Nový účet</a>
          </li>
          <li>
            <a href="/prihlasit">Přihlásit se</a>
          </li>
        {:else}
          <li>
            <a href="/ucet">Můj účet</a>
          </li>
          <li>
            <form method="POST" onsubmit={submitLogout}>
              <button type="submit">Odhlásit se</button>
            </form>
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</nav>
