import { json } from '@sveltejs/kit'
import { eq, sql } from 'drizzle-orm'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	const level = Number(params.level)
	
	if (isNaN(level) || level < 1) {
		return json({ error: 'Invalid level' }, { status: 400 })
	}

	try {
		// Get vote counts for this level
		const voteStats = await db
			.select({
				answer: table.votes.answer,
				count: sql<number>`count(*)`
			})
			.from(table.votes)
			.where(eq(table.votes.level, level))
			.groupBy(table.votes.answer)

		const alive = voteStats.find(stat => stat.answer === 'alive')?.count || 0
		const dead = voteStats.find(stat => stat.answer === 'dead')?.count || 0
		const total = alive + dead

		return json({
			alive,
			dead,
			total
		})
	} catch (error) {
		console.error('Failed to fetch vote stats:', error)
		return json({ error: 'Failed to fetch vote stats' }, { status: 500 })
	}
}
