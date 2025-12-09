<script lang="ts">
import { WebPage } from "$lib/components/WebPage";

let { data } = $props();
</script>

<WebPage title={data.service.title} description={data.service.description}>
	<div class="mb-10 bg-slate-200 p-5">
		<div class="container">
			<h1 class="text-2xl font-bold">{data.service.title}</h1>
			<p class="text-gray-700">{data.service.description}</p>
		</div>
	</div>
	<div class="container">
		<div class="flex flex-col-reverse gap-4 px-5 lg:flex-row">
			<div class="flex-1">
				<div class="post-content">
					{@html data.service.content}
				</div>
			</div>
			<div class="w-full lg:max-w-[400px]">
				<div class="rounded-base h-full max-h-[600px] overflow-hidden">
					<img
						src="/img/services/{data.service.photo}"
						alt={data.service.title}
						class="h-full w-full object-cover"
					/>
				</div>
			</div>
		</div>
	</div></WebPage
>
