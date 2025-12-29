<script lang="ts">
import Editor from "../../Editor/Editor.svelte";
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	content?: string;
	placeholder?: string;
	error?: string[] | undefined;
	setValue?: (value: string) => void;
};

let { id, label, content = $bindable(""), placeholder, name, error, setValue }: Props = $props();

function setInputValue(e: Event) {
	const v = (e.target as HTMLInputElement).value;
	error = undefined;
	setValue?.(v);
}
</script>

<Input {id} {label} {error}>
  <Editor {name} {placeholder} bind:content />
</Input>
