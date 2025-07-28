import { redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import { eq, and, sql, desc } from 'drizzle-orm'
import { fail } from '@sveltejs/kit'

// Helper function to check and award points for completed levels
async function checkAndAwardPoints(userId: string) {
	const user = await db
		.select()
		.from(table.user)
		.where(eq(table.user.id, userId))
		.then(rows => rows[0])

	if (!user) return

	// Get all completed levels (where answer is not null) that are greater than user's pointsGiven
	const completedLevels = await db
		.select()
		.from(table.levels)
		.where(sql`${table.levels.answer} IS NOT NULL AND ${table.levels.id} > ${user.pointsGiven}`)
		.orderBy(table.levels.id)

	let pointsToAdd = 0
	let lastProcessedLevel = user.pointsGiven

	for (const level of completedLevels) {
		// Check if user voted on this level and if their vote matches the answer
		if (user.level >= level.id && user.lastVote !== null) {
			// User voted on this level, check if they were correct
			if (user.lastVote === level.answer) {
				pointsToAdd++
			}
		}
		lastProcessedLevel = level.id
	}

	// Update user's points and pointsGiven if there are points to award
	if (pointsToAdd > 0 || lastProcessedLevel > user.pointsGiven) {
		await db
			.update(table.user)
			.set({
				points: user.points + pointsToAdd,
				pointsGiven: lastProcessedLevel
			})
			.where(eq(table.user.id, userId))
	}
}

export const load = async (event) => {
	if (!event.locals.user) return redirect(302, '/login')

	const level = await db
		.select()
		.from(table.levels)
		.orderBy(desc(table.levels.id))
		.limit(1)
	
	if (!level || level.length === 0) {
        return {
            level: null,
            hasVoted: false,
            levelActive: false,
            userLevel: event.locals.user.level,
            userPoints: event.locals.user.points
        }
    }

	const currentLevel = level[0]

	// Check and award points for previous levels where user voted correctly
	await checkAndAwardPoints(event.locals.user.id)

	// Refresh user data after potential point award
	const updatedUser = await db
		.select()
		.from(table.user)
		.where(eq(table.user.id, event.locals.user.id))
		.then(rows => rows[0])

	// Check if user already voted on current level
	const hasVoted = updatedUser.level >= currentLevel.id

	return { 
		level: currentLevel.id,
		hasVoted: hasVoted,
		levelActive: currentLevel.active,
		userLevel: updatedUser.level,
		userPoints: updatedUser.points
	}
}

export const actions = {
	vote: async (event) => {
		if (!event.locals.user) return redirect(302, '/login')
		const formData = await event.request.formData()
		const answer = formData.get('answer')

		if (typeof answer !== 'string' || !['1', '0'].includes(answer))
			return fail(400, { message: 'Invalid answer' })

		// Get current level
		const level = await db
			.select()
			.from(table.levels)
			.orderBy(desc(table.levels.id))
			.limit(1)
			.then(rows => rows[0])

		if (!level) return fail(404, { message: 'No active level found' })

		if (!level.active) {
			return fail(400, { message: 'Voting is closed for this level' })
		}

		// Check if user already voted on this level
		if (event.locals.user.level >= level.id) {
			return fail(400, { message: 'You have already voted on this level' })
		}

		// Store the vote and update user's level
		const voteValue = answer === '1' ? true : false
		
		await db.update(table.user)
			.set({ 
				level: level.id,
				lastVote: voteValue
			})
			.where(eq(table.user.id, event.locals.user.id))

		return { success: true, message: 'Vote recorded successfully!' }
	},
}