<script lang="ts">
import Editor from "../../Editor/Editor.svelte";
import Input from "./Input.svelte";

type Props = {
	id: string;
	label: string;
	name: string;
	class?: string;
	content?: string;
	placeholder?: string;
	error?: string[] | undefined;
	setValue?: (value: string) => void;
};

let {
	id,
	label,
	class: className = "",
	content = $bindable(""),
	placeholder,
	name,
	error,
	setValue,
}: Props = $props();

function setInputValue(e: string) {
	error = undefined;
	setValue?.(e);
}
</script>

<Input {id} {label} {error}>
  <Editor
    {name}
    {placeholder}
    class={className}
    bind:content
    setContent={setInputValue}
  />
</Input>
