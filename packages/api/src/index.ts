import { os } from "@orpc/server";
import type { Context } from "./context";
import { authHandler } from "./modules/auth";
import { basesAdminHandler } from "./modules/bases";
import { countriesAdminHandler } from "./modules/countries";
import { paymentMethodsAdminHandler } from "./modules/payment-methods";
import { questionsAdminHandler, questionsWebHandler } from "./modules/questions";
import { questionsCategoriesAdminHandler } from "./modules/questions-categories";
import { servicesAdminHandler, servicesWebHandler } from "./modules/services";
import { usersAdminHandler } from "./modules/users";

export const router = os.$context<Context>().router({
	auth: authHandler,
	admin: {
		bases: basesAdminHandler,
		countries: countriesAdminHandler,
		paymentMethods: paymentMethodsAdminHandler,
		questions: questionsAdminHandler,
		users: usersAdminHandler,
		questionsCategories: questionsCategoriesAdminHandler,
		services: servicesAdminHandler,
	},
	web: {
		questions: questionsWebHandler,
		services: servicesWebHandler,
	},
});
