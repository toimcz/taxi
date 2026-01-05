import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { PageFindBySlugDTO } from "./pages.input";
import { Page, PageItem } from "./pages.output";

const tags = ["Pages"];

const findAll = contract
	.route({
		method: "GET",
		path: "/web/pages",
		tags: tags,
	})
	.output(array(PageItem));

const findTop = contract
	.route({
		method: "GET",
		path: "/web/pages/top",
		tags: tags,
	})
	.output(array(PageItem));

const findBottom = contract
	.route({
		method: "GET",
		path: "/web/pages/bottom",
		tags: tags,
	})
	.output(array(PageItem));

const findById = contract
	.route({
		method: "GET",
		path: "/web/pages/{id}",
		tags: tags,
	})
	.input(ParamUUID)
	.output(Page);

const findBySlug = contract
	.route({
		method: "GET",
		path: "/web/pages/slug/{slug}",
		tags: tags,
	})
	.input(PageFindBySlugDTO)
	.output(Page);

export const pagesWebContract = {
	findAll,
	findTop,
	findBottom,
	findById,
	findBySlug,
};
