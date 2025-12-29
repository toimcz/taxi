<script lang="ts">
import {
	Bolt,
	BookOpen,
	Bug,
	CarTaxiFront,
	ChevronsLeft,
	CircleDollarSign,
	CreditCard,
	FileUp,
	Globe,
	House,
	LogOut,
	Mail,
	MapPinned,
	MessageCircleQuestionMark,
	Route,
	Settings,
	Users,
} from "@lucide/svelte";
import type { Role } from "@taxi/contracts";
import { onMount } from "svelte";
import { enhance } from "$app/forms";
import { page } from "$app/state";
import Logo from "$lib/components/Logo/Logo.svelte";

const ICON_SIZE = 18;

let open = $state(false);

function toggleSidebar() {
	open = !open;
}

onMount(() => {
	const as = document.querySelectorAll("a");
	as.forEach((a) => {
		a.addEventListener("click", () => {
			open = false;
		});
	});
});

type AllIcons =
	| typeof Bolt
	| typeof BookOpen
	| typeof Bug
	| typeof CarTaxiFront
	| typeof ChevronsLeft
	| typeof CircleDollarSign
	| typeof CreditCard
	| typeof FileUp
	| typeof House
	| typeof LogOut
	| typeof Mail
	| typeof MapPinned
	| typeof MessageCircleQuestionMark
	| typeof Route
	| typeof Settings
	| typeof Globe;

type Link = {
	name: string;
	href: string;
	roles?: Role[];
	icon: AllIcons;
};

const links: Link[] = [
	{
		name: "Transfery",
		href: "/transfery",
		roles: [],
		icon: Route,
	},
	{
		name: "Zákazníci",
		href: "/zakaznici",
		icon: Users,
	},
	{
		name: "Platby",
		href: "/platby",
		icon: CircleDollarSign,
	},
	{
		name: "Dopravci",
		href: "/dopravci",
		icon: CarTaxiFront,
	},
	{
		name: "Emaily",
		href: "/emaily",
		icon: Mail,
	},
	{
		name: "Základny",
		href: "/zakladny",
		icon: House,
	},
	{
		name: "Staty",
		href: "/staty",
		icon: Globe,
	},
	{
		name: "Otázky",
		href: "/otazky",
		icon: MessageCircleQuestionMark,
	},
	{
		name: "Platební metody",
		href: "/platebni-metody",
		icon: CreditCard,
	},
	{
		name: "Články",
		href: "/clanky",
		icon: FileUp,
	},
	{
		name: "Stránky",
		href: "/stranky",
		icon: BookOpen,
	},
	{
		name: "Služby",
		href: "/sluzby",
		icon: Bolt,
	},
	{
		name: "Destinace",
		href: "/destinace",
		icon: MapPinned,
	},
	{
		name: "Nastavení",
		href: "/nastaveni",
		icon: Settings,
	},
	{
		name: "Chyby systému",
		href: "/chyby",
		icon: Bug,
	},
];
</script>

<nav id="sidebar" class:close={!open}>
  <ul>
    <li class="flex items-center justify-end">
      <Logo />
      <button
        onclick={toggleSidebar}
        id="toggle-btn"
        aria-label="Toggle sidebar"
        class:rotate-180={!open}
      >
        <ChevronsLeft size={ICON_SIZE} class="text-slate-500" />
      </button>
    </li>
    {#each links as { name, href, roles, icon: Icon }}
      {#if !roles || roles.length === 0 || roles.some( (role) => page.data.auth?.role.includes(role) )}
        <li class:active={page.url.pathname.includes(href)}>
          <a {href}>
            <Icon size={ICON_SIZE} />
            <span>{name}</span>
          </a>
        </li>
      {/if}
    {/each}
    <li>
      <form method="POST" action="/?/logout" use:enhance>
        <button type="submit">
          <LogOut size={ICON_SIZE} class="text-orange-600 dark:text-orange-300" />
          <span>Odhlásit</span>
        </button>
      </form>
    </li>
  </ul>
</nav>

<style>
  #sidebar {
    box-sizing: border-box;
    height: auto;
    width: 250px;
    margin: 10px;
    padding: 5px 1em;
    border-radius: var(--radius-base);
    border-right: 3px solid var(--color-one);
    position: sticky;
    top: 0;
    align-self: start;
    transition: 300ms ease-in-out;
    overflow: hidden;
  }
  #sidebar.close {
    padding: 4px;
    width: 50px;
  }
  #sidebar ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.3em;
    padding-bottom: 1em;
  }
  #sidebar > ul > li {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.7em;
    padding-left: 0.8em;
  }
  #sidebar > ul > li:first-child {
    display: flex;
    justify-content: flex-end;
  }

  #sidebar > ul > li.active > a {
    color: var(--color-primary);
  }

  #sidebar a,
  #sidebar form button,
  #sidebar :global(button.theme-toggle),
  #sidebar :global(svg) {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 1em;
  }
  #sidebar a span,
  #sidebar form button span,
  #sidebar :global(button.theme-toggle span) {
    flex-grow: 1;
    white-space: nowrap;
  }
  #sidebar a:hover {
    background-color: var(--hover-clr);
  }

  #toggle-btn {
    margin-left: auto;
    padding: 0 0.7em;
    border: none;
    border-radius: 0.5em;
    background: none;
    cursor: pointer;

    :global(svg) {
      transition: rotate 150ms ease;
    }
  }
  #toggle-btn:hover {
    background-color: var(--hover-clr);
  }

  @media (max-width: 800px) {
    #sidebar {
      height: 65px;
      width: 100%;
      border-right: none;
      border-top: 1px solid var(--line-clr);
      padding: 0;
      margin: 0;
      position: fixed;
      top: unset;
      bottom: 0;
      z-index: 100;
      > ul {
        padding: 0;
        display: grid;
        grid-auto-columns: 60px;
        grid-auto-flow: column;
        align-items: center;
        overflow-x: scroll;
        /* hide scrollbar */
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      ul li {
        height: 100%;
      }
      ul a,
      ul form button {
        width: 60px;
        height: 60px;
        padding: 0;
        border-radius: 0;
        justify-content: center;
      }

      ul li span,
      ul li:first-child {
        display: none;
      }
    }
    #sidebar.close {
      padding: 0;
      margin: 0;
      width: 100%;
    }
  }
</style>
