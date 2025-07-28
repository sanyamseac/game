import { fail, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import * as auth from '$lib/server/auth'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import type { Actions, PageServerLoad } from './$types'
import { generateId } from '$lib/helper'

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/game')
	}

	return {}
}

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData()
		const name = formData.get('name')
		const email = formData.get('email')

		if (!name || !email) {
			return fail(400, { message: 'Name and email are required' })
		}
		if (typeof name !== 'string' || typeof email !== 'string') {
			return fail(400, { message: 'Invalid name or email' })
		}

		const sessionId = auth.generateSessionToken()

		const userId = generateId()
		const store = await auth.createSession(sessionId, userId)

		await db.insert(table.user).values({
			id: userId,
			name,
			email,
			session: store,
		})

		auth.setSessionTokenCookie(event, sessionId)

		return redirect(302, '/game')
	},
}
