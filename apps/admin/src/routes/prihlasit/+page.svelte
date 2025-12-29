<script lang="ts">
import type { SubmitFunction } from "@sveltejs/kit";
import { LoginGoogleInput, LoginPasswordInput } from "@taxi/contracts";
import { Card, Google, InputEmail, InputPassword, Spinner } from "@taxi/ui";
import type { FlatErrors } from "valibot";
import { enhance } from "$app/forms";
import { goto, invalidateAll } from "$app/navigation";
import { SubmitButton } from "$lib/components/Button";
import { WebPage } from "$lib/components/WebPage";
import { useToastStore } from "$lib/stores/index.js";

const title = "Přihlášení";
const description = "Přihlášení do systému";

const toast = useToastStore();

/* const loginPassword = useLoginPassword({
	onSuccess: async () => {
		await invalidateAll();
		toast.add("message", "Přihlášení bylo úspěšné.");
		goto("/");
	},
	onError: (message) => {
		toast.add("error", message);
	},
});

const googleLogin = useGoogleLogin(PUBLIC_ADMIN_URL, {
	onSuccess: async () => {
		await invalidateAll();
		toast.add("message", "Přihlášení bylo úspěšné.");
		goto("/");
	},
	onError: (message: string) => {
		toast.add("error", message);
	},
}); */

const loginPassword = () => {
	let processing = $state(false);
	let issues = $state<FlatErrors<typeof LoginPasswordInput>["nested"]>();
	const submit: SubmitFunction = async () => {
		return async ({ result }) => {
			if (result.type === "success") {
				console.log("OK");
				await invalidateAll();
				toast.add("message", "Přihlášení bylo úspěšné.");
				goto("/");
			} else if (result.type === "failure" && result.data?.issues) {
				issues = result.data.issues;
			} else {
				toast.add("error", "Přihlášení se nezdařilo. Zkontrolujte své údaje a zkuste to znovu.");
			}
			processing = false;
		};
	};

	return {
		submit,
		processing: () => processing,
		issues: () => issues,
	};
};

const loginGoogle = () => {
	let processing = $state(false);
	let issues = $state<FlatErrors<typeof LoginGoogleInput>["nested"]>();
	const submit: SubmitFunction = async () => {
		return async ({ result }) => {
			console.log(result);
			if (result.type === "success" && result.data?.authUrl) {
				await invalidateAll();
				toast.add("message", "Přihlášení bylo úspěšné.");
				window.location.href = result.data.authUrl;
			} else if (result.type === "failure" && result.data?.issues) {
				issues = result.data.issues;
			} else {
				toast.add("error", "Přihlášení se nezdařilo. Zkontrolujte své údaje a zkuste to znovu.");
			}
			processing = false;
		};
	};

	return {
		submit,
		processing: () => processing,
		issues: () => issues,
	};
};
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
          use:enhance={loginGoogle().submit}
        >
          <button
            type="submit"
            class="btn btn-google"
            disabled={loginGoogle().processing()}
            aria-label="Přihlásit se přes Google"
          >
            <div class="flex items-center gap-2 justify-center">
              {#if loginGoogle().processing()}
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
        <h2 class="text-center text-lg font-semibold">Přihlášení přes email a heslo</h2>
        <form
          method="POST"
          action="?/password"
          class="mt-5 flex flex-col gap-4"
          use:enhance={loginPassword().submit}
        >
          <InputEmail
            id="email"
            name="email"
            label="Email"
            placeholder="Vyplňte svůj email"
            value=""
            error={loginPassword().issues()?.email}
          />
          <InputPassword
            id="password"
            name="password"
            label="Heslo"
            placeholder="Vyplňte své heslo"
            value=""
            error={loginPassword().issues()?.password}
          />
          <div class="flex justify-between">
            <SubmitButton class="w-full" processing={loginPassword().processing()}
              >Přihlásit</SubmitButton
            >
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
