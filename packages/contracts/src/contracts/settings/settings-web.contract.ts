import type { HTTPPath } from "@orpc/contract";
import { contract } from "../contract";
import { SettingFindByKeyDTO } from "./settings.input";
import { Setting } from "./settings.output";

const tags = ["Settings"];
const setPath = (path: `/${string}`): HTTPPath => `/web${path}`;

const findByKey = contract
	.route({
		method: "GET",
		path: setPath("/settings/key/{key}"),
		tags,
	})
	.input(SettingFindByKeyDTO)
	.output(Setting);

export const settingsWebContract = {
	findByKey,
};
