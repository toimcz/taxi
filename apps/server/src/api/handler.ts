import Elysia from "elysia";
import { authHandler } from "src/api/auth/auth.handler";
import { pagesWebHandler } from "src/api/pages/pages-web.handler";
import { postsWebHandler } from "src/api/posts/posts-web.handler";
import { routesWebHandler } from "src/api/routes/routes-web.handler";
import { servicesWebHandler } from "src/api/services/services-web.handler";
import { usersAdminHandler } from "src/api/users/users-admin.handler";

const webHandler = new Elysia({
	prefix: "/web",
	name: "web",
})
	.use(pagesWebHandler)
	.use(postsWebHandler)
	.use(servicesWebHandler)
	.use(routesWebHandler);

const adminHandler = new Elysia({
	prefix: "/admin",
	name: "admin",
}).use(usersAdminHandler);

export const apiHandler = new Elysia({
	prefix: "/api",
	name: "api",
})
	.use(authHandler)
	.use(webHandler)
	.use(adminHandler);
