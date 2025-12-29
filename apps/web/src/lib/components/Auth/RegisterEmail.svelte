<script lang="ts">
import { useRegisterPasswordless } from "@taxi/client-auth";
import { InputEmail, InputPhone, InputText } from "@taxi/ui";
import { goto, invalidateAll } from "$app/navigation";
import { PUBLIC_APP_URL } from "$env/static/public";
import { SubmitButton } from "$lib/components/Button";
import { useToastStore } from "$lib/stores";

const toast = useToastStore();

// DO NOT USE DESTRUCTURING HERE, IT WILL BREAK THE FORM
const form = useRegisterPasswordless({
	onSuccess: async () => {
		await invalidateAll();
		toast.add("message", "Odkaz pro registraci byl odeslán na váš email.");
		goto("/");
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
});
</script>

<div>
  <h1 class="text-center text-xl font-bold mb-1">Vytvořit nový účet bez hesla</h1>
  <p class="text-xs text-gray-500 text-center">
    Budete se přihlašovat odkazem, který Vám bude zaslán na email.
  </p>
  <form method="POST" class="mt-5 grid grid-cols-2 gap-2" onsubmit={form.submit}>
    <div class="col-span-2">
      <InputEmail
        id="email"
        name="email"
        label="Email"
        value=""
        autocomplete="email"
        placeholder="Vyplňte svůj email"
        error={form.issues?.email}
      />
    </div>
    <div class="col-span-1">
      <InputText
        id="firstName"
        name="firstName"
        label="Jméno"
        value=""
        autocomplete="given-name"
        placeholder="Vyplňte své jméno"
        error={form.issues?.firstName}
      />
    </div>
    <div class="col-span-1">
      <InputText
        id="lastName"
        name="lastName"
        label="Příjmení"
        value=""
        autocomplete="family-name"
        placeholder="Vyplňte své příjmení"
        error={form.issues?.lastName}
      />
    </div>
    <div class="col-span-2">
      <InputPhone
        id="phone"
        name="phone"
        label="Telefon"
        value=""
        error={form.issues?.phone}
        autocomplete="tel"
        placeholder="Vyplňte své telefonní číslo"
      />
    </div>
    <div class="col-span-2 flex justify-between">
      <input type="hidden" name="redirectUrl" value={PUBLIC_APP_URL} />
      <SubmitButton class="w-full" processing={form.processing}>Vytvořit účet</SubmitButton>
    </div>
  </form>
</div>
