<script lang="ts">
import { useLoginEmail } from "@taxi/client-auth";
import { InputEmail } from "@taxi/ui";
import { goto, invalidateAll } from "$app/navigation";
import { PUBLIC_APP_URL } from "$env/static/public";
import { SubmitButton } from "$lib/components/Button";
import { useToastStore } from "$lib/stores";

const toast = useToastStore();

// DO NOT USE DESTRUCTURING HERE, IT WILL BREAK THE FORM
const form = useLoginEmail({
	onSuccess: async () => {
		await invalidateAll();
		toast.add("message", "Odkaz pro přihlášení byl odeslán na váš email.");
		goto("/");
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
});
</script>

<div>
  <h1 class="text-center text-xl font-bold">Přihlášení přes email</h1>
  <div class="text-center">
    <p class="text-sm text-gray-500">Na váš email bude odeslán odkaz pro přihlášení.</p>
  </div>
  <form method="POST" class="mt-5 flex flex-col gap-4" onsubmit={form.submit}>
    <InputEmail
      id="email"
      name="email"
      label="Email"
      value=""
      placeholder="Vyplňte váš email"
      error={form.issues?.email}
    />

    <div class="flex items-center gap-2 justify-center">
      <input type="hidden" name="redirectUrl" value={PUBLIC_APP_URL} />
      <SubmitButton class="w-full" processing={form.processing}
        >Získat odkaz pro přihlášení</SubmitButton
      >
    </div>
  </form>
</div>
