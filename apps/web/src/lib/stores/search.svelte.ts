import { getContext, hasContext, setContext } from "svelte";
import { session } from "./session.svelte";

interface ISearch {
	from: string;
	fromPlaceId: string;
	to: string;
	toPlaceId: string;
	date: string;
	time: string;
	adults: number;
	children: number;
	infants: number;
}

export class SearchStore {
	#search = session<ISearch>("search", {
		from: "",
		fromPlaceId: "",
		to: "",
		toPlaceId: "",
		date: "",
		time: "",
		adults: 0,
		children: 0,
		infants: 0,
	});

	get from() {
		return this.#search.current.from;
	}

	set from(value: string) {
		this.#search.current.from = value;
	}

	get fromPlaceId() {
		return this.#search.current.fromPlaceId;
	}

	set fromPlaceId(value: string) {
		this.#search.current.fromPlaceId = value;
	}

	get to() {
		return this.#search.current.to;
	}

	set to(value: string) {
		this.#search.current.to = value;
	}

	get toPlaceId() {
		return this.#search.current.toPlaceId;
	}

	set toPlaceId(value: string) {
		this.#search.current.toPlaceId = value;
	}

	get date() {
		return this.#search.current.date;
	}

	set date(value: string) {
		this.#search.current.date = value;
	}

	get time() {
		return this.#search.current.time;
	}

	set time(value: string) {
		this.#search.current.time = value;
	}

	get adults() {
		return this.#search.current.adults;
	}

	set adults(value: number) {
		this.#search.current.adults = value;
	}

	get children() {
		return this.#search.current.children;
	}

	set children(value: number) {
		this.#search.current.children = value;
	}

	get infants() {
		return this.#search.current.infants;
	}

	set infants(value: number) {
		this.#search.current.infants = value;
	}

	get passengers() {
		return (
			this.#search.current.adults + this.#search.current.children + this.#search.current.infants
		);
	}

	reset() {
		this.#search.current = {
			from: "",
			to: "",
			date: "",
			time: "",
			adults: 0,
			children: 0,
			infants: 0,
		};
	}
}

const SEARCH_KEY = Symbol("search");

export const setSearchStore = () => setContext(SEARCH_KEY, new SearchStore());

export const useSearchStore = () => {
	while (!hasContext(SEARCH_KEY)) {
		setSearchStore();
	}
	return getContext<SearchStore>(SEARCH_KEY);
};
