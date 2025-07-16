import { redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import { eq, and, sql } from 'drizzle-orm'

export const load = async (event) => {
	if (!event.locals.user) return redirect(302, '/login')

	const [gameDetails] = await db.select().from(table.details)
	
	// If game hasn't started, show waiting lobby
	if (!gameDetails.gameStarted) {
		// Get player count for lobby
		const [playerCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(table.user)
			.where(and(
				eq(table.user.isActive, true),
				eq(table.user.disabled, false)
			))

		return {
			gameStarted: false,
			playerCount: playerCount.count,
			allowRegistration: gameDetails.allowReg
		}
	}
	
	// Game has started, redirect to current active level
	return redirect(302, `/game/${gameDetails.currentLevel}`)
}
