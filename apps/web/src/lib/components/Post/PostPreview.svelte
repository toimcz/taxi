<script lang="ts">
  import { MoveRight } from '@lucide/svelte';
  import { CardLink } from '@taxi/ui';

  type Props = {
    post: {
      title: string;
      slug: string;
      photo: string;
      description: string;
      categorySlug: string;
    };
  };

  const { post }: Props = $props();
</script>

<CardLink href="/blog/{post.categorySlug}/{post.slug}" title={post.title}>
  <img src={post.photo} alt={post.title} class="w-full object-cover" />
  <div class="flex min-h-[300px] flex-col gap-2 p-8">
    <h2 class="text-primary text-lg font-bold">{post.title}</h2>
    <div class="flex-1">
      <p class="leading-6 text-gray-700">{post.description}</p>
    </div>
    <div class="flex items-start">
      <button type="button" class="btn btn-light">
        <div class="flex items-center gap-x-2">
          <span>Číst více</span>
          <MoveRight class="ml-2" />
        </div>
      </button>
    </div>
  </div>
</CardLink>
