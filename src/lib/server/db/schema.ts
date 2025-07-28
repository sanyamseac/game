import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	points: integer('points').notNull().default(0),
	role: text('role').notNull().default('user'),
	session: text('session').notNull(),
	level: integer('level').notNull().default(0), // Last level user voted on
	lastVote: integer('last_vote', { mode: 'boolean' }), // Store user's last vote (true=alive, false=dead, null=no vote)
	pointsGiven: integer('points_given').notNull().default(0), // Track up to which level points have been awarded
})

export const levels = sqliteTable('levels', {
	id: integer('id').primaryKey(),
	answer: integer('answer', { mode: 'boolean' }),
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
})

export type User = typeof user.$inferSelect
export type Level = typeof levels.$inferSelect