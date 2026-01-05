import { os } from "@orpc/server";
import type { AppContext } from "./context";
import { authHandler } from "./modules/auth";
import { basesAdminHandler } from "./modules/bases";
import { carsAdminHandler } from "./modules/cars";
import { countriesAdminHandler } from "./modules/countries";
import { driversAdminHandler } from "./modules/drivers";
import { emailsAdminHandler } from "./modules/emails";
import { pagesAdminHandler, pagesWebHandler } from "./modules/pages";
import { partnersAdminHandler } from "./modules/partners";
import { paymentMethodsAdminHandler } from "./modules/payment-methods";
import { paymentsAdminHandler } from "./modules/payments";
import { postCategoriesAdminHandler, postCategoriesWebHandler } from "./modules/post-categories";
import { postsAdminHandler, postsWebHandler } from "./modules/posts";
import { questionsAdminHandler, questionsWebHandler } from "./modules/questions";
import { questionsCategoriesAdminHandler } from "./modules/questions-categories";
import { servicesAdminHandler, servicesWebHandler } from "./modules/services";
import { settingsAdminHandler, settingsWebHandler } from "./modules/settings";
import { usersAdminHandler } from "./modules/users";

export const router = os.$context<AppContext>().router({
	auth: authHandler,
	admin: {
		bases: basesAdminHandler,
		cars: carsAdminHandler,
		countries: countriesAdminHandler,
		drivers: driversAdminHandler,
		emails: emailsAdminHandler,
		pages: pagesAdminHandler,
		partners: partnersAdminHandler,
		payments: paymentsAdminHandler,
		paymentMethods: paymentMethodsAdminHandler,
		posts: postsAdminHandler,
		postCategories: postCategoriesAdminHandler,
		questions: questionsAdminHandler,
		users: usersAdminHandler,
		questionsCategories: questionsCategoriesAdminHandler,
		services: servicesAdminHandler,
		settings: settingsAdminHandler,
	},
	web: {
		pages: pagesWebHandler,
		posts: postsWebHandler,
		postCategories: postCategoriesWebHandler,
		questions: questionsWebHandler,
		services: servicesWebHandler,
		settings: settingsWebHandler,
	},
});
