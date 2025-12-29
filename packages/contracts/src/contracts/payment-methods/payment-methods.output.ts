import { boolean, enum_, type InferOutput, object, pipe, string, uuid } from "valibot";
import { PaymentMethodProvider } from "../common";

export const PaymentMethod = object({
	id: pipe(string(), uuid()),
	name: string(),
	adminName: string(),
	description: string(),
	provider: enum_(PaymentMethodProvider),
	public: boolean(),
	status: boolean(),
});

export type PaymentMethod = InferOutput<typeof PaymentMethod>;
