<script lang="ts">
import { Role } from "@taxi/contracts/common";
import {
	Card,
	Input,
	InputEmail,
	InputPhone,
	InputText,
	InputTextarea,
} from "@taxi/ui";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";
import SubmitButton from "$lib/components/Button/SubmitButton.svelte";
import WebPage from "$lib/components/WebPage/WebPage.svelte";
import { useForm } from "$lib/hooks/use-form.svelte";

const title = "Nový zákazník";
const description = "Nový zákazník";

const { issues, processing, submit } = useForm({
	onSuccess: async (toast) => {
		toast.add("message", "Zákazník byl úspěšně vytvořen");
		await goto("/zakaznici");
	},
});
</script>

<WebPage {title} {description}>
  <div class="flex justify-center">
    <div class="w-full max-w-xl">
      <Card>
        <h1 class="text-lg font-bold">{title}</h1>
        <hr />
        <form method="post" class="grid grid-cols-2 gap-4" use:enhance={submit}>
          <InputText
            id="firstName"
            label="Jméno"
            value=""
            name="firstName"
            error={issues?.firstName}
          />
          <InputText
            id="lastName"
            label="Příjmení"
            value=""
            name="lastName"
            error={issues?.lastName}
          />
          <InputEmail id="email" label="Email" value="" name="email" error={issues?.email} />
          <InputPhone id="phone" label="Telefon" value="" name="phone" error={issues?.phone} />
          <div class="col-span-2">
            <InputTextarea
              id="note"
              label="Poznámka"
              value=""
              name="note"
              error={issues?.note}
              rows={3}
            />
          </div>
          <div class="col-span-2">
            <Input id="role" label="Role" error={issues?.role}>
              <select name="role" class="form-control" value="">
                {#each Object.values(Role) as role (role)}
                  <option value={role}>{role}</option>
                {/each}
              </select>
            </Input>
          </div>
          <div class="col-span-2">
            <p>Fakturační údaje</p>
          </div>
          <InputText id="name" label="Název" value="" name="name" error={issues?.name} />
          <InputText id="company" label="Firma" value="" name="company" error={issues?.company} />
          <div class="col-span-2">
            <InputText id="street" label="Ulice" value="" name="street" error={issues?.street} />
          </div>
          <InputText id="zip" label="PSČ" value="" name="zip" error={issues?.zip} />
          <InputText id="city" label="Město" value="" name="city" error={issues?.city} />
          <div class="col-span-2">
            <InputText id="country" label="Stát" value="" name="country" error={issues?.country} />
          </div>

          <InputText id="ic" label="IČ" value="" name="ic" error={issues?.ic} />
          <InputText id="dic" label="DIČ" value="" name="dic" error={issues?.dic} />
          <div class="col-span-2 flex justify-between gap-x-2">
            <SubmitButton processing={processing()}>Uložit</SubmitButton>
            <a href="/zakaznici" class="btn btn-light btn-sm">Zpět</a>
          </div>
        </form>
      </Card>
    </div>
  </div>
</WebPage>
