import { redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import { eq, and, sql, desc } from 'drizzle-orm'
import { fail } from '@sveltejs/kit'

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
            userPoints: event.locals.user.points // Added userPoints
        }
    }

	const currentLevel = level[0]

	// Check if user already voted: user.level >= currentLevel.id means they voted
	const hasVoted = event.locals.user.level >= currentLevel.id

	return { 
		level: currentLevel.id,
		hasVoted: hasVoted,
		levelActive: currentLevel.active,
		userLevel: event.locals.user.level,
		userPoints: event.locals.user.points // Added userPoints
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

		// Check if user already voted: user.level >= level.id means they voted
		if (event.locals.user.level >= level.id) {
			return fail(400, { message: 'You have already voted on this level' })
		}

		await db.update(table.user)
			.set({ level: level.id })
			.where(eq(table.user.id, event.locals.user.id))

		return { success: true, message: 'Vote recorded successfully!' }
	},
}