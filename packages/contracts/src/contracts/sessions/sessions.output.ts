import { type InferOutput, object } from "valibot";
import { User } from "../users";
import { SessionDTO } from "./sessions.input";

export const Session = object({
	session: SessionDTO,
	user: User,
});

export type Session = InferOutput<typeof Session>;
