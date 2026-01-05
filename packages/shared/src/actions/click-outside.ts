import type { Action } from "svelte/action";

export const clickOutside: Action<HTMLDivElement | HTMLButtonElement> = (node) => {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent("clickoutside", node as unknown as EventInit));
		}
	};

	document.addEventListener("click", handleClick, true);

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true);
		},
	};
};
