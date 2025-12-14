import { json } from "@sveltejs/kit";
import { auth } from "$lib/server/api";

export async function GET() {
	const { data: session, error } = await auth().session.get();
	if (error) {
		return json({ message: "Unauthorized" }, { status: 401 });
	}
	return json(session);
}
