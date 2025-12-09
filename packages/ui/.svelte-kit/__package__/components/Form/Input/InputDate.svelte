<script lang="ts">
import Datepicker from "../../Datepicker/Datepicker.svelte";
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	value?: string;
	placeholder?: string;
	error?: string[] | undefined;
	setValue?: (date: string) => void;
};

let {
	id,
	label,
	value = $bindable(""),
	placeholder = "Vyberte datum",
	name,
	error,
	setValue,
}: Props = $props();

function setDate(date: string) {
	error = undefined;
	setValue?.(date);
}
</script>

<Input {id} {label} {error}>
  <div class="form-control">
    <Datepicker id="date" {name} {value} minDate={new Date()} {placeholder} {setDate} />
  </div>
</Input>
