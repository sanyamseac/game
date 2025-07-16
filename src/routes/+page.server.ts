import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'

export const load = async (event) => {
	// Get current game level so users join the active game
	const gameDetailsResult = await db.select().from(table.details)
	const gameDetails = gameDetailsResult[0]
    const user = event.locals.user
	
	// If no game details exist, return default values
	if (!gameDetails) {
		return {
			currentLevel: 1,
			allowRegistration: false,
			gameStarted: false,
			needsInitialization: true
		}
	}
	
	return {
		currentLevel: gameDetails.currentLevel,
		allowRegistration: gameDetails.allowReg,
		gameStarted: gameDetails.gameStarted,
		needsInitialization: false,
        userrole: user ? user.role : null
	}
}
