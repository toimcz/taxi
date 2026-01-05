<script lang="ts">
import { PaymentUpdateInput } from "@taxi/contracts";
import {
	Card,
	Input,
	InputDate,
	InputMoney,
	InputNumber,
	InputSwitch,
	InputText,
	SubmitButton,
	useForm,
	useToastStore,
	WebPage,
} from "@taxi/shared";
import { enhance } from "$app/forms";
import { goto } from "$app/navigation";

let { data } = $props();

const toast = useToastStore();

const form = useForm(PaymentUpdateInput, {
	onSuccess: async () => {
		toast.add("message", "Platba byla úspěšně uložena");
		await goto(`/platby`);
	},
	onError: async () => {
		toast.add("error", "Chyba ve formuláři");
	},
});
</script>

<WebPage title="Detail platby" description="Detail platby">
  <div class="flex justify-center">
    <div class="w-full max-w-lg">
      <Card>
        <h1 class="mb-4 text-xl font-bold">Platba</h1>
        <form
          method="post"
          class="grid grid-cols-1 gap-4"
          use:enhance={form.submit}
        >
          <div class="grid grid-cols-6 gap-4">
            <div class="col-span-3">
              <InputDate
                id="payment-created-at"
                label="Datum vytvoření"
                name="createdAt"
                value={data.payment.createdAt.input}
                error={form.issues?.createdAt}
              />
            </div>
            <div class="col-span-3">
              <InputDate
                id="payment-due-at"
                label="Splatnost"
                name="dueAt"
                bind:value={data.payment.dueAt.input}
                error={form.issues?.dueAt}
              />
            </div>
            <div class="col-span-3">
              <InputMoney
                id="payment-amount"
                label="Částka"
                name="amount"
                bind:value={data.payment.amount}
                error={form.issues?.amount}
              />
            </div>
            <div class="col-span-3">
              <InputNumber
                id="payment-vat"
                label="DPH %"
                value={data.payment.vatRate}
                name="vat"
                min={0}
                max={100}
                step={1}
                error={form.issues?.vat}
              />
            </div>
            <div class="col-span-3">
              <InputDate
                id="payment-paid-at"
                label="Datum zaplacení"
                name="paidAt"
                value={data.payment.paidAt?.input || ""}
                error={form.issues?.paidAt}
              />
            </div>
            <div class="col-span-3">
              <InputText
                id="payment-reference-number"
                label="Referenční číslo"
                name="referenceId"
                bind:value={data.payment.referenceId}
                error={form.issues?.referenceId}
              />
            </div>
            <div class="col-span-6">
              <InputText
                id="payment-description"
                label="Popis"
                name="description"
                bind:value={data.payment.description}
                error={form.issues?.description}
              />
            </div>
            <div class="col-span-6">
              <Input
                id="payment-payment-methods"
                label="Platební metoda"
                error={form.issues?.paymentMethodId}
              >
                <select
                  id="payment-payment-methods"
                  name="paymentMethodId"
                  bind:value={data.payment.paymentMethodId}
                >
                  <option value="">Vyberte platební metodu</option>
                  {#each data.paymentMethods as paymentMethod (paymentMethod.id)}
                    <option value={paymentMethod.id}
                      >{paymentMethod.name}</option
                    >
                  {/each}
                </select>
              </Input>
            </div>
            {#if !data.payment.invoiceId}
              <div class="col-span-6">
                <InputSwitch
                  id="payment-invoice"
                  label="Do faktur"
                  name="isInvoice"
                  checked={false}
                  error={form.issues?.isInvoice}
                />
              </div>
            {/if}
          </div>
          <div class="grid grid-cols-6 gap-4">
            <div class="col-span-6">
              <h3 class="mb-1 pl-4 uppercase">Fakturační údaje</h3>
            </div>
            <div class="col-span-3">
              <InputText
                id="payment-billing-name"
                label="Jméno"
                name="billingName"
                value={data.payment.billingDetails.name}
                error={form.issues?.billingName}
              />
            </div>
            <div class="col-span-3">
              <InputText
                id="payment-billing-company"
                label="Firma"
                name="billingCompany"
                value={data.payment.billingDetails.company}
                error={form.issues?.billingCompany}
              />
            </div>
            <div class="col-span-6">
              <InputText
                id="payment-billing-street"
                label="Ulice"
                name="billingStreet"
                value={data.payment.billingDetails.street}
                error={form.issues?.billingStreet}
              />
            </div>
            <div class="col-span-2">
              <InputText
                id="payment-billing-zip"
                label="PSČ"
                name="billingZip"
                value={data.payment.billingDetails.zip}
                error={form.issues?.billingZip}
              />
            </div>
            <div class="col-span-4">
              <InputText
                id="payment-billing-city"
                label="Město"
                name="billingCity"
                value={data.payment.billingDetails.city}
                error={form.issues?.billingCity}
              />
            </div>
            <div class="col-span-6">
              <InputText
                id="payment-billing-country"
                label="Stát"
                name="billingCountry"
                value={data.payment.billingDetails.country}
                error={form.issues?.billingCountry}
              />
            </div>
            <div class="col-span-3">
              <InputText
                id="payment-billing-ic"
                label="IČ"
                name="billingIc"
                value={data.payment.billingDetails.ic}
                error={form.issues?.billingIc}
              />
            </div>
            <div class="col-span-3">
              <InputText
                id="payment-billing-dic"
                label="DIČ"
                name="billingDic"
                value={data.payment.billingDetails.dic}
                error={form.issues?.billingDic}
              />
            </div>
          </div>
          <div>
            <SubmitButton processing={form.processing}>
              {form.processing ? `Ukládám...` : `Uložit`}
            </SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  </div></WebPage
>
