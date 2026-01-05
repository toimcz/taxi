<script lang="ts">
import { Google, Spinner, useForm, useToastStore } from "@taxi/shared";
import { enhance } from "$app/forms";

const toast = useToastStore();

const googleLogin = useForm<undefined, { url: string }>(undefined, {
	onSuccess: async ({ url }) => {
		window.location.href = url;
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
});
</script>

<!-- Primary Auth Method: Google -->
<form
  method="post"
  action="/prihlasit?/google"
  class="flex flex-col gap-2"
  use:enhance={googleLogin.submit}
>
  <h2 class="text-center text-lg font-semibold text-gray-700">Přihlásit se</h2>
  <button
    type="submit"
    class="btn btn-google"
    disabled={googleLogin.processing}
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
</form>
