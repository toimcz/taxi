import Elysia from "elysia";
import { pagesWebHandler } from "src/api/pages/pages-web.handler";
import { postsWebHandler } from "src/api/posts/posts-web.handler";
import { routesWebHandler } from "src/api/routes/routes-web.handler";
import { servicesWebHandler } from "src/api/services/services-web.handler";

const webHandler = new Elysia({
	prefix: "/web",
	name: "web",
})
	.use(pagesWebHandler)
	.use(postsWebHandler)
	.use(servicesWebHandler)
	.use(routesWebHandler);

export const apiHandler = new Elysia({
	prefix: "/api",
	name: "api",
}).use(webHandler);
