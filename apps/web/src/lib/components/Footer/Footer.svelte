<script lang="ts">
import { Facebook, Google, Instagram } from "@taxi/ui";
import { page } from "$app/state";
import {
	PUBLIC_APP_EMAIL,
	PUBLIC_APP_PHONE,
	PUBLIC_APP_SLOGAN,
	PUBLIC_SOCIAL_FACEBOOK_URL,
	PUBLIC_SOCIAL_GOOGLE_URL,
	PUBLIC_SOCIAL_INSTAGRAM_URL,
} from "$env/static/public";
import { LogoText } from "$lib/components/Logo";

type Page = {
	title: string;
	slug: string;
};

type Props = {
	pages: Page[];
};

let { pages }: Props = $props();
</script>

<footer class="mt-10 bg-white px-7 py-5 print:hidden">
  <div class="container p-10">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="footer-box">
        <div class="flex flex-col gap-0">
          <LogoText />
          <p class="text-sm text-gray-500">{PUBLIC_APP_SLOGAN}</p>
          {#if page.data.bases && page.data.bases.length > 0}
            <ul class="flex gap-2 pt-3 uppercase">
              {#each page.data.bases as base (base.id)}
                <li class="rounded-lg bg-gray-100 px-2 py-0.5">
                  {base.city}
                </li>
              {/each}
            </ul>
          {/if}
        </div>
        <div class="flex items-center gap-4">
          <a href={PUBLIC_SOCIAL_FACEBOOK_URL} target="_blank">
            <Facebook />
          </a>
          <a href={PUBLIC_SOCIAL_INSTAGRAM_URL} target="_blank">
            <Instagram />
          </a>
          <a href={PUBLIC_SOCIAL_GOOGLE_URL} target="_blank">
            <Google />
          </a>
        </div>
        <ul class="flex list-none flex-col gap-2">
          {#each pages as page (page.slug)}
            <li>
              <a href="/{page.slug}">{page.title}</a>
            </li>
          {/each}
        </ul>
      </div>
      {#if page.data.services && page.data.services.length > 0}
        <div class="footer-box">
          <h3 class="text-lg font-bold">Co nabízíme</h3>
          <hr />
          <ul class="flex list-none flex-col gap-2 text-sm">
            {#each page.data.services as service (service.id)}
              <li>
                <a href="/sluzby/{service.slug}">{service.title}</a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      <div class="footer-box">
        <h3 class="text-lg font-bold">Kontakt</h3>
        <hr />
        <div class="flex flex-col gap-2">
          <p>Telefon:</p>
          <a href="tel:{PUBLIC_APP_PHONE}" class="text-lg font-bold">{PUBLIC_APP_PHONE}</a>
        </div>
        <div class="flex flex-col gap-2">
          <p>Email:</p>
          <a href="mailto:{PUBLIC_APP_EMAIL}" class="text-lg font-bold">{PUBLIC_APP_EMAIL}</a>
        </div>
      </div>
    </div>
  </div>
</footer>

<style lang="postcss">
  @reference "tailwindcss";

  .footer-box hr {
    @apply border-t-3 my-1 max-w-32 border-gray-200;
  }

  .footer-box {
    @apply flex flex-col gap-4 px-5 lg:px-10;
  }
</style>
