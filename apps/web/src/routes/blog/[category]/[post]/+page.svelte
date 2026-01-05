<script lang="ts">
import { CardLink, WebPage } from "@taxi/shared";

let { data } = $props();
const posts = $derived(data.category.posts.filter((post) => post.id !== data.post.id));
</script>

<WebPage title={data.post.title} description={data.post.description}>
  <div class="mb-10 bg-slate-200 p-5">
    <div class="container">
      <h1 class="text-2xl font-bold">{data.post.title}</h1>
      <p class="text-gray-700">{data.post.description}</p>
    </div>
  </div>
  <div class="container">
    <div class="flex flex-col justify-center gap-10 px-10 xl:flex-row">
      <div class="w-full xl:w-3/5">
        <div class="flex flex-col gap-10">
          <div class="rounded-base relative w-full overflow-hidden">
            <img
              src={data.post.photo}
              alt={data.post.title}
              class="h-full w-full object-cover"
            />
          </div>
          <div class="flex w-full flex-col items-start gap-4">
            <div class="post-content">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html data.post.content}
            </div>
          </div>
        </div>
      </div>
      {#if posts.length > 0}
        <div class="w-full xl:w-2/5 xl:px-10">
          <div class="flex flex-col gap-4">
            <h2 class="mb-2 text-xl font-bold">Další články</h2>
            <div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-1">
              {#each posts as post (post.id)}
                <CardLink
                  href="/blog/{data.category.slug}/{post.slug}"
                  title={post.title}
                >
                  <div class="overflow-hidden">
                    <img
                      src={post.photo}
                      alt={post.title}
                      class="w-full object-cover"
                    />
                  </div>
                  <div class="flex flex-col gap-2 p-8">
                    <div>
                      <h3 class="mb-2 text-xl font-bold">{post.title}</h3>
                      <p class="text-sm text-gray-500">{post.description}</p>
                    </div>
                    <div>
                      <a
                        href="/blog/{data.category.slug}/{post.slug}"
                        class="btn btn-light"
                        title="Číst více"
                      >
                        Číst více
                      </a>
                    </div>
                  </div>
                </CardLink>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div></WebPage
>
