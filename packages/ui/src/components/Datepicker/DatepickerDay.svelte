<script lang="ts">
import { cn } from "@taxi/utils";
import {
	format,
	isAfter,
	isSameDay,
	isSunday,
	isToday,
	startOfDay,
	subDays,
} from "date-fns";

type Props = {
	day: Date;
	value?: Date | undefined;
	minDate?: Date;
	selectDate: (date: Date) => void;
};

const { day, value, minDate, selectDate }: Props = $props();

const isAllowed = (d: Date) => {
	let dayToCheck = startOfDay(d);
	if (minDate) {
		return isAfter(dayToCheck, startOfDay(subDays(minDate, 1)));
	}
	return true;
};

const isSelected = (d: Date) => {
	if (value) {
		return isSameDay(d, value);
	}
	return false;
};

const setDate = (d: Date) => {
	if (isAllowed(d)) {
		selectDate(d);
	}
};
</script>

<button
  type="button"
  class={cn(
    'relative cursor-pointer rounded-xl border border-transparent px-2.5 py-2 text-center font-semibold hover:bg-slate-100 hover:text-black',
    {
      'text-primary after:absolute after:left-0 after:right-0 after:top-0 after:mx-auto after:text-[9px] after:content-["dnes"]':
        isToday(day),
      'text-red-500 ': isSunday(day),
      'cursor-not-allowed text-gray-300': !isAllowed(day),
      'bg-primary text-lg text-black': isSelected(day),
    },
  )}
  onclick={(e) => {
    e.stopPropagation();
    setDate(day);
  }}
>
  {format(day, 'd')}
</button>
