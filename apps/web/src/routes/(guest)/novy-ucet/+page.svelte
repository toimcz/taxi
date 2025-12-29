<script lang="ts">
import { Lock, Mail } from "@lucide/svelte";
import { useGoogleLogin } from "@taxi/client-auth";
import { Card, Google, Spinner } from "@taxi/ui";
import { goto } from "$app/navigation";
import { PUBLIC_APP_URL } from "$env/static/public";
import RegisterEmail from "$lib/components/Auth/RegisterEmail.svelte";
import RegisterPassword from "$lib/components/Auth/RegisterPassword.svelte";
import { WebPage } from "$lib/components/WebPage";
import { useToastStore } from "$lib/stores";

const toast = useToastStore();

const title = "Vytvoření účtu";
const description = "Vytvořte si nový účet v našem systému";

type AuthMethod = "password" | "magic-link";
let authMethod = $state<AuthMethod>("password");

const form = useGoogleLogin(PUBLIC_APP_URL, {
	onSuccess: () => {
		toast.add("message", "Registrace byla úspěšná.");
		goto("/");
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
});
</script>

<WebPage {title} {description}>
  <div class="flex items-center justify-center pt-10">
    <Card class="w-full max-w-xl flex flex-col gap-2">
      <!-- Primary Auth Method: Google -->
      <div class="flex flex-col gap-2">
        <h2 class="text-center text-lg font-semibold text-gray-700">Vytvořit účet</h2>
        <button
          type="button"
          class="btn btn-google"
          disabled={form.processing}
          onclick={form.submit}
          aria-label="Registrovat se přes Google"
        >
          <div class="flex items-center gap-2 justify-center">
            {#if form.processing}
              <Spinner />
            {:else}
              <Google />
            {/if}
            Pokračovat s Google
          </div>
        </button>
      </div>

      <!-- Divider -->
      <div class="flex items-center gap-3 my-2">
        <hr class="flex-1 border-gray-200" />
        <span class="text-sm text-gray-500 font-medium">nebo</span>
        <hr class="flex-1 border-gray-200" />
      </div>

      <!-- Secondary Auth Methods: Toggle -->
      <div class="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 {authMethod ===
          'password'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-600 hover:text-gray-900'}"
          onclick={() => (authMethod = 'password')}
          aria-label="Vytvořit účet s heslem"
          aria-pressed={authMethod === 'password'}
        >
          <div class="flex items-center gap-2 justify-center">
            <Lock size={16} />
            S heslem
          </div>
        </button>
        <button
          type="button"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 {authMethod ===
          'magic-link'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-600 hover:text-gray-900'}"
          onclick={() => (authMethod = 'magic-link')}
          aria-label="Vytvořit účet bez hesla"
          aria-pressed={authMethod === 'magic-link'}
        >
          <div class="flex items-center gap-2 justify-center">
            <Mail size={16} />
            Bez hesla
          </div>
        </button>
      </div>

      <!-- Auth Forms -->
      <div class="mt-2">
        {#if authMethod === 'password'}
          <RegisterPassword />
        {:else}
          <RegisterEmail />
        {/if}
      </div>

      <!-- Already have account -->
      <hr />
      <div class="flex flex-col gap-2">
        <a
          href="/prihlasit"
          class="text-sm text-center text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Již máte účet? Přihlásit se"
        >
          Již máte účet? <span class="font-medium">Přihlásit se</span>
        </a>
      </div>
    </Card>
  </div>
</WebPage>
