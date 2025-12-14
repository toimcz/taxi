import { redirect } from "@sveltejs/kit";
import { Role } from "@taxi/contracts/common";

export async function load({ locals }) {
	if (locals.user && !locals.user.roles.includes(Role.USER)) {
		redirect(302, "/");
	}
}
