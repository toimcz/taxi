<script lang="ts">
import { LoginPasswordInput } from "@taxi/contracts";
import {
	Card,
	Google,
	InputEmail,
	InputPassword,
	Spinner,
	SubmitButton,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

const title = "Přihlášení";
const description = "Přihlášení do systému";

const toast = useToastStore();

const formLoginPassword = useForm(LoginPasswordInput, {
	onSuccess: async () => {
		toast.add("message", "Přihlášení úspěšné");
		await goto("/");
	},
	onError: async () => {
		toast.add("error", "Nepodařilo se přihlásit");
	},
});

const formLoginGoogle = useForm(undefined, {
	onSuccess: async (data) => {
		toast.add("message", "Přihlášení úspěšné");
		window.location.href = data.authUrl as string;
	},
	onError: async () => {
		toast.add("error", "Nepodařilo se přihlásit");
	},
});
</script>

<WebPage {title} {description}>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md">
      <Card>
        <h1 class="text-center text-xl font-bold">Přihlášení do účtu</h1>
        <hr />
        <form
          method="POST"
          action="?/google"
          class="flex flex-col gap-2"
          use:enhance={formLoginGoogle.submit}
        >
          <button
            type="submit"
            class="btn btn-google"
            disabled={formLoginGoogle.processing}
            aria-label="Přihlásit se přes Google"
          >
            <div class="flex items-center gap-2 justify-center">
              {#if formLoginGoogle.processing}
                <Spinner />
              {:else}
                <Google />
              {/if}
              Přihlásit se přes Google
            </div>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-2">
          <hr class="flex-1 border-gray-200" />
          <span class="text-sm text-gray-500 font-medium">nebo</span>
          <hr class="flex-1 border-gray-200" />
        </div>
        <h2 class="text-center text-lg font-semibold">
          Přihlášení přes email a heslo
        </h2>
        <form
          method="POST"
          action="?/password"
          class="mt-5 flex flex-col gap-4"
          use:enhance={formLoginPassword.submit}
        >
          <InputEmail
            id="email"
            name="email"
            label="Email"
            placeholder="Vyplňte svůj email"
            value=""
            error={formLoginPassword.issues?.email}
          />
          <InputPassword
            id="password"
            name="password"
            label="Heslo"
            placeholder="Vyplňte své heslo"
            value=""
            error={formLoginPassword.issues?.password}
          />
          <div class="flex justify-between">
            <SubmitButton
              class="w-full"
              processing={formLoginPassword.processing}>Přihlásit</SubmitButton
            >
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
