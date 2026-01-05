import { fail } from "@sveltejs/kit";
import { PostCreateInput, PostUpdateInput } from "@taxi/contracts";
import { validateRequest } from "@taxi/shared";
import { mutation, query } from "$client";

export const load = async ({ params, depends }) => {
	depends("app:post");
	if (params.id === "novy") {
		return {
			post: undefined,
		};
	}
	const post = await query.posts.findById({ id: params.id });
	return {
		post,
	};
};

export const actions = {
	create: async ({ request }) => {
		const { output, issues } = await validateRequest(PostCreateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.posts.create(output);
		if (error) {
			return fail(500, { error });
		}

		return { success: true };
	},
	update: async ({ request, params }) => {
		const { output, issues } = await validateRequest(PostUpdateInput, request);
		if (issues) {
			return fail(400, { issues });
		}
		const { error } = await mutation.posts.update({
			...output,
			id: params.id,
		});
		if (error) {
			return fail(500, { error });
		}
		return { success: true };
	},
};
