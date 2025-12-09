<script lang="ts">
  import { CardLink } from '@taxi/ui';

  type Props = {
    service: {
      title: string;
      slug: string;
      photo: string;
      description: string;
    };
  };

  const { service }: Props = $props();
</script>

<CardLink title={service.title} href="/sluzby/{service.slug}">
  <img src="/img/services/{service.photo}" alt={service.title} class="w-full object-cover" />
  <div class="flex flex-col items-center gap-2 p-8">
    <h2 class="text-primary text-xl font-bold">{service.title}</h2>
    <hr class="border-primary my-2! w-full border-t-2" />
    <p class="text-sm leading-6 text-gray-500">{service.description}</p>
  </div>
</CardLink>
