import { implement, ORPCError } from "@orpc/server";
import { settingsWebContract } from "@taxi/contracts";
import { settingsUseCases } from "./settings.use-cases";

const settingsOs = implement(settingsWebContract);

const findByKey = settingsOs.findByKey.handler(async ({ input }) => {
	const setting = await settingsUseCases.findByKey(input.key);
	if (!setting)
		throw new ORPCError("NOT_FOUND", { message: `Setting with key ${input.key} not found` });
	return setting;
});

export const settingsWebHandler = {
	findByKey,
};
