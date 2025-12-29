import { authContract } from "./contracts/auth";
import { basesAdminContract } from "./contracts/bases";
import { countriesAdminContract } from "./contracts/countries";
import { paymentMethodsAdminContract } from "./contracts/payment-methods";
import { questionsAdminContract, questionsWebContract } from "./contracts/questions";
import { questionsCategoriesAdminContract } from "./contracts/questions-categories";
import { servicesAdminContract, servicesWebContract } from "./contracts/services";
import { usersAdminContract } from "./contracts/users";

export * from "./contracts/auth";
export * from "./contracts/bases";
export * from "./contracts/common";
export * from "./contracts/countries";
export * from "./contracts/emails";
export * from "./contracts/payment-methods";
export * from "./contracts/places";
export * from "./contracts/questions";
export * from "./contracts/questions-categories";
export * from "./contracts/services";
export * from "./contracts/sessions";
export * from "./contracts/users";

export const contracts = {
	auth: authContract,
	admin: {
		bases: basesAdminContract,
		countries: countriesAdminContract,
		paymentMethods: paymentMethodsAdminContract,
		questions: questionsAdminContract,
		questionsCategories: questionsCategoriesAdminContract,
		services: servicesAdminContract,
		users: usersAdminContract,
	},
	web: {
		questions: questionsWebContract,
		services: servicesWebContract,
	},
};
