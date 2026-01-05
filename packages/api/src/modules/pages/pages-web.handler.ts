import { implement, ORPCError } from "@orpc/server";
import { pagesWebContract } from "@taxi/contracts";
import { pagesUseCases } from "./pages.use-cases";

const pagesOs = implement(pagesWebContract);

const findAll = pagesOs.findAll.handler(async () => {
	return await pagesUseCases.findAllPublic();
});

const findBySlug = pagesOs.findBySlug.handler(async ({ input }) => {
	const page = await pagesUseCases.findBySlug(input.slug);
	if (!page) throw new ORPCError("NOT_FOUND", { message: "Page not found" });
	return page;
});

const findTop = pagesOs.findTop.handler(async () => {
	return await pagesUseCases.findTop();
});

const findBottom = pagesOs.findBottom.handler(async () => {
	return await pagesUseCases.findBottom();
});

export const pagesWebHandler = {
	findAll,
	findBySlug,
	findTop,
	findBottom,
};
