import { fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	// Check if user is admin
	if (!event.locals.user || event.locals.user.role !== 'admin') {
		return redirect(302, '/login')
	}

	// Get current level
	const currentLevel = await db
		.select()
		.from(table.levels)
		.orderBy(desc(table.levels.id))
		.limit(1)
		.then(rows => rows[0] || null)

	// Get total users and users who voted on current level
	const totalUsers = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.user)
		.where(eq(table.user.role, 'user'))
		.then(rows => rows[0]?.count || 0)

	let votedUsers = 0
	if (currentLevel) {
		votedUsers = await db
			.select({ count: sql<number>`count(*)` })
			.from(table.user)
			.where(sql`${table.user.level} >= ${currentLevel.id} AND ${table.user.role} = 'user'`)
			.then(rows => rows[0]?.count || 0)
	}

	// Get remaining players (those who haven't been eliminated yet)
	const completedLevels = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.levels)
		.where(sql`${table.levels.answer} IS NOT NULL`)
		.then(rows => rows[0]?.count || 0)

	const remainingPlayers = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.user)
		.where(sql`${table.user.points} >= ${completedLevels} AND ${table.user.role} = 'user'`)
		.then(rows => rows[0]?.count || 0)

	// Fetch top 20 players by points
	const topPlayers = await db
		.select()
		.from(table.user)
		.where(eq(table.user.role, 'user'))
		.orderBy(desc(table.user.points))
		.limit(20)

	return {
		currentLevel,
		totalUsers,
		votedUsers,
		remainingPlayers,
		gameStarted: currentLevel !== null,
		topPlayers
	}
}

export const actions: Actions = {
	startGame: async (event) => {
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' })
		}

		// Check if game already started
		const existingLevel = await db
			.select()
			.from(table.levels)
			.limit(1)

		if (existingLevel.length > 0) {
			return fail(400, { message: 'Game already started' })
		}

		// Create first level
		await db.insert(table.levels).values({
			id: 1,
			answer: null,
			active: true
		})

		return { success: true, message: 'Game started!' }
	},

	nextLevel: async (event) => {
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' })
		}

		// Get current level
		const currentLevel = await db
			.select()
			.from(table.levels)
			.orderBy(desc(table.levels.id))
			.limit(1)
			.then(rows => rows[0])

		if (!currentLevel) {
			return fail(400, { message: 'No active game' })
		}

		if (currentLevel.answer === null) {
			return fail(400, { message: 'Current level result not decided yet' })
		}

		// Note: Points are now awarded automatically when users load the game page
		// based on their correct votes, so we don't manually award points here

		// Deactivate current level
		await db
			.update(table.levels)
			.set({ active: false })
			.where(eq(table.levels.id, currentLevel.id))

		// Create next level
		await db.insert(table.levels).values({
			id: currentLevel.id + 1,
			answer: null,
			active: true
		})

		return { success: true, message: `Level ${currentLevel.id + 1} started!` }
	},

	stopVoting: async (event) => {
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' })
		}

		// Get current level
		const currentLevel = await db
			.select()
			.from(table.levels)
			.orderBy(desc(table.levels.id))
			.limit(1)
			.then(rows => rows[0])

		if (!currentLevel) {
			return fail(400, { message: 'No active game' })
		}

		// Deactivate current level (stops voting)
		await db
			.update(table.levels)
			.set({ active: false })
			.where(eq(table.levels.id, currentLevel.id))

		return { success: true, message: 'Voting stopped!' }
	},

	decide: async (event) => {
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' })
		}

		const formData = await event.request.formData()
		let result = formData.get('result')

		// Get current level
		const currentLevel = await db
			.select()
			.from(table.levels)
			.orderBy(desc(table.levels.id))
			.limit(1)
			.then(rows => rows[0])

		if (!currentLevel) {
			return fail(400, { message: 'No active game' })
		}

		if (currentLevel.answer !== null) {
			return fail(400, { message: 'Result already decided for this level' })
		}

		let correctAnswer: boolean
		let resultMessage: string

		if (result === null || !['0', '1'].includes(result.toString())) {
			// Generate random result if not provided or invalid
			correctAnswer = Math.random() < 0.5; // true for 1 (alive), false for 0 (dead)
			resultMessage = correctAnswer ? 'Cat is ALIVE' : 'Cat is DEAD';
		} else {
			correctAnswer = result === '1'
			resultMessage = `Cat is ${result === '1' ? 'ALIVE' : 'DEAD'} (Admin Decided)`;
		}

		// Set the result and stop voting
		await db
			.update(table.levels)
			.set({
				answer: correctAnswer,
				active: false
			})
			.where(eq(table.levels.id, currentLevel.id))

		return {
			success: true,
			message: `Result decided: ${resultMessage}! Points will be awarded automatically to correct voters.`
		}
	},

	resetGame: async (event) => {
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' })
		}

		// Delete all levels
		await db.delete(table.levels)

		// Reset all users' points, levels, votes, and pointsGiven
		await db
			.update(table.user)
			.set({
				points: 0,
				level: 0,
				lastVote: null,
				pointsGiven: 0
			})
			.where(eq(table.user.role, 'user'))

		return { success: true, message: 'Game reset successfully!' }
	}
}