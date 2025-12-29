<script lang="ts">
import { CarCreateInput, CarUpdateInput } from "@taxi/contracts";
import { Card, InputMoney, InputNumber, InputPhoto, InputSwitch, InputText } from "@taxi/ui";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";
import { WebPage } from "$lib/components/index.js";
import { useForm } from "$lib/hooks/use-form.svelte.js";
import { useToastStore } from "$lib/stores/index.js";

let { data, params } = $props();
let backUrl = $derived(`/zakladny/${params.id}`);

const toast = useToastStore();

const title = $derived(data.car ? "Editace vozu" : "Vytvoření vozu");
const description = $derived(data.car ? "Editace vozu" : "Vytvoření vozu");

const formCreate = useForm(CarCreateInput, {
	onSuccess: async () => {
		toast.add("message", "Vůz byl úspěšně vytvořen");
		await goto(backUrl);
	},
	onError: async (message) => {
		toast.add("error", message);
	},
});

const formUpdate = useForm(CarUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Vůz byl úspěšně uložen");
		await goto(backUrl);
	},
	onError: async (message) => {
		toast.add("error", message);
	},
});

const form = $derived(data.car ? formUpdate : formCreate);
</script>

<WebPage {title} {description}>
  <Card class="mx-auto w-full max-w-3xl">
    <div class="mb-3 flex items-center justify-between gap-x-6">
      <h1 class="text-xl font-bold">{title}</h1>
      <a href={backUrl} class="btn btn-light btn-sm">Zpět</a>
    </div>
    <form method="post" enctype="multipart/form-data" class="grid grid-cols-6 gap-4" use:enhance>
      <div class="col-span-6 lg:col-span-3">
        <InputText
          id="name"
          label="Název kategorie"
          name="name"
          value={data.car?.name || ''}
          placeholder="Např Standard Car"
          error={form.issues?.name}
        />
      </div>
      <div class="col-span-6 lg:col-span-3">
        <InputText
          id="adminName"
          label="Název kategorie v adminu"
          name="adminName"
          value={data.car?.adminName || ''}
          error={form.issues?.adminName}
        />
      </div>
      <div class="col-span-6 lg:col-span-3">
        <InputText
          id="types"
          label="Typy vozů"
          name="types"
          value={data.car?.types || ''}
          placeholder="Např. Škoda Octavia, Škoda Superb"
          error={form.issues?.types}
        />
      </div>
      <div class="col-span-6 lg:col-span-3">
        <InputText
          id="description"
          label="Popis"
          name="description"
          value={data.car?.description || ''}
          placeholder="Např. WiFi zdarma, Voda zdarma ..."
          error={form.issues?.description}
        />
      </div>
      <div class="col-span-3 lg:col-span-1">
        <InputMoney
          id="priceKm"
          label="Cena za km"
          name="priceKm"
          value={data.car?.priceKm || 0}
          min={0}
          step={1}
          error={form.issues?.priceKm}
        />
      </div>
      <div class="col-span-3 lg:col-span-1">
        <InputMoney
          id="minPrice"
          label="Minimální cena"
          name="minPrice"
          value={data.car?.minPrice || 0}
          min={0}
          step={1}
          error={form.issues?.minPrice}
        />
      </div>
      <div class="col-span-5 lg:col-span-2">
        <InputMoney
          id="basePrice"
          label="Základní cena"
          name="basePrice"
          value={data.car?.basePrice || 0}
          min={0}
          step={1}
          error={form.issues?.basePrice}
        />
      </div>
      <div class="col-span-5 lg:col-span-2">
        <InputNumber
          id="pax"
          label="Max osob"
          name="pax"
          value={data.car?.pax || 0}
          min={0}
          step={1}
          error={form.issues?.pax}
        />
      </div>
      <div class="col-span-10 lg:col-span-2">
        <div class="w-1/2 lg:w-full">
          <InputNumber
            id="luggage"
            label="Max zavazadel"
            name="luggage"
            value={data.car?.luggage || 0}
            min={0}
            step={1}
            error={form.issues?.luggage}
          />
        </div>
      </div>
      <div class="col-span-10">
        <InputText
          id="tags"
          label="Tagy (Max 2 tagy)"
          name="tags"
          value={data.car?.tags || ''}
          placeholder="Např. Top Pick, Group Travel, atd."
          error={form.issues?.tags}
        />
      </div>
      <div class="col-span-5">
        <InputSwitch
          id="deposit"
          label="Platba předem"
          checked={data.car?.deposit || false}
          name="deposit"
          error={form.issues?.deposit}
        />
      </div>
      <div class="col-span-5">
        <InputSwitch
          id="perPerson"
          label="Cena za osobu"
          name="perPerson"
          checked={data.car?.perPerson || false}
          error={form.issues?.perPerson}
        />
      </div>
      <div class="col-span-5">
        <InputSwitch
          id="surge"
          label="Dynamika ceny"
          name="surge"
          checked={data.car?.surge || false}
          error={form.issues?.surge}
        />
      </div>
      <div class="col-span-5">
        <InputSwitch
          id="status"
          label="Status"
          name="status"
          checked={data.car?.status || false}
          error={form.issues?.status}
        />
      </div>
      <div class="col-span-10">
        <InputPhoto id="photo" imgUrl={data.car?.photo} name="photo" />
      </div>
      <div class="col-span-10">
        <button type="submit" class="btn btn-primary" disabled={form.processing}
          >{form.processing ? 'Ukládám' : data.car ? 'Uložit' : 'Vytvořit'}</button
        >
      </div>
    </form>
  </Card>
</WebPage>
