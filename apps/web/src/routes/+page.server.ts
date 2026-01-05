import { redirect } from "@sveltejs/kit";
import { auth, query } from "$client";
import { COOKIE_NAME } from "$env/static/private";

const items = [
	{
		title: "Taxi na/z letiště Praha",
		description:
			"Objednejte si taxi na letiště nebo z letiště Václava Havla za pevnou cenu. Poveze Vás profesionální řidič, na výběr máte minibusy, sedan, limuzíny a další.",
		src: "/images/main-1.jpg",
	},
	{
		title: "Exkluzivní taxi vozy Mercedes",
		description:
			"Zajistíme Vám exkluzivní taxi vozy Mercedes, které jsou vybaveny nejvyššími standardy. Ať už jedete na letiště nebo jiných měst v České republice nebo v Evropě.",
		src: "/images/main-2.jpg",
	},
	{
		title: "Autobus Mercedes Sprinter",
		description:
			"Cestujte pohodlně s Vašimi přáteli 20 místným autobusem Mercedes Sprinter. Využijte výhodné ceny pro více osob.",
		src: "/images/main-3.jpg",
	},
];

export const load = async () => {
	const [posts, services] = await Promise.all([
		query.posts.findAll({ limit: "9", page: "1" }),
		query.services.findAll(),
	]);

	return {
		items,
		posts: posts.data,
		services: services,
		routes: [],
	};
};

export const actions = {
	logout: async ({ cookies }) => {
		const sessionId = cookies.get(COOKIE_NAME);

		if (sessionId) {
			await auth.logout({ sessionId });
		}

		cookies.set(COOKIE_NAME, "", {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			expires: new Date(0),
			maxAge: 0,
		});

		redirect(302, "/prihlasit");
	},
};
