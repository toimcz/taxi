import { authContract } from "./contracts/auth";
import { basesAdminContract } from "./contracts/bases";
import { carsAdminContract } from "./contracts/cars/cars-admin.contract";
import { countriesAdminContract } from "./contracts/countries";
import { driversAdminContract } from "./contracts/drivers";
import { emailsAdminContract } from "./contracts/emails";
import { pagesAdminContract, pagesWebContract } from "./contracts/pages";
import { partnersAdminContract } from "./contracts/partners";
import { paymentMethodsAdminContract } from "./contracts/payment-methods";
import { paymentsAdminContract } from "./contracts/payments";
import {
	postCategoriesAdminContract,
	postCategoriesWebContract,
} from "./contracts/post-categories";
import { postsAdminContract, postsWebContract } from "./contracts/posts";
import { questionsAdminContract, questionsWebContract } from "./contracts/questions";
import { questionsCategoriesAdminContract } from "./contracts/questions-categories";
import { servicesAdminContract, servicesWebContract } from "./contracts/services";
import { settingsAdminContract, settingsWebContract } from "./contracts/settings";
import { usersAdminContract } from "./contracts/users";

export * from "./contracts/auth";
export * from "./contracts/bases";
export * from "./contracts/cars";
export * from "./contracts/common";
export * from "./contracts/countries";
export * from "./contracts/drivers";
export * from "./contracts/emails";
export * from "./contracts/pages";
export * from "./contracts/partners";
export * from "./contracts/payment-methods";
export * from "./contracts/payments";
export * from "./contracts/places";
export * from "./contracts/post-categories";
export * from "./contracts/posts";
export * from "./contracts/questions";
export * from "./contracts/questions-categories";
export * from "./contracts/quotes";
export * from "./contracts/services";
export * from "./contracts/sessions";
export * from "./contracts/settings";
export * from "./contracts/users";

export const contracts = {
	auth: authContract,
	admin: {
		bases: basesAdminContract,
		cars: carsAdminContract,
		countries: countriesAdminContract,
		drivers: driversAdminContract,
		emails: emailsAdminContract,
		pages: pagesAdminContract,
		partners: partnersAdminContract,
		payments: paymentsAdminContract,
		paymentMethods: paymentMethodsAdminContract,
		posts: postsAdminContract,
		postCategories: postCategoriesAdminContract,
		questions: questionsAdminContract,
		questionsCategories: questionsCategoriesAdminContract,
		services: servicesAdminContract,
		settings: settingsAdminContract,
		users: usersAdminContract,
	},
	web: {
		pages: pagesWebContract,
		posts: postsWebContract,
		postCategories: postCategoriesWebContract,
		questions: questionsWebContract,
		services: servicesWebContract,
		settings: settingsWebContract,
	},
};
