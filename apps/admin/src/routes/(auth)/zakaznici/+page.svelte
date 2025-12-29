<script lang="ts">
import { Car, CirclePlus } from "@lucide/svelte";
import { Card } from "@taxi/ui";
import { debounce } from "@taxi/utils/debounce";
import { onMount } from "svelte";
import { WebPage } from "$lib/components/WebPage/index.js";
import { usersSearch } from "$lib/remotes/users.remote";

let title = "Zákazníci";
let description = "Seznam zákazníků";

let users = usersSearch({ query: "" });

const handleSearch = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
	const target = e.target as HTMLInputElement;
	usersSearch({ query: target.value }).refresh();
};

const handleSearchDebounce = debounce(handleSearch, 500);

onMount(async () => {
	usersSearch({ query: "" }).refresh();
});
</script>

<WebPage {title} {description}>
  <Card>
    <div class="mb-2 flex items-center justify-between lg:px-3">
      <div>
        <p class="text-2xl font-extrabold">{title}</p>
      </div>
      <div class="flex items-center gap-x-3">
        <div class=" text-slate-600">Počet: {users.current?.meta?.total || 0}</div>
        <a href="/zakaznici/novy" class="flex items-center">
          <CirclePlus size={18} class="text-blue-400 hover:text-blue-500" />
        </a>
      </div>
    </div>
    <hr />
    <div>
      <input
        type="search"
        oninput={handleSearchDebounce}
        class="bg-slate-100! py-2! w-full rounded-xl px-5 focus:outline-none focus:ring-1 focus:ring-blue-200"
        placeholder="Hledat..."
      />
    </div>
    <div class="mt-3 hidden lg:block">
      <div class="datatable">
        <div class="tr">
          <div class="th">Jméno</div>
          <div class="th">Email</div>
          <div class="th">Telefon</div>
          <div class="th">Role</div>
          <div class="th">Posl. přihlášení</div>
          <div class="th">&nbsp;</div>
        </div>
        {#if users.error}
          <p>oops!</p>
        {:else if users.loading}
          <p>loading...</p>
        {:else if users.current?.data}
          {#each users.current.data as user (user.id)}
            {@const link = `/zakaznici/${user.id}`}
            <div class="tr">
              <a class="td" href={link}>{user.name}</a>
              <a class="td" href={link}>{user.email}</a>
              <a class="td" href={link}>{user.phone || '-'}</a>
              {#if user.role}
                <a class="td" href={link}>{user.role}</a>
              {:else}
                <a class="td" href={link}>-</a>
              {/if}
              <a class="td" href={link}>{user.lastLoginAt?.toLocaleString() || ''}</a>
              <a class="td" href="{link}/objednavka">
                <Car size={22} class="text-blue-400 hover:text-blue-500" />
              </a>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    <div class="rounded-base bg-body mt-3 block lg:hidden">
      {#if users.error}
        <p>oops!</p>
      {:else if users.loading}
        <p>loading...</p>
      {:else if users.current?.data}
        {#each users.current.data as user (user.id)}
          {@const link = `/zakaznici/${user.id}`}
          <div class="flex items-center justify-between py-1">
            <a class="td" href={link}>{user.name}</a>
            <a class="td" href="{link}/objednavka">
              <Car size={22} class="text-blue-400 hover:text-blue-500" />
            </a>
            <div>
              <a href="/zakaznici/{user.id}/objednavka" class="px-2">
                <Car size={22} class=" text-blue-400 hover:text-blue-500" />
              </a>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </Card>
</WebPage>

{#snippet link(id: string, value: string)}
  <a href="/zakaznici/{id}" class="block w-full">
    {value}
  </a>
{/snippet}
