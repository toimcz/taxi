import type { Question, QuestionCreateDTO, QuestionUpdateDTO } from "@taxi/contracts";
import { type Database, db, questions$, questionsCategories$ } from "@taxi/db";
import { eq } from "drizzle-orm";

const query = (db: Database) =>
	db
		.select({
			id: questions$.id,
			status: questions$.status,
			categoryId: questions$.categoryId,
			question: questions$.question,
			answer: questions$.answer,
			categoryName: questionsCategories$.name,
		})
		.from(questions$)
		.leftJoin(questionsCategories$, eq(questions$.categoryId, questionsCategories$.id));

const findAll = async (): Promise<Question[]> => {
	return await query(db);
};

const findAllPublic = async (): Promise<Question[]> => {
	return await query(db).where(eq(questions$.status, true));
};

const findById = async (id: string): Promise<Question | undefined> => {
	const [question] = await query(db).where(eq(questions$.id, id));
	return question;
};

const create = async (question: QuestionCreateDTO): Promise<Question | undefined> => {
	const [createdQuestion] = await db.insert(questions$).values(question).returning();
	if (!createdQuestion) return undefined;
	return findById(createdQuestion.id);
};

const update = async (question: QuestionUpdateDTO): Promise<Question | undefined> => {
	const { id, ...rest } = question;
	const [updatedQuestion] = await db
		.update(questions$)
		.set(rest)
		.where(eq(questions$.id, id))
		.returning();
	if (!updatedQuestion) return undefined;
	return findById(updatedQuestion.id);
};

export const questionsUseCases = {
	findAll,
	findAllPublic,
	findById,
	create,
	update,
};
