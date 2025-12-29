import { relations, sql } from "drizzle-orm";
import {
	boolean,
	check,
	index,
	integer,
	pgTable,
	text,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

/**
 * Questions categories table schema
 * Stores categorization for FAQ questions to organize them logically
 */
export const questionsCategories$ = pgTable(
	"questions_categories",
	{
		/** Unique identifier for the question category */
		id: uuid("id").primaryKey().defaultRandom(),
		/** Order of the category in the list for display purposes */
		order: integer("order").notNull().default(0),
		/** The name of the question category */
		name: varchar("name", { length: 100 }).notNull(),
		/** Slugified version of the name for URL-friendly access */
		slug: text("slug").notNull(),
		/** Description of category - optional field for additional context */
		description: varchar("description", { length: 500 })
			.notNull()
			.$default(() => ""),
		/**
		 * Whether the category is active and should be displayed
		 * Defaults to true for new categories
		 */
		status: boolean("status").notNull().default(true),
	},
	(table) => [
		// Unique constraints
		unique("questions_categories_name_unique").on(table.name),

		// Performance indexes
		index("questions_categories_order_idx").on(table.order),
		index("questions_categories_name_idx").on(table.name),
		index("questions_categories_status_idx").on(table.status),
	],
);

/**
 * Questions table schema
 * Stores FAQ questions and answers with categorization and publication status
 */
export const questions$ = pgTable(
	"questions",
	{
		/** Unique identifier for the question */
		id: uuid("id").primaryKey().defaultRandom(),

		/** Category of the question - foreign key to questions_categories */
		categoryId: uuid("category_id").references(() => questionsCategories$.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),

		/** The question text - what customers are asking */
		question: text("question").notNull(),

		/** The answer text - response to the customer question */
		answer: text("answer").notNull(),

		/** Publication status - whether the question is visible to customers */
		status: boolean("status").notNull().default(true),
	},
	(table) => [
		// Data validation constraints
		check("questions_question_not_empty_check", sql`LENGTH(TRIM(${table.question})) > 0`),
		check("questions_answer_not_empty_check", sql`LENGTH(TRIM(${table.answer})) > 0`),
		check("questions_question_length_check", sql`LENGTH(${table.question}) <= 500`),
		check("questions_answer_length_check", sql`LENGTH(${table.answer}) <= 5000`),

		// Performance indexes
		index("questions_status_idx").on(table.status),
		index("questions_category_id_idx").on(table.categoryId),
		index("questions_status_category_idx").on(table.status, table.categoryId),
		// Full-text search index for question content
		index("questions_question_text_idx").using(
			"gin",
			sql`to_tsvector('english', ${table.question})`,
		),
	],
);

/** Relation name constant for questions and categories */
const CATEGORY_QUESTIONS_RELATION = "category_questions";

/**
 * Relationships definition for questions categories
 * Defines one-to-many relationship between categories and questions
 */
export const categoriesRelations = relations(questionsCategories$, ({ many }) => ({
	questions: many(questions$, {
		relationName: CATEGORY_QUESTIONS_RELATION,
	}),
}));

/**
 * Relationships definition for questions
 * Defines many-to-one relationship between questions and categories
 */
export const questionsRelations = relations(questions$, ({ one }) => ({
	category: one(questionsCategories$, {
		relationName: CATEGORY_QUESTIONS_RELATION,
		fields: [questions$.categoryId],
		references: [questionsCategories$.id],
	}),
}));

// Core types for questions
/**
 * Question record as selected from database
 * Contains all fields including generated values like id
 */
export type QuestionSelect = typeof questions$.$inferSelect;

/**
 * Question data for inserting new records
 * Excludes auto-generated fields like id (optional)
 */
export type QuestionInsert = typeof questions$.$inferInsert;

/**
 * Question data for updating existing records
 * All fields are optional for partial updates
 */
export type QuestionUpdate = Partial<Omit<QuestionInsert, "id">>;

// Core types for question categories
/**
 * Question category record as selected from database
 * Contains all fields including generated values like id
 */
export type QuestionCategorySelect = typeof questionsCategories$.$inferSelect;

/**
 * Question category data for inserting new records
 * Excludes auto-generated fields like id (optional)
 */
export type QuestionCategoryInsert = typeof questionsCategories$.$inferInsert;

/**
 * Question category data for updating existing records
 * All fields are optional for partial updates
 */
export type QuestionCategoryUpdate = Partial<Omit<QuestionCategoryInsert, "id">>;
