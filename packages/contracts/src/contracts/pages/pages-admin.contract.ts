import { array } from "valibot";
import { ParamUUID } from "../common";
import { contract } from "../contract";
import { PageCreateDTO, PageUpdateDTO } from "./pages.input";
import { Page, PageItem } from "./pages.output";

const tags = ["Pages"];

const findAll = contract
	.route({
		method: "GET",
		path: "/admin/pages",
		tags,
	})
	.output(array(PageItem));
const findById = contract
	.route({
		method: "GET",
		path: "/admin/pages/{id}",
		tags,
	})
	.input(ParamUUID)
	.output(Page);
const create = contract
	.route({
		method: "POST",
		path: "/admin/pages",
		tags,
	})
	.input(PageCreateDTO)
	.output(Page);
const update = contract
	.route({
		method: "PUT",
		path: "/admin/pages/{id}",
		tags,
	})
	.input(PageUpdateDTO)
	.output(Page);
const deletePage = contract
	.route({
		method: "DELETE",
		path: "/admin/pages/{id}",
		tags,
	})
	.input(ParamUUID)
	.output(Page);

export const pagesAdminContract = {
	findAll,
	findById,
	create,
	update,
	delete: deletePage,
};
