import { json } from "@sveltejs/kit";
import { auth } from "$lib/server/api.js";

export const GET = async () => {
	console.log("GET /api/auth/logout");
	const { data, error: err } = await auth().logout.post();
	console.log("data", data);
	console.log("err", err);

	if (err) {
		return json({ message: "Nepodařilo se odhlásit" }, { status: 401 });
	}
	if (data.success) {
		return json({ message: "Odhlášení bylo úspěšné" });
	}
	return json({ message: "Nepodařilo se odhlásit" }, { status: 401 });
};
