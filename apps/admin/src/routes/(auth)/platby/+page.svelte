<script lang="ts">
import { Card, WebPage } from "@taxi/shared";

let title = "Poslední platby";
let description = "Seznam posledních plateb";

let { data } = $props();
</script>

<WebPage {title} {description}>
  <Card>
    <h1 class="text-xl font-bold">{title}</h1>
    <hr />
    <div class="datatable">
      <div class="tr">
        <div class="th w-24">ID</div>
        <div class="th text-left!">Popis</div>
        <div class="th">Částka</div>
      </div>
      {#each data.payments as payment (payment.paymentId)}
        <a href="/platby/{payment.paymentId}" class="tr">
          <div class="td">{payment.id}</div>
          <div class="td text-left!">{payment.description}</div>
          <div class="td">
            <span
              class:text-success={payment.status === "SUCCEEDED"}
              class:text-danger={payment.status === "CANCELED"}
            >
              {payment.amount}
              {payment.currency}
            </span>
          </div>
        </a>
      {/each}
    </div>
  </Card>
  <div class="grid grid-cols-1 gap-y-1 lg:hidden">
    {#each data.payments as p (p.paymentId)}
      <a href="/platby/{p.paymentId}" class="flex justify-between gap-x-2">
        <div>{p.id}</div>
        <div class="text-left!">{p.description}</div>
        <div>
          <span
            class:text-success={p.status === "SUCCEEDED"}
            class:text-danger={p.status === "CANCELED"}
          >
            {p.amount}
          </span>
        </div>
      </a>
    {/each}
    <div class="pt-2 text-center text-sm">
      N - nakládka V - vykládka K - kabotáž
    </div>
  </div>
</WebPage>
