<script lang="ts">
import { Fleet } from "$lib/components/Fleet/index.js";
import { Hero } from "$lib/components/Hero/index.js";
import { PostPreview } from "$lib/components/Post/index.js";
import { ServicePreview } from "$lib/components/Service/index.js";
import { WebPage } from "$lib/components/WebPage";
import { text } from "$lib/utils/text.js";

const title = "Home";
const description = "Home page";

let { data } = $props();
</script>
<WebPage {title} {description}>
    <Hero items={data.items} />
    	<div class="container pt-10">
		<h1 class="text-primary mb-10 text-center text-2xl font-bold md:text-3xl">
			Komfortní a spolehlivé taxi na letiště <br /> a přeprava mezi městy v České republice a Evropě
		</h1>
    {#if data.services.length > 0}
		<div class="my-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
			{#each data.services as service (service.id)}
				<ServicePreview {service} />
			{/each}
		</div>
    {/if}
    {#if data.posts.length > 0}
		<div class="my-20">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each data.posts as post (post.id)}
					<PostPreview {post} />
				{/each}
			</div>
		</div>
    {/if}
    {#if data.routes.length > 0}
		<div class="my-10">
			<div class="flex flex-wrap justify-center gap-5">
				{#each data.routes as route (route.id)}
					<a
						href="/taxi/preprava{route.url}"
						class="flex w-[450px] flex-col gap-1 rounded-xl bg-white px-4 py-2 transition-all duration-300 hover:scale-105"
					>
						<div class="text-lg">{route.title}</div>
						<div class="flex justify-between gap-2">
							<div class="text-sm">{route.distance} km</div>
							<div class="text-sm">{text.duration(route.duration)}</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
    {/if}
		<Fleet />
	</div>
</WebPage>
