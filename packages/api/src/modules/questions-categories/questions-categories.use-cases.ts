import type {
	QuestionsCategory,
	QuestionsCategoryCreateDTO,
	QuestionsCategoryUpdateDTO,
} from "@taxi/contracts";
import { db, questionsCategories$ } from "@taxi/db";
import { eq } from "drizzle-orm";
import { text } from "../../lib/text";

const findAll = async (): Promise<QuestionsCategory[]> => {
	return db.query.questionsCategories$.findMany();
};

const findById = async (id: string): Promise<QuestionsCategory | undefined> => {
	return db.query.questionsCategories$.findFirst({
		where: eq(questionsCategories$.id, id),
	});
};

const create = async (
	input: QuestionsCategoryCreateDTO,
): Promise<QuestionsCategory | undefined> => {
	const [category] = await db
		.insert(questionsCategories$)
		.values({
			...input,
			slug: text.slug(input.name),
		})
		.returning();
	return category;
};

const update = async (
	input: QuestionsCategoryUpdateDTO,
): Promise<QuestionsCategory | undefined> => {
	const [category] = await db.update(questionsCategories$).set(input).returning();
	return category;
};

export const questionsCategoriesUseCases = {
	findAll,
	findById,
	create,
	update,
};
