import { redirect } from "@sveltejs/kit";
import { Role } from "@taxi/contracts/common";

export const load = async ({ locals }) => {
	if (!locals.user || locals.user.roles.includes(Role.USER)) {
		redirect(302, "/prihlasit");
	}
	return {
		session: locals.session,
		user: locals.user,
	};
};
