import { error, fail, redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'
import * as auth from '$lib/server/auth'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import type { Actions, PageServerLoad } from './$types'
import { generateId } from '$lib/helper'

export const load: PageServerLoad = async (event) => {
	event.depends('app:game-data')
	
	if (!event.locals.user) return redirect(302, '/login')

	const level = Number(event.params.level)
	if (isNaN(level) || level < 1) {
		throw error(400, { message: 'Invalid level number' })
	}

	const [levelData] = await db.select().from(table.levels).where(eq(table.levels.level, level))
	const [gameDetails] = await db.select().from(table.details)

	if (!levelData) throw error(404, { message: 'Level not found' })

	if (level !== gameDetails.currentLevel) {
		return redirect(302, `/game/${gameDetails.currentLevel}`)
	}

	if (!levelData.allowAns && !levelData.votingEnded) {
		throw error(400, { message: 'Voting is not allowed for this level' })
	}

	if (event.locals.user.disabled || !event.locals.user.isActive) {
		return redirect(302, '/eliminated')
	}

	if (event.locals.user.level !== level) {
		return error(403, { message: 'You are not allowed to access this level' })
	}
	// Check if user already voted
	const [existingVote] = await db
		.select()
		.from(table.votes)
		.where(and(
			eq(table.votes.userId, event.locals.user.id),
			eq(table.votes.level, level)
		))

	return {
		level,
		levelData,
		gameDetails,
		hasVoted: !!existingVote,
		userVote: existingVote?.answer || null
	}
}

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return fail(401, { message: 'Unauthorized' })

		const level = Number(event.params.level)
		const userId = event.locals.user.id
		const answer = await event.request.formData().then((data) => data.get('answer')?.toString())

		if (!answer || !['alive', 'dead'].includes(answer)) {
			return fail(400, { message: 'Invalid answer' })
		}

		const [levelData] = await db.select().from(table.levels).where(eq(table.levels.level, level))
		const [gameDetails] = await db.select().from(table.details)

		if (!levelData) return fail(404, { message: 'Level not found' })

		if (level !== gameDetails.currentLevel) {
			return fail(400, { message: 'This is not the current level' })
		}

		if (!levelData.allowAns || levelData.votingEnded) {
			return fail(400, { message: 'Voting has ended for this level' })
		}

		if (event.locals.user.disabled || !event.locals.user.isActive) {
			return fail(403, { message: 'You have been eliminated - redirecting...' })
		}

		// Check if user already voted
		const [existingVote] = await db
			.select()
			.from(table.votes)
			.where(and(
				eq(table.votes.userId, userId),
				eq(table.votes.level, level)
			))

		if (existingVote) {
			return fail(400, { message: 'You have already voted for this level' })
		}

		// Record the vote
		await db.insert(table.votes).values({
			id: generateId(),
			userId,
			level,
			answer,
			timestamp: Date.now()
		})

		return { success: true, message: 'Vote recorded successfully!' }
	},
}
