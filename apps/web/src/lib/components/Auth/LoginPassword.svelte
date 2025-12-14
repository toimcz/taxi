<script lang="ts">
import { InputEmail, InputPassword } from "@taxi/ui";
import { goto } from "$app/navigation";
import { SubmitButton } from "$lib/components/Button";
import { useLoginPassword } from "$lib/hooks/use-auth.svelte";

// DO NOT USE DESTRUCTURING HERE, IT WILL BREAK THE FORM
const form = useLoginPassword({
	onSuccess: async (toast) => {
		toast.add("message", "Přihlášení bylo úspěšné.");
		goto("/");
	},
	onError: (toast) => {
		toast.add("error", "Nepodařilo se přihlásit.");
	},
});
</script>

<div>
  <h1 class="text-center text-xl font-bold">Přihlášení přes email a heslo</h1>
  <form method="POST" class="mt-5 flex flex-col gap-4" onsubmit={form.submit}>
    <InputEmail
      id="email"
      name="email"
      label="Email"
      placeholder="Vyplňte svůj email"
      value=""
      error={form.issues?.email}
    />
    <InputPassword
      id="password"
      name="password"
      label="Heslo"
      placeholder="Vyplňte své heslo"
      value=""
      error={form.issues?.password}
    />
    <div class="flex justify-between">
      <SubmitButton class="w-full" processing={form.processing}>Přihlásit</SubmitButton>
    </div>
  </form>
</div>
