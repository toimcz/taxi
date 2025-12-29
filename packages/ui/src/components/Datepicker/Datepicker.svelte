<script lang="ts">
import { ArrowLeft, ArrowRight, X } from "@lucide/svelte";
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	format,
	isSameMonth,
	startOfMonth,
	subMonths,
} from "date-fns";
import { cs } from "date-fns/locale";
import { createPopperActions } from "svelte-popperjs";
import { clickOutside } from "../../actions/click-outside.js";
import DatepickerDay from "./DatepickerDay.svelte";

const [popperRef, popperContent] = createPopperActions({
	placement: "bottom",
	strategy: "fixed",
});
const extraOpts = {
	modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
};

type Props = {
	id: string;
	name: string;
	value: string;
	placeholder?: string;
	minDate?: Date;
	class?: string;
	reset?: boolean;
	focus?: boolean;
	setDate?: (v: string) => void;
};

let {
	id,
	name,
	value = $bindable(""),
	placeholder,
	minDate,
	class: className = "",
	reset = false,
	focus = false,
	setDate,
}: Props = $props();

let el = $state<HTMLInputElement>();
let datepickerValue = $state<Date | undefined>(value ? new Date(value) : undefined);
let showTooltip = $state(false);
let startDate = $state(startOfMonth(new Date()));
let monthYear = $derived<string>(format(startDate, "LLLL yyyy", { locale: cs }));
let dayOfStartDay = $derived(startDate.getDay() ? startDate.getDay() - 1 : 6);
let dates = $derived(
	eachDayOfInterval({
		start: startDate,
		end: endOfMonth(startDate),
	}),
);
let isCurrentMonth = $derived(isSameMonth(startDate, new Date()));
let humanDate = $derived.by(() => {
	if (datepickerValue) {
		return format(datepickerValue, "EEE d MMM yyyy", { locale: cs });
	}
	return "";
});

const subMonth = () => {
	startDate = startOfMonth(subMonths(startDate, 1));
};

const addMonth = () => {
	startDate = startOfMonth(addMonths(startDate, 1));
};

const selectDate = (day: Date) => {
	value = format(day, "yyyy-MM-dd");
	setDate?.(value);
	datepickerValue = day;
	showTooltip = false;
};

const onClickOutside = () => {
	showTooltip = false;
};

const resetDate = () => {
	datepickerValue = undefined;
	setDate?.("");
};

$effect(() => {
	if (datepickerValue) {
		startDate = startOfMonth(datepickerValue);
	}
});

$effect(() => {
	if (el && focus) {
		el.focus();
	}
});
</script>

<div use:clickOutside onclickoutside={onClickOutside}>
  <div class="flex items-center justify-between">
    <input
      bind:this={el}
      {id}
      name="{name}Raw"
      type="text"
      class={className}
      {placeholder}
      value={humanDate}
      use:popperRef
      onfocus={() => (showTooltip = true)}
      autocomplete="off"
    />
    {#if reset}
      <button type="button" onclick={resetDate}>
        <X class="text-sm text-slate-400" />
      </button>
    {/if}
  </div>
  <input type="hidden" {value} {name} />

  {#if showTooltip}
    <div id="tooltip" class="z-50" use:popperContent={extraOpts}>
      <div class="rounded-base bg-one relative w-full max-w-sm p-5 shadow-2xl lg:max-w-lg">
        <div class="mb-3 flex items-center justify-between">
          <div class="uppercase">
            {monthYear}
          </div>
          <button
            type="button"
            disabled={typeof minDate !== 'undefined' && isCurrentMonth}
            onclick={subMonth}
          >
            {#if typeof minDate !== 'undefined' && isCurrentMonth}
              <div>&nbsp;</div>
            {:else}
              <ArrowLeft class="text-xl text-slate-500" />
            {/if}
          </button>
          <button type="button" onclick={addMonth}>
            <ArrowRight class="text-xl text-slate-500" />
          </button>
        </div>
        <div class="grid grid-cols-7 text-center">
          <div>Po</div>
          <div>Út</div>
          <div>St</div>
          <div>Čt</div>
          <div>Pá</div>
          <div>So</div>
          <div class="text-red-500">Ne</div>
        </div>
        {#if dates.length}
          <div class="grid grid-cols-7">
            {#if dayOfStartDay}
              <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
              {#each Array(dayOfStartDay)}
                <div>&nbsp;</div>
              {/each}
            {/if}
            {#each dates as day, i (i)}
              <DatepickerDay {day} value={datepickerValue} {minDate} {selectDate} />
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
