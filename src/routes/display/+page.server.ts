import { json } from '@sveltejs/kit'
import { eq, and, sql } from 'drizzle-orm'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	event.depends('app:display-data')
	
	const [gameDetails] = await db.select().from(table.details)
	const currentLevel = gameDetails.currentLevel

	// Get current level info
	const [levelData] = await db
		.select()
		.from(table.levels)
		.where(eq(table.levels.level, currentLevel))

	// Get vote statistics
	const voteStats = await db
		.select({
			answer: table.votes.answer,
			count: sql<number>`count(*)`
		})
		.from(table.votes)
		.where(eq(table.votes.level, currentLevel))
		.groupBy(table.votes.answer)

	const alive = voteStats.find(stat => stat.answer === 'alive')?.count || 0
	const dead = voteStats.find(stat => stat.answer === 'dead')?.count || 0

	// Get active users count
	const [activeUsersCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.user)
		.where(and(
			eq(table.user.isActive, true),
			eq(table.user.disabled, false)
		))

	// Get eliminated users count
	const [eliminatedUsersCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.user)
		.where(eq(table.user.isActive, false))

	// Get recent votes with user names (last 10)
	const recentVotes = await db
		.select({
			userName: table.user.name,
			answer: table.votes.answer,
			timestamp: table.votes.timestamp
		})
		.from(table.votes)
		.innerJoin(table.user, eq(table.votes.userId, table.user.id))
		.where(eq(table.votes.level, currentLevel))
		.orderBy(sql`${table.votes.timestamp} DESC`)
		.limit(10)

	return {
		gameDetails,
		levelData,
		voteStats: { alive, dead, total: alive + dead },
		activeUsersCount: activeUsersCount.count,
		eliminatedUsersCount: eliminatedUsersCount.count,
		currentLevel,
		recentVotes
	}
}
