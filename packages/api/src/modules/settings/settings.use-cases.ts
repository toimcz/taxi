import { ORPCError } from "@orpc/contract";
import type { Setting, SettingCreateDTO, SettingUpdateDTO } from "@taxi/contracts";
import { db, settings$ } from "@taxi/db";
import { eq } from "drizzle-orm";

const findAll = async (): Promise<Setting[]> => {
	return await db.query.settings$.findMany();
};

const findById = async (id: string): Promise<Setting | undefined> => {
	return await db.query.settings$.findFirst({ where: eq(settings$.id, id) });
};

const findByKey = async (key: string): Promise<Setting | undefined> => {
	return await db.query.settings$.findFirst({ where: eq(settings$.key, key) });
};

const create = async (input: SettingCreateDTO): Promise<Setting> => {
	const [setting] = await db
		.insert(settings$)
		.values({
			...input,
			editable: input.editable || false,
			devValue: input.devValue || input.value,
		})
		.returning();
	if (!setting)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to create setting" });
	return setting;
};

const update = async (input: SettingUpdateDTO): Promise<Setting> => {
	const [setting] = await db
		.update(settings$)
		.set({
			...input,
			devValue: input.devValue || input.value,
			editable: input.editable,
		})
		.where(eq(settings$.id, input.id))
		.returning();
	if (!setting)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to update setting" });
	return setting;
};

const remove = async (id: string): Promise<Setting> => {
	const [setting] = await db.delete(settings$).where(eq(settings$.id, id)).returning();
	if (!setting)
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Failed to delete setting" });
	return setting;
};

export const settingsUseCases = {
	findAll,
	findById,
	findByKey,
	create,
	update,
	delete: remove,
};
