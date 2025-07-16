import type { Handle } from '@sveltejs/kit'
import * as auth from '$lib/server/auth'

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName)

	if (!sessionToken) {
		event.locals.user = null
		return resolve(event)
	}

	const user = await auth.validateSessionToken(sessionToken)

	if (!user) {
		auth.deleteSessionTokenCookie(event)
	}

	event.locals.user = user
	return resolve(event)
}

export const handle: Handle = handleAuth
