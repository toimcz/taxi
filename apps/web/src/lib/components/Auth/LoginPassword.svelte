<script lang="ts">
import { LoginPasswordInput } from "@taxi/contracts";
import { InputEmail, InputPassword, SubmitButton, useForm, useToastStore } from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

const toast = useToastStore();

// DO NOT USE DESTRUCTURING HERE, IT WILL BREAK THE FORM
const form = useForm(LoginPasswordInput, {
	onSuccess: async () => {
		toast.add("message", "Přihlášení proběhlo úspěšně.");
		goto("/");
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
});
</script>

<div>
  <h1 class="text-center text-xl font-bold">Přihlášení přes email a heslo</h1>
  <form
    action="/prihlasit?/password"
    method="POST"
    class="mt-5 flex flex-col gap-4"
    use:enhance={form.submit}
  >
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
      <SubmitButton class="w-full" processing={form.processing}
        >Přihlásit</SubmitButton
      >
    </div>
  </form>
</div>
