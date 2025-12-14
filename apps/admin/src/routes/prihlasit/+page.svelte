<script lang="ts">
import { Card, CardTitle, Google, InputEmail, InputPassword } from "@taxi/ui";
import {
	email,
	type FlatErrors,
	flatten,
	object,
	pipe,
	safeParse,
	string,
} from "valibot";
import { goto } from "$app/navigation";
import { PUBLIC_ADMIN_URL } from "$env/static/public";
import { WebPage } from "$lib/components/WebPage";
import { useToastStore } from "$lib/stores/index.js";

const title = "Přihlášení";
const description = "Přihlášení do systému";

const SignInSchema = object({
	email: pipe(string(), email()),
	password: string(),
});

let login = $state({
	email: "",
	password: "",
});
let errors = $state<FlatErrors<typeof SignInSchema>["nested"]>({});
let processing = $state(false);
let errorMessage = $state("");
const toast = useToastStore();

async function handleSignIn(e: Event) {
	e.preventDefault();
	const validated = safeParse(SignInSchema, login);
	if (!validated.success) {
		errors = flatten(validated.issues).nested;
		processing = false;
		return;
	}
	const response = await fetch("/api/auth/login-password", {
		method: "POST",
		body: JSON.stringify(login),
	});
	if (!response.ok) {
		const error = await response.json();
		setErrorMessage(error.message);
	}
	toast.add("message", "Přihlášení bylo úspěšné.");
	processing = false;
	goto("/");
}

async function handleGoogleSignIn() {
	processing = true;
	// Use window.location for OAuth redirect (full page redirect, not fetch)
	window.location.href = `/api/auth/google?redirectUrl=${encodeURIComponent(PUBLIC_ADMIN_URL)}`;
}

function setErrorMessage(message: string | undefined) {
	processing = false;
	errorMessage = message ?? "Nepodařilo se přihlásit.";
	toast.add("error", errorMessage);
	setTimeout(() => {
		errorMessage = "";
	}, 6000);
}
</script>

<WebPage {title} {description}>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md">
      <Card>
        <CardTitle tag="h1">{title}</CardTitle>
        <form method="POST" class="mt-5 flex flex-col gap-4" onsubmit={handleSignIn}>
          <InputEmail
            id="email"
            name="email"
            label="Email"
            bind:value={login.email}
            error={errors?.email}
          />
          <InputPassword
            id="password"
            name="password"
            label="Heslo"
            bind:value={login.password}
            error={errors?.password}
          />
          {#if errorMessage}
            <p class="text-red-500">{errorMessage}</p>
          {/if}
          <div class="flex justify-between">
            <button type="submit" class="btn btn-primary" disabled={processing}
              >{processing ? 'Přihlášení...' : 'Přihlásit'}</button
            >
            <button
              type="button"
              class="btn btn-light"
              disabled={processing}
              onclick={handleGoogleSignIn}
            >
              <div class="flex items-center gap-2">
                <Google />
                Přihlásit přes Google
              </div>
            </button>
          </div>
        </form>
        <hr class="my-4" />
        <a href="/zapomenute-heslo" class="italic underline">Zapomenuté heslo</a>
      </Card>
    </div>
  </div>
</WebPage>
