import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'

export const load = async (event) => {
	return redirect(302, '/game')
}
