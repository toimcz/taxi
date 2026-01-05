<script lang="ts">
import { RegisterPasswordInput } from "@taxi/contracts";
import {
	InputEmail,
	InputPassword,
	InputPhone,
	InputText,
	SubmitButton,
	useForm,
	useToastStore,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

const toast = useToastStore();

// DO NOT USE DESTRUCTURING HERE, IT WILL BREAK THE FORM
const form = useForm(RegisterPasswordInput, {
	onSuccess: async () => {
		toast.add("message", "Účet byl úspěšně vytvořen.");
		goto("/");
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
});
</script>

<div>
  <h1 class="text-center text-xl font-bold mb-1">
    Vytvořit nový účet s heslem
  </h1>
  <p class="text-xs text-gray-500 text-center">
    Budete se přihlašovat emailem a heslem.
  </p>
  <form
    method="POST"
    action="novy-ucet?/password"
    class="mt-5 grid grid-cols-2 gap-2"
    use:enhance={form.submit}
  >
    <div class="col-span-2">
      <InputEmail
        id="email"
        name="email"
        label="Email"
        value=""
        error={form.issues?.email}
      />
    </div>
    <div class="col-span-1">
      <InputPassword
        id="password"
        name="password"
        label="Heslo"
        value=""
        error={form.issues?.password}
      />
    </div>
    <div class="col-span-1">
      <InputPassword
        id="passwordConfirm"
        name="passwordConfirm"
        label="Heslo znovu"
        value=""
        error={form.issues?.passwordConfirm}
      />
    </div>
    <div class="col-span-1">
      <InputText
        id="firstName"
        name="firstName"
        label="Jméno"
        value=""
        error={form.issues?.firstName}
      />
    </div>
    <div class="col-span-1">
      <InputText
        id="lastName"
        name="lastName"
        label="Příjmení"
        value=""
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
      />
    </div>
    <div class="col-span-2 flex justify-between">
      <SubmitButton class="w-full" processing={form.processing}
        >Vytvořit účet</SubmitButton
      >
    </div>
  </form>
</div>
