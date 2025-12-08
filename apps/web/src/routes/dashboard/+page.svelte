<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	const sessionQuery = authClient.useSession();


	onMount(() => {
		const { data: session, isPending } = $sessionQuery;
		if (!session && !isPending) {
			goto('/login');
		}
	});
</script>

{#if $sessionQuery.isPending}
	<div>Loading...</div>
{:else if !$sessionQuery.data}
{:else}
	<div>
		<h1>Dashboard</h1>
		<p>Welcome {$sessionQuery.data.user.name}</p>
	</div>
{/if}
