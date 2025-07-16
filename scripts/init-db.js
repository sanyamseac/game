#!/usr/bin/env node

const { db } = require('../build/server/chunks/exports-Cv9LZeD1.js');
const table = require('../build/server/chunks/index-server-CEtzqDvN.js');
const { generateId } = require('../build/server/chunks/helper-ChPYHbt9.js');

async function initializeDatabase() {
	console.log('🚀 Initializing database...');

	try {
		// Clear existing game data (but keep users)
		console.log('🧹 Clearing existing game data...');
		await db.delete(table.votes).execute();
		await db.delete(table.levels).execute();
		await db.delete(table.details).execute();

		// Create game details
		console.log('🎮 Setting up game details...');
		await db.insert(table.details).values({
			id: generateId(),
			allowReg: true,
			currentLevel: 1,
			gameStarted: false
		});

		// Create initial level 1
		console.log('🌀 Creating Level 1...');
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
		});

		console.log('✅ Database initialized successfully!');
		console.log('\n📋 Setup Summary:');
		console.log('• Game details created');
		console.log('• Registration: OPEN');
		console.log('• Game state: PRE-GAME LOBBY');
		console.log('• Current level: 1 (voting disabled)');
		console.log('\n🎯 Next steps:');
		console.log('1. Create admin user via Drizzle Studio:');
		console.log('   - email: admin@yourdomain.com');
		console.log('   - role: admin');
		console.log('   - session: (generate a random ID)');
		console.log('2. Start the server: npm run dev');
		console.log('3. Go to /login and sign in with admin email');
		console.log('4. Go to /admin to control the game');
		console.log('5. Use "Start Game" to begin Level 1 voting');

		process.exit(0);
	} catch (error) {
		console.error('❌ Error initializing database:', error);
		process.exit(1);
	}
}

// Run the initialization
initializeDatabase();
