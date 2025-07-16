import { fail, redirect } from '@sveltejs/kit'
import { eq, and, sql, inArray } from 'drizzle-orm'
import * as auth from '$lib/server/auth'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import type { Actions, PageServerLoad } from './$types'
import { generateId } from '$lib/helper'

export const load: PageServerLoad = async (event) => {
	event.depends('app:admin-data')
	
	if (!event.locals.user) return redirect(302, '/login')

	if (event.locals.user.role !== 'admin') return redirect(302, '/')

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

	// Get all votes for current level with user details
	const votes = await db
		.select({
			id: table.votes.id,
			userId: table.votes.userId,
			userName: table.user.name,
			userEmail: table.user.email,
			answer: table.votes.answer,
			timestamp: table.votes.timestamp
		})
		.from(table.votes)
		.innerJoin(table.user, eq(table.votes.userId, table.user.id))
		.where(eq(table.votes.level, currentLevel))
		.orderBy(table.votes.timestamp)

	// Get eliminated players
	const eliminatedPlayers = await db
		.select({
			id: table.user.id,
			name: table.user.name,
			email: table.user.email,
			level: table.user.level
		})
		.from(table.user)
		.where(eq(table.user.isActive, false))
		.orderBy(table.user.name)

	// Get eliminated count
	const [eliminatedCount] = await db
		.select({ count: sql<number>`count(*)` })
		.from(table.user)
		.where(eq(table.user.isActive, false))

	return {
		gameDetails,
		levelData,
		voteStats: { alive, dead, total: alive + dead },
		activeUsersCount: activeUsersCount.count,
		eliminatedCount: eliminatedCount.count,
		eliminatedPlayers,
		votes,
		currentLevel
	}
}

export const actions: Actions = {
	endVoting: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })
		if (event.locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' })

		const [gameDetails] = await db.select().from(table.details)
		const currentLevel = gameDetails.currentLevel

		await db
			.update(table.levels)
			.set({ 
				votingEnded: true,
				allowAns: false 
			})
			.where(eq(table.levels.level, currentLevel))

		return { success: true, message: 'Voting ended for current level' }
	},

	revealResults: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })
		if (event.locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' })

		const [gameDetails] = await db.select().from(table.details)
		const currentLevel = gameDetails.currentLevel

		// Randomly determine the correct answer (0 or 1)
		const randomResult = Math.random()
		const correctAnswer = randomResult < 0.5 ? 'alive' : 'dead'

		await db
			.update(table.levels)
			.set({ 
				correct: correctAnswer,
				resultsRevealed: true 
			})
			.where(eq(table.levels.level, currentLevel))

		// Eliminate users who voted incorrectly
		const incorrectVotes = await db
			.select({ userId: table.votes.userId })
			.from(table.votes)
			.where(and(
				eq(table.votes.level, currentLevel),
				eq(table.votes.answer, correctAnswer === 'alive' ? 'dead' : 'alive')
			))

		if (incorrectVotes.length > 0) {
			const userIds = incorrectVotes.map(vote => vote.userId)
			await db
				.update(table.user)
				.set({ isActive: false })
				.where(inArray(table.user.id, userIds))
		}

		return { 
			success: true, 
			message: `Results revealed! Correct answer: ${correctAnswer}. ${incorrectVotes.length} players eliminated.`,
			correctAnswer,
			eliminatedCount: incorrectVotes.length
		}
	},

	nextLevel: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })
		if (event.locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' })

		const [gameDetails] = await db.select().from(table.details)
		const nextLevel = gameDetails.currentLevel + 1

		// Create next level if it doesn't exist
		const [existingLevel] = await db
			.select()
			.from(table.levels)
			.where(eq(table.levels.level, nextLevel))

		if (!existingLevel) {
			await db.insert(table.levels).values({
				id: generateId(),
				level: nextLevel,
				correct: null,
				allowAns: true,
				votingEnded: false,
				resultsRevealed: false,
				timerActive: false,
				timerEndTime: null,
				timerDuration: 10
			})
		} else {
			// Reset level state
			await db
				.update(table.levels)
				.set({
					correct: null,
					allowAns: true,
					votingEnded: false,
					resultsRevealed: false,
					timerActive: false,
					timerEndTime: null,
					timerDuration: 10
				})
				.where(eq(table.levels.level, nextLevel))
		}

		// Update current level
		await db
			.update(table.details)
			.set({ currentLevel: nextLevel })

		return { 
			success: true, 
			message: `Advanced to level ${nextLevel}`,
			newLevel: nextLevel
		}
	},

	resetGame: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })
		if (event.locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' })

		// Reset all users to active
		await db
			.update(table.user)
			.set({ 
				isActive: true,
				disabled: false,
				level: 1 
			})

		// Clear all votes
		await db.delete(table.votes)

		// Reset to pre-game state (game not started)
		await db
			.update(table.details)
			.set({ 
				currentLevel: 1,
				gameStarted: false  // This should be false to fully reset
			})

		// Reset level 1
		await db
			.update(table.levels)
			.set({
				correct: null,
				allowAns: false,  // Should be false until game starts
				votingEnded: false,
				resultsRevealed: false,
				timerActive: false,
				timerEndTime: null,
				timerDuration: 10
			})
			.where(eq(table.levels.level, 1))

		return { 
			success: true, 
			message: 'Game reset successfully. All players are back in the lobby!'
		}
	},

	toggleRegistration: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })
		if (event.locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' })

		const [gameDetails] = await db.select().from(table.details)
		const newAllowReg = !gameDetails.allowReg

		await db
			.update(table.details)
			.set({ allowReg: newAllowReg })

		return { 
			success: true, 
			message: newAllowReg ? 'Registration is now open' : 'Registration has been stopped'
		}
	},

	startGame: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })
		if (event.locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' })

		const [gameDetails] = await db.select().from(table.details)
		
		if (gameDetails.gameStarted) {
			return fail(400, { message: 'Game has already started' })
		}

		// Start the game and enable voting for level 1
		await db
			.update(table.details)
			.set({ 
				gameStarted: true,
				currentLevel: 1
			})

		// Ensure level 1 exists and is ready for voting
		const [level1] = await db
			.select()
			.from(table.levels)
			.where(eq(table.levels.level, 1))

		if (!level1) {
			await db.insert(table.levels).values({
				id: generateId(),
				level: 1,
				correct: null,
				allowAns: true,
				votingEnded: false,
				resultsRevealed: false,
				timerActive: false,
				timerEndTime: null,
				timerDuration: 10
			})
		} else {
			await db
				.update(table.levels)
				.set({
					allowAns: true,
					votingEnded: false,
					resultsRevealed: false,
					correct: null,
					timerActive: false,
					timerEndTime: null,
					timerDuration: 10
				})
				.where(eq(table.levels.level, 1))
		}

		return { 
			success: true, 
			message: 'Game started! Level 1 voting is now open.'
		}
	},

	startTimer: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })
		if (event.locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' })

		const [gameDetails] = await db.select().from(table.details)
		const currentLevel = gameDetails.currentLevel

		const [levelData] = await db
			.select()
			.from(table.levels)
			.where(eq(table.levels.level, currentLevel))

		if (!levelData || levelData.votingEnded) {
			return fail(400, { message: 'Cannot start timer - voting has ended' })
		}

		const timerDuration = 10 // 10 seconds
		const timerEndTime = Math.floor(Date.now() / 1000) + timerDuration

		await db
			.update(table.levels)
			.set({ 
				timerActive: true,
				timerEndTime: timerEndTime,
				timerDuration: timerDuration
			})
			.where(eq(table.levels.level, currentLevel))

		return { 
			success: true, 
			message: `Timer started for ${timerDuration} seconds!`
		}
	},

	stopTimer: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })
		if (event.locals.user.role !== 'admin') return fail(403, { message: 'Forbidden' })

		const [gameDetails] = await db.select().from(table.details)
		const currentLevel = gameDetails.currentLevel

		await db
			.update(table.levels)
			.set({ 
				timerActive: false,
				timerEndTime: null
			})
			.where(eq(table.levels.level, currentLevel))

		return { 
			success: true, 
			message: 'Timer stopped!'
		}
	}
}
