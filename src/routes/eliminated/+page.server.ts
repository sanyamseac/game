import { redirect } from '@sveltejs/kit'
import { eq, and, sql } from 'drizzle-orm'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'

export const load = async (event: any) => {
	event.depends('app:eliminated-data')
	
	if (!event.locals.user) return redirect(302, '/login')

	// Redirect active players to the game
	if (event.locals.user.isActive && !event.locals.user.disabled) {
		const [gameDetails] = await db.select().from(table.details)
		return redirect(302, `/game/${gameDetails.currentLevel}`)
	}

	// Get game details
	const [gameDetails] = await db.select().from(table.details)
	const currentLevel = gameDetails.currentLevel

	// Get active players count
	const [activePlayersCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.user)
		.where(and(
			eq(table.user.isActive, true),
			eq(table.user.disabled, false)
		))

	// Get eliminated players count
	const [eliminatedPlayersCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.user)
		.where(eq(table.user.isActive, false))

	// Check for winner (only one active player remaining)
	let winner = null
	if (activePlayersCount.count === 1) {
		const [winnerData] = await db
			.select({
				name: table.user.name,
				email: table.user.email
			})
			.from(table.user)
			.where(and(
				eq(table.user.isActive, true),
				eq(table.user.disabled, false)
			))
		winner = winnerData
	}

	return {
		user: event.locals.user,
		currentLevel,
		activePlayersCount: activePlayersCount.count,
		eliminatedPlayersCount: eliminatedPlayersCount.count,
		winner
	}
}
