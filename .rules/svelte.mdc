---
description: Enforce Svelte 5 Runes and SvelteKit 2 conventions for all Svelte and TypeScript files.
alwaysApply: true
glob: "**/*.svelte,**/*.ts"
---

# 🎯 Svelte 5 Runes and Reactivity (Priority 1: Core State Management)

## Reactive State ($state)

1. **Local Component State:** Always use the **`$state()`** rune for reactive local component state. **FORBIDDEN:** Never use `let` for values that need reactivity:
   ```typescript
   // ✅ CORRECT - Reactive state
   let count = $state(0);
   let items = $state<string[]>([]);

   // ❌ FORBIDDEN - Non-reactive
   let count = 0; // Will not trigger updates
   ```

2. **Immutable State:** For constants that should never change after initialization, use **`$state.frozen()`** to prevent accidental mutations:
   ```typescript
   let config = $state.frozen({ apiUrl: "https://api.example.com", timeout: 5000 });
   ```

3. **Deep Reactivity:** `$state()` provides deep reactivity for objects and arrays. Mutations at any level trigger updates:
   ```typescript
   let user = $state({ profile: { name: "John", age: 30 } });
   user.profile.age = 31; // Triggers reactivity
   ```

4. **Private State in Classes:** When creating class-based stores, use private fields with `#` prefix and expose via getters:
   ```typescript
   export class Store {
     #count = $state(0);

     get count() {
       return this.#count;
     }

     increment() {
       this.#count++;
     }
   }
   ```

## Derived Values ($derived)

5. **Computed Values:** Always use **`$derived()`** for computed values that depend on reactive state. **FORBIDDEN:** NEVER use Svelte 4 reactive statements (`$: computed = ...`):
   ```typescript
   // ✅ CORRECT - Svelte 5 derived
   let count = $state(0);
   let doubled = $derived(count * 2);

   // ❌ FORBIDDEN - Svelte 4 syntax
   $: doubled = count * 2;
   ```

6. **Complex Derivations:** Use **`$derived.by()`** for complex computations requiring multiple statements or dependencies on external state:
   ```typescript
   let search = $state("");
   let items = $state([/* ... */]);

   let filtered = $derived.by(() => {
     const term = search.toLowerCase().trim();
     if (!term) return items;
     return items.filter(item => item.name.toLowerCase().includes(term));
   });
   ```

7. **Derived in Classes:** In class-based stores, use getters for computed properties:
   ```typescript
   export class SearchStore {
     #adults = $state(0);
     #children = $state(0);
     #infants = $state(0);

     get totalPassengers() {
       return this.#adults + this.#children + this.#infants;
     }
   }
   ```

## Component Props ($props)

8. **Props Definition:** Always use the **`$props()`** rune for component properties with TypeScript interface typing:
   ```typescript
   <script lang="ts">
   type Props = {
     id: string;
     label: string;
     value?: string;
     error?: string[];
     onchange?: (value: string) => void;
   };

   const { id, label, value = "", error, onchange }: Props = $props();
   </script>
   ```

9. **Bindable Props:** For two-way binding, use **`$bindable()`** with a default value:
   ```typescript
   type Props = {
     show: boolean;
     class?: string;
   };

   let { show = $bindable(false), class: className = "" }: Props = $props();

   // Parent usage: <Modal bind:show={modalOpen} />
   ```

10. **Renaming Props:** Use TypeScript destructuring to rename props that conflict with reserved words:
    ```typescript
    let { class: className, for: htmlFor }: Props = $props();
    ```

11. **Props Destructuring Warning:** When using props in hooks/forms, **DO NOT destructure** if the entire object reference is needed for reactivity. Use the whole object:
    ```typescript
    // ✅ CORRECT - Preserves reactivity
    const form = useForm({ onSuccess, onError });

    // ❌ MAY BREAK - If hook relies on object reference
    const { processing, submit } = useForm({ onSuccess, onError });
    ```

## Side Effects and Lifecycle ($effect)

12. **Side Effects:** Always use **`$effect()`** for all side effects (DOM manipulation, subscriptions, logging):
    ```typescript
    $effect(() => {
      console.log(`Count changed to: ${count}`);
      // Runs whenever count changes
    });
    ```

13. **Effect Cleanup:** Return a cleanup function from effects for subscriptions, timers, or event listeners:
    ```typescript
    $effect(() => {
      const timer = setTimeout(() => {
        console.log("Delayed action");
      }, 1000);

      return () => clearTimeout(timer);
    });
    ```

14. **One-Time Effects:** For effects that should run only once (like `onMount` in Svelte 4), use **`$effect.root()`** or check a flag:
    ```typescript
    // Option 1: Using $effect.root
    $effect.root(() => {
      // Runs once on mount
      fetchData();
    });

    // Option 2: Manual flag
    let mounted = $state(false);
    $effect(() => {
      if (!mounted) {
        mounted = true;
        fetchData();
      }
    });
    ```

15. **Effect Tracking Detection:** Use **`$effect.tracking()`** to conditionally run code only inside effects:
    ```typescript
    if ($effect.tracking()) {
      $effect(() => {
        // This effect only registers if accessed reactively
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
      });
    }
    ```

# 🧩 Svelte 5 Component Structure

## Snippets and Slots

16. **Children as Snippets:** For component children, use the **`Snippet`** type from `svelte`:
    ```typescript
    import type { Snippet } from "svelte";

    type Props = {
      header?: Snippet;
      children: Snippet;
      footer?: Snippet;
    };

    const { header, children, footer }: Props = $props();

    // Render with {@render}
    {@render header?.()}
    {@render children()}
    {@render footer?.()}
    ```

17. **Snippet Parameters:** Snippets can receive parameters for render props pattern:
    ```typescript
    type Props = {
      items: string[];
      children: Snippet<[string, number]>; // [item, index]
    };

    {#each items as item, i}
      {@render children(item, i)}
    {/each}
    ```

18. **Slot Checking:** Always use the **`$slots`** rune to check if slots/snippets have been passed:
    ```typescript
    <script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
      header?: Snippet;
      children: Snippet;
    };

    const { header, children }: Props = $props();
    </script>

    {#if $slots.header}
      <div class="header">
        {@render header?.()}
      </div>
    {/if}
    ```

## Event Handling

19. **Event Handlers:** Use standard HTML attributes for events (`onclick`, `onsubmit`, `oninput`), **NOT** Svelte 4 directives (`on:click`):
    ```svelte
    <!-- ✅ CORRECT - Svelte 5 -->
    <button onclick={handleClick}>Click</button>
    <form onsubmit={handleSubmit}>
    <input oninput={handleInput}>

    <!-- ❌ FORBIDDEN - Svelte 4 syntax -->
    <button on:click={handleClick}>Click</button>
    ```

20. **Event Modifiers:** For event modifiers (preventDefault, stopPropagation), handle manually in the event handler:
    ```typescript
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      // ... handle submit
    };
    ```

21. **Custom Events via Callbacks:** Prefer callback props over `createEventDispatcher` unless the event needs to bubble through the component hierarchy:
    ```typescript
    // ✅ PREFERRED - Callback props
    type Props = {
      onClose?: () => void;
      onSubmit?: (data: FormData) => void;
    };

    const { onClose, onSubmit }: Props = $props();

    <button onclick={() => onClose?.()}>Close</button>

    // ❌ AVOID - Unless bubbling is needed
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    ```

22. **Custom Event Names:** For custom events on native elements (via actions), use lowercase event names with namespacing:
    ```typescript
    // In action
    node.dispatchEvent(new CustomEvent("clickoutside"));

    // In component
    <div use:clickOutside onclickoutside={close}>
    ```

# 🏪 State Management Patterns

## Reactive Modules (.svelte.ts)

23. **File Extension:** For reactive state modules (stores, hooks), use the **`.svelte.ts`** extension. This enables Svelte compiler features in TypeScript files:
    ```
    ✅ CORRECT structure:
    lib/
      stores/
        toast.svelte.ts
        session.svelte.ts
      hooks/
        use-form.svelte.ts
        use-auth.svelte.ts
    ```

24. **Class-Based Stores:** Create stores as classes with private reactive state and public getters/methods:
    ```typescript
    // stores/toast.svelte.ts
    export class ToastStore {
      #toasts = $state<Toast[]>([]);

      get toasts() {
        return this.#toasts;
      }

      add(type: "error" | "message", message: string, duration = 5000) {
        const id = crypto.randomUUID();
        this.#toasts.push({ id, message, type });

        setTimeout(() => this.remove(id), duration);
      }

      remove(id: string) {
        this.#toasts = this.#toasts.filter(t => t.id !== id);
      }
    }
    ```

## Context-Based Store Pattern

25. **Store Initialization:** Initialize stores in root layout using `setContext()` with Symbol keys:
    ```typescript
    // stores/toast.svelte.ts
    import { getContext, setContext } from "svelte";

    const TOAST_KEY = Symbol("toast");

    export const setToastStore = () => setContext(TOAST_KEY, new ToastStore());

    export const useToastStore = () =>
      getContext<ToastStore>(TOAST_KEY);

    // +layout.svelte
    <script lang="ts">
    import { setToastStore } from "$lib/stores";

    setToastStore();
    </script>
    ```

26. **Context Guard Pattern:** For stores that might not exist, check with `hasContext()` and create if needed:
    ```typescript
    export const useSearchStore = () => {
      if (!hasContext(SEARCH_KEY)) {
        setSearchStore();
      }
      return getContext<SearchStore>(SEARCH_KEY);
    };
    ```

27. **Scoped Context Stores:** For component-specific state, use context with `hasContext()` to prevent re-initialization:
    ```typescript
    export const useLoginPassword = ({ onSuccess, onError }: AuthProps) => {
      if (!hasContext(LOGIN_PASSWORD_KEY)) {
        setContext(
          LOGIN_PASSWORD_KEY,
          new UserLoginPassword({ onSuccess, onError })
        );
      }
      return getContext<UserLoginPassword>(LOGIN_PASSWORD_KEY);
    };
    ```

## Browser Storage Integration

28. **SessionStorage/LocalStorage Sync:** For persistent reactive state, create wrapper classes with Proxy-based reactivity:
    ```typescript
    export class SessionStorage<T> {
      #key: string;
      #version = $state(0);
      #value: T | undefined;

      constructor(key: string, initial?: T) {
        this.#key = key;

        if (typeof sessionStorage !== "undefined") {
          const stored = sessionStorage.getItem(key);
          if (stored === null) {
            sessionStorage.setItem(key, JSON.stringify(initial));
            this.#value = initial;
          } else {
            this.#value = JSON.parse(stored);
          }
        }
      }

      get current() {
        // Trigger reactivity
        this.#version;

        if (typeof sessionStorage === "undefined") {
          return this.#value;
        }

        return JSON.parse(sessionStorage.getItem(this.#key)!);
      }

      set current(value: T) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(this.#key, JSON.stringify(value));
        }
        this.#value = value;
        this.#version++;
      }
    }
    ```

29. **Storage Event Sync:** For cross-tab synchronization, listen to storage events with automatic cleanup:
    ```typescript
    #listeners = 0;

    #handler = (e: StorageEvent) => {
      if (e.storageArea !== sessionStorage) return;
      if (e.key !== this.#key) return;
      this.#version++;
    };

    get current() {
      // ... proxy logic ...

      if ($effect.tracking()) {
        $effect(() => {
          if (this.#listeners === 0) {
            window.addEventListener("storage", this.#handler);
          }
          this.#listeners++;

          return () => {
            this.#listeners--;
            if (this.#listeners === 0) {
              window.removeEventListener("storage", this.#handler);
            }
          };
        });
      }

      return proxy(root);
    }
    ```

# 📝 Form Handling Patterns

## Form Hooks

30. **Custom Form Hooks:** Create reusable form handling hooks in `.svelte.ts` files with class-based architecture:
    ```typescript
    // hooks/use-form.svelte.ts
    import type { SubmitFunction } from "@sveltejs/kit";
    import { applyAction } from "$app/forms";

    export type SubmitFormProps = {
      onSuccess: (toast: ToastStore) => void | Promise<void>;
      onError?: (toast: ToastStore) => void | Promise<void>;
    };

    export function useForm({ onSuccess, onError }: SubmitFormProps) {
      const toast = useToastStore();
      let processing = $state(false);
      const issues = $state<Record<string, string[]>>({});

      const submit: SubmitFunction = () => {
        processing = true;
        return async ({ result }) => {
          if (result.type === "success") {
            await onSuccess(toast);
          } else if (result.type === "failure") {
            if (result.data && typeof result.data === "object") {
              Object.entries(result.data).forEach(([key, value]) => {
                if (value) {
                  issues[key] = typeof value === "string" ? [value] : value;
                }
              });
            }
            if (result.data?.message) {
              toast.add("error", result.data.message);
            }
            await onError?.(toast);
          }
          processing = false;
          await applyAction(result);
        };
      };

      return {
        get processing() { return processing; },
        submit,
        issues,
      };
    }
    ```

31. **Form Validation with Valibot:** For client-side validation, integrate Valibot schemas with form hooks:
    ```typescript
    import { safeParse, flatten, type FlatErrors } from "valibot";

    export class AuthBase<T extends BaseSchema> {
      #processing = $state(false);
      #issues = $state<FlatErrors<T>["nested"]>();

      constructor(
        private readonly url: string,
        private readonly schema: T,
        private readonly props: AuthProps,
      ) {}

      submit = async (e: Event) => {
        e.preventDefault();
        this.#processing = true;
        this.#issues = undefined;

        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const body = Object.fromEntries(formData.entries());

        const validated = safeParse(this.schema, body);
        if (!validated.success) {
          this.#issues = flatten(validated.issues).nested;
          this.#processing = false;
          return;
        }

        // ... submit validated data
      };
    }
    ```

32. **Form Error Display:** Pass validation errors to input components via props:
    ```svelte
    <InputEmail
      id="email"
      name="email"
      label="Email"
      value=""
      error={form.issues?.email}
    />
    ```

# ⚙️ SvelteKit 2 Architecture and Data Flow

## Page Loading

33. **Load Functions:** All page data fetching **MUST** be done in a `load` function within **`+page.ts`** or **`+page.server.ts`**:
    ```typescript
    // +page.server.ts
    import { error } from "@sveltejs/kit";
    import { api } from "$lib/server/api";

    export const load = async () => {
      const [posts, services] = await Promise.all([
        api().posts.allPublished.get({ query: { limit: "9", page: "1" } }),
        api().services.allActive.get(),
      ]);

      if (posts.error || services.error) {
        error(500, "Failed to load data");
      }

      return {
        posts: posts.data,
        services: services.data,
      };
    };
    ```

34. **Server vs Client Loaders:** Prefer **`+page.server.ts`** for:
    - Database queries
    - API calls requiring secrets
    - Server-only logic

    Use **`+page.ts`** only when client-side data fetching is necessary.

35. **Load Function Return Types:** TypeScript automatically infers the return type. Access via `data` prop:
    ```svelte
    <script lang="ts">
    // Type is inferred from load function
    let { data } = $props();

    // data.posts and data.services are fully typed
    </script>
    ```

36. **URL Parameters:** Access route parameters via the `params` argument:
    ```typescript
    // routes/blog/[slug]/+page.server.ts
    export const load = async ({ params }) => {
      const { slug } = params;

      const post = await api().posts.bySlug.get({ params: { slug } });

      if (post.error) {
        error(404, "Post not found");
      }

      return { post: post.data };
    };
    ```

## Form Actions

37. **Form Actions:** For all data mutation operations (`POST`, `PUT`, `DELETE`), use **SvelteKit Form Actions** defined in **`+page.server.ts`**:
    ```typescript
    // +page.server.ts
    import { fail, redirect } from "@sveltejs/kit";
    import { superValidate } from "sveltekit-superforms/server";

    export const actions = {
      create: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get("email");

        // Validate
        if (!email) {
          return fail(400, { email: ["Email is required"] });
        }

        // Process
        await createUser(email);

        redirect(303, "/success");
      },

      delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get("id");

        await deleteUser(id);

        return { success: true };
      },
    };
    ```

38. **Action Usage:** Use `use:enhance` for progressive enhancement:
    ```svelte
    <script lang="ts">
    import { enhance } from "$app/forms";

    let processing = $state(false);
    </script>

    <form
      method="POST"
      action="?/create"
      use:enhance={() => {
        processing = true;
        return async ({ result, update }) => {
          processing = false;
          await update();
        };
      }}
    >
      <!-- form fields -->
    </form>
    ```

39. **FORBIDDEN - No Direct Fetch for Mutations:** **NEVER** use client-side `fetch` to call SvelteKit endpoints for mutations. Always use form actions or dedicated API routes:
    ```typescript
    // ❌ FORBIDDEN - Don't fetch mutations from pages
    const handleSubmit = async () => {
      await fetch("/api/users", { method: "POST", body: JSON.stringify(data) });
    };

    // ✅ CORRECT - Use form actions
    <form method="POST" action="?/create">
    ```

## API Routes

40. **API Endpoints:** Use **`+server.ts`** files strictly for **public APIs** consumed by external applications (mobile apps, webhooks), not for internal page logic:
    ```typescript
    // routes/api/webhook/+server.ts
    import { json } from "@sveltejs/kit";

    export const POST = async ({ request }) => {
      const payload = await request.json();

      // Process webhook
      await handleWebhook(payload);

      return json({ success: true });
    };
    ```

41. **API Route Exports:** Export handler functions named after HTTP methods:
    ```typescript
    export const GET = async ({ url }) => { /* ... */ };
    export const POST = async ({ request }) => { /* ... */ };
    export const PUT = async ({ request, params }) => { /* ... */ };
    export const DELETE = async ({ params }) => { /* ... */ };
    ```

## Routing and Navigation

42. **Import Aliases:** Always prefer the **`$lib`** alias for all shared components and utilities:
    ```typescript
    // ✅ CORRECT
    import { Button } from "$lib/components/Button";
    import { api } from "$lib/server/api";

    // ❌ AVOID - Relative paths
    import { Button } from "../../components/Button";
    ```

43. **Programmatic Navigation:** Use `goto` from `$app/navigation` for client-side navigation:
    ```typescript
    import { goto } from "$app/navigation";

    const handleSuccess = async () => {
      await goto("/dashboard");
    };
    ```

44. **Data Invalidation:** Use `invalidateAll()` to refetch data after mutations:
    ```typescript
    import { invalidateAll } from "$app/navigation";

    const handleSubmit = async () => {
      await submitForm();
      await invalidateAll(); // Refetches all load functions
    };
    ```

# 🎨 Component Patterns and Best Practices

## Component Organization

45. **File Structure:** Organize components by feature with barrel exports:
    ```
    lib/components/
      Auth/
        LoginEmail.svelte
        LoginPassword.svelte
        RegisterPassword.svelte
        index.ts              # Export all
      Button/
        SubmitButton.svelte
        index.ts
      Toast/
        Toast.svelte
        index.ts
    ```

46. **Barrel Exports:** Create `index.ts` files to simplify imports:
    ```typescript
    // components/Button/index.ts
    export { default as SubmitButton } from "./SubmitButton.svelte";

    // Usage
    import { SubmitButton } from "$lib/components/Button";
    ```

## TypeScript Integration

47. **Component Props Interface:** Always define a `Props` type for component properties:
    ```typescript
    <script lang="ts">
    type Props = {
      id: string;
      label: string;
      value?: string;
      error?: string[];
      disabled?: boolean;
      onchange?: (value: string) => void;
    };

    const {
      id,
      label,
      value = "",
      error,
      disabled = false,
      onchange
    }: Props = $props();
    </script>
    ```

48. **Avoid Enums:** Prefer TypeScript union types over enums for better type inference:
    ```typescript
    // ✅ CORRECT
    type AuthMethod = "password" | "magic-link" | "oauth";
    let method = $state<AuthMethod>("password");

    // ❌ AVOID
    enum AuthMethod {
      Password = "password",
      MagicLink = "magic-link",
    }
    ```

49. **Generic Components:** For reusable components with generic types, define type parameters:
    ```typescript
    <script lang="ts" generics="T">
    type Props = {
      items: T[];
      keyFn: (item: T) => string;
      children: Snippet<[T]>;
    };

    const { items, keyFn, children }: Props = $props();
    </script>

    {#each items as item (keyFn(item))}
      {@render children(item)}
    {/each}
    ```

## Styling Patterns

50. **Class Merging Utility:** Use utility functions for conditional class names:
    ```typescript
    import { cn } from "@taxi/utils"; // classnames or clsx

    <div class={cn(
      "base-classes",
      condition && "conditional-classes",
      className // From props
    )}>
    ```

51. **Dynamic Classes:** Use template literals for dynamic classes:
    ```svelte
    <button
      class="btn {variant === 'primary' ? 'btn-primary' : 'btn-secondary'}"
      class:disabled={isDisabled}
    >
    ```

52. **Class Directive:** Use the `class:` directive for conditional classes:
    ```svelte
    <div
      class="form-group"
      class:error={error?.length}
      class:disabled={disabled}
      class:focused={isFocused}
    >
    ```

# 🔧 Advanced Patterns

## Actions

53. **Action Definition:** Create custom actions with proper TypeScript typing:
    ```typescript
    // actions/click-outside.ts
    import type { Action } from "svelte/action";

    export const clickOutside: Action<HTMLElement> = (node) => {
      const handleClick = (event: MouseEvent) => {
        if (
          node &&
          !node.contains(event.target as Node) &&
          !event.defaultPrevented
        ) {
          node.dispatchEvent(new CustomEvent("clickoutside"));
        }
      };

      document.addEventListener("click", handleClick, true);

      return {
        destroy() {
          document.removeEventListener("click", handleClick, true);
        },
      };
    };
    ```

54. **Action with Parameters:** For actions that accept parameters, use the `update` method:
    ```typescript
    export const tooltip: Action<HTMLElement, string> = (node, content) => {
      let tooltipEl: HTMLElement;

      const show = () => {
        tooltipEl = document.createElement("div");
        tooltipEl.textContent = content;
        document.body.appendChild(tooltipEl);
      };

      const hide = () => {
        tooltipEl?.remove();
      };

      node.addEventListener("mouseenter", show);
      node.addEventListener("mouseleave", hide);

      return {
        update(newContent: string) {
          content = newContent;
        },
        destroy() {
          node.removeEventListener("mouseenter", show);
          node.removeEventListener("mouseleave", hide);
          hide();
        },
      };
    };
    ```

55. **Action Usage:** Apply actions with the `use:` directive:
    ```svelte
    <div
      use:clickOutside
      onclickoutside={handleClose}
    >
      Modal content
    </div>
    ```

## Component Composition

56. **Compound Components:** For complex components, use multiple sub-components:
    ```svelte
    <!-- Card.svelte -->
    <script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
      children: Snippet;
      class?: string;
    };

    let { children, class: className = "" }: Props = $props();
    </script>

    <div class="card {className}">
      {@render children()}
    </div>

    <!-- CardTitle.svelte -->
    <div class="card-title">
      {@render children()}
    </div>

    <!-- Usage -->
    <Card>
      <CardTitle>Title</CardTitle>
      <p>Content</p>
    </Card>
    ```

57. **Render Props Pattern:** Use snippets with parameters for flexible rendering:
    ```typescript
    type Props = {
      data: Array<{ id: string; name: string }>;
      renderItem: Snippet<[{ id: string; name: string }]>;
      renderEmpty?: Snippet;
    };

    {#if data.length === 0}
      {@render renderEmpty?.()}
    {:else}
      {#each data as item (item.id)}
        {@render renderItem(item)}
      {/each}
    {/if}
    ```

## Performance Optimization

58. **Key Blocks:** Always provide unique keys for `{#each}` blocks:
    ```svelte
    <!-- ✅ CORRECT -->
    {#each items as item (item.id)}
      <div>{item.name}</div>
    {/each}

    <!-- ❌ AVOID - Can cause issues with reordering -->
    {#each items as item}
      <div>{item.name}</div>
    {/each}
    ```

59. **Lazy Components:** Use dynamic imports for code splitting:
    ```typescript
    let showHeavyComponent = $state(false);

    {#if showHeavyComponent}
      {#await import("$lib/components/HeavyComponent.svelte") then { default: HeavyComponent }}
        <HeavyComponent />
      {/await}
    {/if}
    ```

60. **Memoization:** For expensive computations, use `$derived.by()` which automatically memoizes:
    ```typescript
    let items = $state([/* large array */]);
    let filter = $state("");

    // Automatically memoized - only recomputes when items or filter change
    let filtered = $derived.by(() => {
      return items.filter(item => item.name.includes(filter));
    });
    ```

# 🚨 Common Pitfalls and Forbidden Patterns

## Svelte 4 Legacy Syntax

61. **FORBIDDEN - Reactive Statements:** Never use `$:` reactive statements:
    ```typescript
    // ❌ FORBIDDEN
    $: doubled = count * 2;
    $: console.log(count);

    // ✅ CORRECT
    let doubled = $derived(count * 2);
    $effect(() => console.log(count));
    ```

62. **FORBIDDEN - Svelte 4 Event Syntax:** Never use `on:` directive for events:
    ```svelte
    <!-- ❌ FORBIDDEN -->
    <button on:click={handler}>Click</button>

    <!-- ✅ CORRECT -->
    <button onclick={handler}>Click</button>
    ```

63. **FORBIDDEN - Svelte 4 Store Syntax:** Never use writable/readable stores pattern:
    ```typescript
    // ❌ FORBIDDEN
    import { writable } from "svelte/store";
    const count = writable(0);

    // ✅ CORRECT
    let count = $state(0);
    ```

## Reactivity Issues

64. **Destructuring Props:** Be careful when destructuring props if you need reactivity:
    ```typescript
    // ⚠️ MAY LOSE REACTIVITY
    let { value } = $props();
    // value is now a static reference

    // ✅ CORRECT - Keep props object
    let props = $props();
    // Access via props.value to maintain reactivity

    // ✅ ALSO CORRECT - Destructure if you don't need live updates
    let { id, label } = $props(); // Static values are fine
    ```

65. **Array Mutations:** `$state()` tracks array mutations, but reassignment is clearer:
    ```typescript
    let items = $state<string[]>([]);

    // ✅ Both work, but reassignment is clearer
    items = [...items, "new item"];
    items.push("new item"); // Also works with $state
    ```

66. **Object Property Assignment:** Direct property mutation works with `$state()`:
    ```typescript
    let user = $state({ name: "John", age: 30 });

    // ✅ Both trigger reactivity
    user.age = 31;
    user = { ...user, age: 31 };
    ```

# 📋 Project-Specific Best Practices

## API Client Pattern

67. **Eden Treaty Client:** Use Eden Treaty for type-safe API calls:
    ```typescript
    // lib/server/api.ts
    import { treaty } from "@elysiajs/eden";
    import type { App } from "@taxi/server";

    export const api = () => treaty<App>("http://localhost:4000");

    // Usage in load functions
    const posts = await api().posts.allPublished.get({
      query: { limit: "9", page: "1" }
    });

    if (posts.error) {
      error(500, "Failed to load posts");
    }

    return { posts: posts.data };
    ```

68. **Error Handling:** Always check for errors from API calls:
    ```typescript
    const result = await api().users.byId.get({ params: { id } });

    if (result.error) {
      if (result.status === 404) {
        error(404, "User not found");
      }
      error(500, "Failed to load user");
    }

    return { user: result.data };
    ```

## Layout Patterns

69. **Root Layout Setup:** Initialize global stores in root layout:
    ```svelte
    <!-- +layout.svelte -->
    <script lang="ts">
    import { setToastStore, setSearchStore } from "$lib/stores";

    let { children, data } = $props();

    // Initialize global stores
    setToastStore();
    setSearchStore();
    </script>

    <div class="app">
      {@render children()}
    </div>
    ```

70. **Nested Layouts:** Use nested layouts for route groups:
    ```
    routes/
      +layout.svelte              # Root layout
      (guest)/
        +layout.svelte            # Guest layout (no auth required)
        prihlasit/
          +page.svelte
        novy-ucet/
          +page.svelte
      (auth)/
        +layout.server.ts         # Auth check
        +layout.svelte            # Authenticated layout
        dashboard/
          +page.svelte
    ```

# ✅ Pre-Commit Checklist

Before committing Svelte code:

- [ ] All reactive state uses `$state()`, not `let`
- [ ] Computed values use `$derived()` or `$derived.by()`
- [ ] Props use `$props()` with TypeScript interface
- [ ] Side effects use `$effect()` with cleanup
- [ ] Event handlers use native attributes (`onclick`), not `on:click`
- [ ] Children use `Snippet` type
- [ ] Snippets rendered with `{@render children()}`
- [ ] No Svelte 4 syntax (`$:`, `on:`, writable stores)
- [ ] Forms use SvelteKit actions, not direct fetch
- [ ] Load functions in `+page.server.ts`, not in components
- [ ] API calls use Eden Treaty client with error handling
- [ ] Class-based stores use private fields (`#field`)
- [ ] Context stores use Symbol keys
- [ ] Actions have proper TypeScript types
- [ ] Components have `Props` interface
- [ ] `{#each}` blocks have unique keys
- [ ] Import paths use `$lib` alias

---

## 📚 References

- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/overview#runes)
- [SvelteKit Routing](https://kit.svelte.dev/docs/routing)
- [TypeScript in Svelte](https://svelte.dev/docs/typescript)
