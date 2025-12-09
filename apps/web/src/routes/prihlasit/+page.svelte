<script lang="ts">
  import { Card, CardTitle, Google, InputEmail, InputPassword } from '@taxi/ui';
  import { email, type FlatErrors, flatten, object, pipe, safeParse, string } from 'valibot';
  import { goto } from '$app/navigation';
  import { PUBLIC_APP_URL } from '$env/static/public';
  import { $ERROR_CODES as ERROR_CODES, signIn } from '$lib/auth-client';
  import { WebPage } from '$lib/components/WebPage';
  import { useToastStore } from '$lib/stores/index.js';

  const title = 'Přihlášení';
  const description = 'Přihlášení do systému';

  const SignInSchema = object({
    email: pipe(string(), email()),
    password: string(),
  });

  export const parseAuthError = (error: string | undefined, fallback: string) => {
    if (!error) {
      return fallback;
    }
    if (typeof error === 'string') {
      switch (error as keyof typeof ERROR_CODES) {
        case 'INVALID_EMAIL':
          return 'Zadaný email je neplatný.';
        case 'INVALID_EMAIL_OR_PASSWORD':
          return 'Zadaný email nebo heslo je neplatné.';
        case 'USER_ALREADY_EXISTS':
          return 'Uživatel s tímto emailem již existuje.';
        default:
          return fallback;
      }
    }
    return fallback;
  };

  let login = $state({
    email: '',
    password: '',
  });
  let errors = $state<FlatErrors<typeof SignInSchema>['nested']>({});
  let processing = $state(false);
  let errorMessage = $state('');
  const toast = useToastStore();

  async function handleSignIn(e: Event) {
    e.preventDefault();
    const validated = safeParse(SignInSchema, login);
    if (!validated.success) {
      errors = flatten(validated.issues).nested;
      processing = false;
      return;
    }
    const { error } = await signIn.email(login, {
      onSuccess: () => {
        toast.add('message', 'Přihlášení bylo úspěšné.');
        processing = false;
        goto('/');
      },
    });
    if (error) {
      setErrorMessage(error.code);
    }
  }

  async function handleGoogleSignIn() {
    processing = true;
    const { error } = await signIn.social({
      provider: 'google',
      callbackURL: PUBLIC_APP_URL,
    });
    if (error) {
      setErrorMessage('Nepodařilo se přihlásit přes Google.');
    } else {
      processing = false;
    }
  }

  function setErrorMessage(message: string | undefined) {
    processing = false;
    errorMessage = parseAuthError(message, 'Neplatné přihlášení.');
    toast.add('error', errorMessage);
    setTimeout(() => {
      errorMessage = '';
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
