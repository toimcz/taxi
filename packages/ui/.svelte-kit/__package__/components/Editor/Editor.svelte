<script lang="ts">
// Import 1
import "quill/dist/quill.snow.css";
// Import 2
import type Quill from "quill";
import { onDestroy, onMount } from "svelte";

type Props = {
	class?: string;
	content: string;
	name: string;
	placeholder?: string;
};

let {
	content = $bindable(""),
	name,
	class: className = "",
	placeholder = "Napište obsah stránky...",
}: Props = $props();

let quill = $state<Quill | null>(null);
let editorEl = $state<HTMLElement>();

onMount(async () => {
	await import("quill").then(({ default: Quill }) => {
		if (!editorEl) return;
		quill = new Quill(editorEl, {
			modules: {
				toolbar: {
					container: [
						[{ header: 2 }, { header: 3 }, { header: 4 }],
						["bold", "italic", "underline", "strike", "link", "size", "blockquote"],
						[{ list: "ordered" }, { list: "bullet" }, { list: "" }],
						["clean"],
					],
				},
			},
			theme: "snow",
			placeholder,
		});
		quill.on("text-change", () => {
			const html = quill?.root.innerHTML || "";
			if (content !== html) {
				content = html;
			}
		});
	});
	quill?.clipboard.dangerouslyPasteHTML(content);
});

$effect(() => {
	if (!quill) return;
	const html = quill.root.innerHTML || "";
	if (content !== html) {
		quill.clipboard.dangerouslyPasteHTML(content || "");
	}
});

onDestroy(() => {
	quill?.setContents([]);
});
</script>

<div bind:this={editorEl} class={className}></div>
<input type="hidden" {name} value={content} />

<style>
  /* CSS Custom Properties for Editor */
  :root {
    --editor-border-color: #dadbdd;
    --editor-font-family: 'Geologica Variable', sans-serif;
    --editor-font-size: 0.925rem;
    --editor-line-height: 1.5;
    --editor-font-weight: 400;
    --editor-padding-vertical: 0.3rem;
    --editor-padding-horizontal: 0.25rem;
    --editor-min-height: 100px;
    --editor-max-height: min(800px, 50vh); /* Responsive max height */
    --editor-z-index: 0;
  }

  /* Quill Snow Theme Overrides */
  :global(.ql-snow) {
    position: relative;
    z-index: var(--editor-z-index);
    border: 0;
  }

  :global(.ql-container.ql-snow) {
    border: 1px solid transparent;
  }

  :global(.ql-toolbar.ql-snow) {
    border: 0;
    border-bottom: 1px solid var(--editor-border-color);
    box-sizing: border-box;
    padding: 0 0 var(--editor-padding-vertical) 0;
    background-color: transparent;
    width: 100%;
    display: block; /* Changed from inline-block for better layout */
  }

  :global(.ql-snow .ql-editor) {
    padding: var(--editor-padding-vertical) var(--editor-padding-horizontal);
    border: 0;
    font-family: var(--editor-font-family);
    font-size: var(--editor-font-size);
    line-height: var(--editor-line-height);
    font-weight: var(--editor-font-weight);
    outline: none;
    min-height: var(--editor-min-height);
    max-height: var(--editor-max-height);
    overflow-y: auto;
    position: relative;
    z-index: var(--editor-z-index);
  }

  :global(.ql-editor.ql-blank::before) {
    color: rgba(0, 0, 0, 0.6);
    content: attr(data-placeholder);
    font-style: italic;
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    :root {
      --editor-font-size: 1rem;
      --editor-max-height: 40vh;
      --editor-padding-horizontal: 0.125rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :root {
      --editor-border-color: #000;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    :global(.ql-snow .ql-editor) {
      scroll-behavior: auto;
    }
  }
</style>
