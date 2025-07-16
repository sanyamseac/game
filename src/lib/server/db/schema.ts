import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	level: integer('level').notNull().default(1),
	role: text('role').notNull().default('user'),
	session: text('session').notNull(),
	disabled: integer('disabled', { mode: 'boolean' }).notNull().default(false),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
})

export const levels = sqliteTable('levels', {
	id: text('id').primaryKey(),
	level: integer('level').notNull().unique(),
	correct: text('correct'), // Will be set randomly after voting ends
	allowAns: integer('allow_ans', { mode: 'boolean' }).notNull().default(true),
	votingEnded: integer('voting_ended', { mode: 'boolean' }).notNull().default(false),
	resultsRevealed: integer('results_revealed', { mode: 'boolean' }).notNull().default(false),
})

export const votes = sqliteTable('votes', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	level: integer('level').notNull().references(() => levels.level),
	answer: text('answer').notNull(), // 'alive' or 'dead'
	timestamp: integer('timestamp').notNull(),
})

export const details = sqliteTable('details', {
	id: text('id').primaryKey(),
	allowReg: integer('allow_reg', { mode: 'boolean' }).notNull().default(true),
	currentLevel: integer('current_level')
		.notNull()
		.default(1)
		.references(() => levels.level),
	gameStarted: integer('game_started', { mode: 'boolean' }).notNull().default(false),
})

export type User = typeof user.$inferSelect
export type Details = typeof details.$inferSelect
export type Level = typeof levels.$inferSelect
export type Vote = typeof votes.$inferSelect
