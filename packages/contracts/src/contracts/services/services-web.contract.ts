import { array } from "valibot";
import { contract } from "../contract";
import { ServiceFindBySlugDTO } from "./services.input";
import { Service } from "./services.output";

const findAll = contract
	.route({
		method: "GET",
		path: "/web/services",
	})
	.output(array(Service));
const findBySlug = contract
	.route({
		method: "GET",
		path: "/web/services/{slug}",
	})
	.input(ServiceFindBySlugDTO)
	.output(Service);

export const servicesWebContract = {
	findAll,
	findBySlug,
};
