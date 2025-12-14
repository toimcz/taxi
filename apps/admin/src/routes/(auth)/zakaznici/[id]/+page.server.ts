import { error, fail } from "@sveltejs/kit";
import { UserUpdateInput } from "@taxi/contracts/users/users.input";
import { flatten, safeParse } from "valibot";
import { api } from "$lib/server/api";

export const load = async ({ params }) => {
	const { id } = params;
	const { data, error: err } = await api().users.findById({ id }).get();
	if (err) {
		console.error(err);
		error(500, "Nepodařilo se načíst zákazníka");
	}
	return { user: data };
};

export const actions = {
	default: async ({ request, params }) => {
		const form = await request.formData();
		const data = Object.fromEntries(form);
		const validated = safeParse(UserUpdateInput, data);
		if (!validated.success) {
			console.error(validated.issues);
			return fail(400, flatten(validated.issues));
		}
		const { error } = await api()
			.users({
				id: params.id,
			})
			.patch(validated.output);
		if (error) {
			console.error(error);
			return fail(400, { message: error.value.message });
		}
		return { success: true };
	},
};
