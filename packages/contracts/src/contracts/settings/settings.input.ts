import {
	boolean,
	type InferInput,
	minLength,
	object,
	optional,
	pipe,
	regex,
	string,
} from "valibot";
import { stringToBoolean, uuidSchema } from "../common-schemas";

const onlyLettersAndUnderscores = /^[A-Za-z_]+$/;

export const SettingInput = object({
	key: pipe(
		string(),
		minLength(10, "Název klíče je příliš krátký"),
		regex(onlyLettersAndUnderscores),
	),
	description: pipe(string(), minLength(5, "Popis je příliš krátký")),
	value: string(),
	devValue: optional(string(), ""),
});

export const SettingCreateInput = object({
	...SettingInput.entries,
	editable: optional(stringToBoolean(), "true"),
});

export const SettingUpdateInput = SettingCreateInput;

export const SettingCreateDTO = object({
	...SettingInput.entries,
	editable: boolean(),
});

export const SettingUpdateDTO = object({
	...SettingCreateDTO.entries,
	id: uuidSchema(),
});

export type SettingCreateDTO = InferInput<typeof SettingCreateDTO>;
export type SettingUpdateDTO = InferInput<typeof SettingUpdateDTO>;

export const SettingFindByKeyDTO = object({
	key: string(),
});

export type SettingFindByKeyDTO = InferInput<typeof SettingFindByKeyDTO>;
