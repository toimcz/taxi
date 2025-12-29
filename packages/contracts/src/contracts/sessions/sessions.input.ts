import { type InferOutput, object, string } from "valibot";
import { stringToDate } from "../common-schemas";

export const SessionInput = object({
	userId: string(),
	sessionId: string(),
	expiresAt: stringToDate("Neplatný formát datumu"),
});

export const SessionDTO = SessionInput;

export type SessionDTO = InferOutput<typeof SessionDTO>;
