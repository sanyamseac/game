import type { RequestEvent } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'

const DAY_IN_MS = 1000 * 60 * 60 * 24

export const sessionCookieName = 'auth-session'

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18))
	const token = encodeBase64url(bytes)
	return token
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	await db.update(table.user).set({ session: sessionId }).where(eq(table.user.id, userId))
	return sessionId
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const [user] = await db.select().from(table.user).where(eq(table.user.session, sessionId))
	if (!user) return null
	return user
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>

export function setSessionTokenCookie(event: RequestEvent, token: string) {
	event.cookies.set(sessionCookieName, token, {
		expires: new Date(Date.now() + DAY_IN_MS * 30),
		path: '/',
	})
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/',
	})
}
