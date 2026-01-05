import type { HTTPPath } from "@orpc/contract";
import { array } from "valibot";
import { contract } from "../contract";
import { Email } from "./emails.output";

const tags = ["Emails"];
const setPath = (path: HTTPPath): HTTPPath => `/admin/emails${path}`;

const findLatest = contract
	.route({
		method: "GET",
		path: setPath("/latest"),
		tags,
	})
	.output(array(Email));

export const emailsAdminContract = {
	findLatest,
};
