<script lang="ts">
import { Lock, Mail, User } from "@lucide/svelte";
import { useGoogleLogin } from "@taxi/client-auth";
import { Card, Google, Spinner } from "@taxi/ui";
import { goto } from "$app/navigation";
import { PUBLIC_APP_URL } from "$env/static/public";
import LoginEmail from "$lib/components/Auth/LoginEmail.svelte";
import LoginPassword from "$lib/components/Auth/LoginPassword.svelte";
import { WebPage } from "$lib/components/WebPage";
import { useToastStore } from "$lib/stores";

const toast = useToastStore();

const title = "Přihlášení";
const description = "Přihlášení do systému";

type AuthMethod = "password" | "magic-link";
let authMethod = $state<AuthMethod>("password");

const googleLogin = useGoogleLogin(PUBLIC_APP_URL, {
	onSuccess: async () => {
		goto("/");
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
});
</script>

<WebPage {title} {description}>
  <div class="flex items-center justify-center pt-10">
    <Card class="w-full max-w-md flex flex-col gap-4">
      <!-- Primary Auth Method: Google -->
      <div class="flex flex-col gap-2">
        <h2 class="text-center text-lg font-semibold text-gray-700">Přihlásit se</h2>
        <button
          type="button"
          class="btn btn-google"
          disabled={googleLogin.processing}
          onclick={googleLogin.submit}
          aria-label="Přihlásit se přes Google"
        >
          <div class="flex items-center gap-2 justify-center">
            {#if googleLogin.processing}
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
          aria-label="Přepnout na přihlášení s heslem"
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
          aria-label="Přepnout na přihlášení bez hesla"
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
          <LoginPassword />
        {:else}
          <LoginEmail />
        {/if}
      </div>

      <!-- Tertiary Actions -->
      <hr class="my-2" />
      <div class="flex flex-col gap-2">
        <a href="/novy-ucet" class="btn btn-light w-full" aria-label="Vytvořit nový účet">
          <div class="flex items-center gap-2 justify-center">
            <User size={16} />
            Vytvořit nový účet
          </div>
        </a>
        <a
          href="/zapomenute-heslo"
          class="text-sm text-center text-gray-600 hover:text-gray-900 py-2 transition-colors"
          aria-label="Obnovit zapomenuté heslo"
        >
          Zapomněli jste heslo?
        </a>
      </div>
    </Card>
  </div>
</WebPage>
