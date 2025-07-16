import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import { generateId } from '$lib/helper'

export const POST = async () => {
	try {
		console.log('🚀 Initializing database...')

		// Clear existing game data (but keep users)
		console.log('🧹 Clearing existing game data...')
		await db.delete(table.votes).execute()
		await db.delete(table.levels).execute()
		await db.delete(table.details).execute()

		// Create game details
		console.log('🎮 Setting up game details...')
		await db.insert(table.details).values({
			id: generateId(),
			allowReg: true,
			currentLevel: 1,
			gameStarted: false
		})

		// Create initial level 1
		console.log('🌀 Creating Level 1...')
		await db.insert(table.levels).values({
			id: generateId(),
			level: 1,
			correct: null,
			allowAns: false, // Will be enabled when game starts
			votingEnded: false,
			resultsRevealed: false,
			timerActive: false,
			timerEndTime: null,
			timerDuration: 10
		})

		return json({
			success: true,
			message: 'Database initialized successfully!',
			instructions: [
				'Game details created',
				'Registration: OPEN',
				'Game state: PRE-GAME LOBBY',
				'Current level: 1 (voting disabled)',
				'',
				'Next steps:',
				'1. Create admin user via Drizzle Studio (npm run db:studio)',
				'2. Go to /admin to control the game',
				'3. Use "Start Game" to begin Level 1 voting'
			]
		})
	} catch (error) {
		console.error('❌ Error initializing database:', error)
		return json({ 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		}, { status: 500 })
	}
}
