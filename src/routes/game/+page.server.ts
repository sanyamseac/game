import { redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { fail } from '@sveltejs/kit'

export const load = async (event) => {
	if (!event.locals.user) return redirect(302, '/login')

	const level = await db
		.select()
		.from(table.levels)
		.orderBy(table.levels.id)
		.limit(1)
	
	if (!level || level.length === 0) return {level : null}

	if (level[0].active === false) return { level: -1 }

	return { level: level[0].id }
}

export const actions = {
	vote: async (event) => {
		if (!event.locals.user) return redirect(302, '/login')
		const formData = await event.request.formData()
		const answer = formData.get('answer')

		if (typeof answer !== 'string' || !['1', '0'].includes(answer))
			return fail(400, { message: 'Invalid answer' })

		const level = await db.select().from(table.levels).orderBy(table.levels.id).limit(1).then(rows => rows[0])
		if (!level) return fail(404, { message: 'Level not found' })

		if(event.locals.user.level === level) return fail(400, { message: 'You have already voted on this level' })	

		if (answer === level.answer?.toString()) {
			await db.update(table.user)
				.set({ 
					points: sql`${table.user.points} + 1`, 
					level: level.id 
				})
				.where(eq(table.user.id, event.locals.user.id))
		} else {
			await db.update(table.user)
				.set({  
					level: level.id 
				})
				.where(eq(table.user.id, event.locals.user.id))
		}

		return { success: true }
	},
}