import { error } from "@sveltejs/kit";
import { client } from "$lib/client";

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
	const [posts, services, routes] = await Promise.all([
		client.posts.allPublished.get(),
		client.services.allActive.get(),
		client.routes.allActive.get(),
	]);

	if (posts.error || services.error || routes.error) {
		error(500, "Failed to load posts, services or routes");
	}

	return {
		items,
		posts: posts.data,
		services: services.data,
		routes: routes.data,
	};
};
