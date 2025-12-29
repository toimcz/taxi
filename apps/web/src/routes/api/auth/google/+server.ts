import { json } from "@sveltejs/kit";
import { PUBLIC_APP_URL } from "$env/static/public";
import { auth } from "$lib/server/api";

export const GET = async () => {
	const { data, error: err } = await auth().google.get({
		query: {
			redirectUrl: PUBLIC_APP_URL,
		},
	});
	if (err) {
		return json({ error: "Nepodařilo se generovat autorizační URL" }, { status: 401 });
	}
	return json(data);
};
