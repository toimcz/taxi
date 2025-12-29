<script lang="ts">
import { Briefcase, UsersIcon } from "@lucide/svelte";
import type { CarWithPrice } from "@taxi/contracts";
import { text } from "@taxi/utils";

type Props = {
	bookingId: string;
	car: CarWithPrice;
};

let { car, bookingId }: Props = $props();

let discount = $derived(Math.floor(car.price / 10));
let price = $derived(car.price + discount);
</script>

<a
  href="/objednavka?bookingId={bookingId}&carId={car.id}"
  title="Objednat {car.name}"
  class="rounded-base bg-one block border border-transparent p-4 transition-all hover:cursor-pointer hover:shadow-2xl"
>
  <div class="mx-6 flex justify-center">
    <img src="/img/cars/{car.photo}" alt={car.name} class="object-cover" />
  </div>
  <div class="flex flex-col gap-2 px-3 text-center">
    <div class="flex flex-col gap-0">
      <h3 class="text-lg font-bold">{car.name}</h3>
      <p class="text-xs text-gray-600">{car.types}</p>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center gap-x-2">
        <UsersIcon size={16} class="text-blue-600" />
        <span>{car.pax}</span>
      </div>
      <div class="flex items-center gap-x-2">
        <Briefcase size={16} class="text-blue-600" />
        <span>{car.luggage}</span>
      </div>
    </div>
    <p class="text-sm text-gray-500">{car.description}</p>
  </div>
  <div class="bg-one rounded-base p-2">
    <div class="flex justify-between gap-x-2 text-xs">
      <span>Cena</span>
      <span>{text.price(price, 0)}</span>
    </div>
    <div class="flex justify-between gap-x-2 text-xs text-red-600">
      <span>Dnešní sleva</span>
      <span>{text.price(discount, 0)}</span>
    </div>
    <div class="flex items-center justify-between gap-x-2 text-blue-600">
      <span>Cena po slevě</span>
      <span class="text-lg font-bold">{text.price(car.price, 0)}</span>
    </div>
  </div>
  <div class="flex justify-center">
    <button type="button" class="btn btn-primary w-full">Objednat</button>
  </div>
</a>
