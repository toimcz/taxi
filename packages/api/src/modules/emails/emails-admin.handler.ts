import { implement } from "@orpc/server";
import { emailsAdminContract } from "@taxi/contracts";
import { emailUseCases } from "./email.use-cases";

const emailsOs = implement(emailsAdminContract);

const findLatest = emailsOs.findLatest.handler(async () => {
	return emailUseCases.findLatest();
});

export const emailsAdminHandler = {
	findLatest,
};
