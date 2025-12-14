import { type InferInput, type InferOutput, object, string } from "valibot";
import { User } from "../users/users.output";

export const SessionInput = object({
	userId: string(),
	sessionId: string(),
	expiresAt: string(),
});

export type SessionInput = InferInput<typeof SessionInput>;

export const Session = object({
	session: SessionInput,
	user: User,
});

export type Session = InferOutput<typeof Session>;
