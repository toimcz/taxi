import type { InferContractRouterInputs, InferContractRouterOutputs } from "@orpc/contract";
import { contract } from "../contract";
import { Session } from "../sessions/sessions.output";
import {
	GoogleCallbackDTO,
	LoginEmailDTO,
	LoginGoogleDTO,
	LoginPasswordDTO,
	RegisterPasswordDTO,
	RegisterPasswordlessDTO,
	ValidateMagicLinkDTO,
} from "./auth.input";
import { GoogleLoginOutput, SuccessOutput, SuccessOutputWithCookies } from "./auth.output";

const tags = ["Authentication"];

const loginPassword = contract
	.route({
		method: "POST",
		path: "/auth/login/password",
		summary: "Login with email and password",
		description: "Login with email and password",
		tags,
	})
	.input(LoginPasswordDTO)
	.output(SuccessOutputWithCookies);

const loginEmail = contract
	.route({
		method: "POST",
		path: "/auth/login/email",
		summary: "Login with email",
		description: "Login with email",
		tags,
	})
	.input(LoginEmailDTO)
	.output(SuccessOutput);

const loginGoogle = contract
	.route({
		method: "POST",
		path: "/auth/login/google",
		summary: "Login with Google",
		description: "Login with Google",
		tags,
	})
	.input(LoginGoogleDTO)
	.output(GoogleLoginOutput);

const callbackGoogle = contract
	.route({
		method: "GET",
		path: "/auth/login/callback/google",
		summary: "Google callback",
		description: "Google callback",
		tags,
	})
	.input(GoogleCallbackDTO);

const registerPassword = contract
	.route({
		method: "POST",
		path: "/auth/register/password",
		summary: "Register with email and password",
		description: "Register with email and password",
		tags,
	})
	.input(RegisterPasswordDTO)
	.output(SuccessOutput);

const registerPasswordless = contract
	.route({
		method: "POST",
		path: "/auth/register/passwordless",
		summary: "Register with email",
		description: "Register with email",
		tags,
	})
	.input(RegisterPasswordlessDTO)
	.output(SuccessOutput);

const me = contract
	.route({
		method: "GET",
		path: "/auth/me",
		summary: "Get current user",
		description: "Get current user",
		tags,
	})
	.output(Session);

const validateMagicLink = contract
	.route({
		method: "POST",
		path: "/auth/validate/magic-link",
		summary: "Validate magic link",
		description: "Validate magic link",
		tags,
	})
	.input(ValidateMagicLinkDTO)
	.output(SuccessOutput);

const logout = contract
	.route({
		method: "POST",
		path: "/auth/logout",
		summary: "Logout",
		description: "Logout",
		tags,
	})
	.output(SuccessOutput);

export const authContract = {
	loginPassword,
	loginEmail,
	loginGoogle,
	callbackGoogle,
	registerPassword,
	registerPasswordless,
	me,
	validateMagicLink,
	logout,
};

export type AuthContractInputs = InferContractRouterInputs<typeof authContract>;
export type AuthContractOutputs = InferContractRouterOutputs<typeof authContract>;
