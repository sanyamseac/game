<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'

	let { data } = $props()

	let refreshInterval: ReturnType<typeof setInterval>
	let quantumParticles: Array<{ x: number; y: number; vx: number; vy: number; opacity: number }> = []
	let animationId: number
	let timerDisplayInterval: ReturnType<typeof setInterval>

	onMount(() => {
		// Auto-refresh every 500ms for live updates
		refreshInterval = setInterval(() => {
			invalidate('app:display-data')
		}, 200)

		// Update timer display every second
		timerDisplayInterval = setInterval(() => {
			updateTimerDisplay()
		}, 1000)

		// Initialize quantum particles
		for (let i = 0; i < 50; i++) {
			quantumParticles.push({
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				vx: (Math.random() - 0.5) * 1,
				vy: (Math.random() - 0.5) * 1,
				opacity: Math.random() * 0.5 + 0.1
			})
		}
		animateParticles()
	})

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval)
		}
		if (animationId) {
			cancelAnimationFrame(animationId)
		}
		if (timerDisplayInterval) {
			clearInterval(timerDisplayInterval)
		}
	})

	function updateTimerDisplay() {
		if (data.levelData?.timerActive && data.levelData?.timerEndTime) {
			const timeLeft = Math.max(0, data.levelData.timerEndTime - Math.floor(Date.now() / 1000))
			const timerElement = document.getElementById('timer-display')
			if (timerElement) {
				timerElement.textContent = timeLeft.toString()
				
				// Add animation when time is running low
				if (timeLeft <= 5 && timeLeft > 0) {
					timerElement.classList.add('animate-pulse')
				} else {
					timerElement.classList.remove('animate-pulse')
				}
			}
		}
	}

	function animateParticles() {
		quantumParticles = quantumParticles.map((particle) => ({
			...particle,
			x: (particle.x + particle.vx + window.innerWidth) % window.innerWidth,
			y: (particle.y + particle.vy + window.innerHeight) % window.innerHeight,
		}))

		animationId = requestAnimationFrame(animateParticles)
	}

	$effect(() => {
		// Update page title with current stats
		if (typeof window !== 'undefined') {
			document.title = `Level ${data.currentLevel} - ${data.voteStats.total} votes - Quantum Cat Display`
		}
	})
</script>

<svelte:head>
	<title>Live Display - Quantum Cat Game</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
	<!-- Background Quantum Particles -->
	{#each quantumParticles as particle}
		<div
			class="absolute w-1 h-1 bg-cyan-400 rounded-full pointer-events-none"
			style="left: {particle.x}px; top: {particle.y}px; opacity: {particle.opacity};"
		></div>
	{/each}

	<!-- Header -->
	<div class="relative z-10 text-center py-8">
		<h1 class="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
			⚛️ ISAQC QUANTUM CHALLENGE
		</h1>
		<div class="text-2xl text-gray-300 mb-2">Live Tournament Display</div>
		<div class="text-lg text-cyan-400">
			Level <span class="font-bold text-3xl">{data.currentLevel}</span>
		</div>
		<div class="mt-2 text-sm text-purple-300">
			IIIT Society for Applied Quantum Computing
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="relative z-10 container mx-auto px-4 pb-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			
			<!-- Left Column: Game Status -->
			<div class="space-y-6">
				<!-- Timer Display -->
				{#if data.levelData?.timerActive}
					<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-red-500/50 p-6">
						<h2 class="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
							⏰ Voting Timer
						</h2>
						<div class="text-center">
							<div class="text-6xl font-mono text-red-300 mb-2" id="timer-display">
								{Math.max(0, Math.floor((data.levelData.timerEndTime - Math.floor(Date.now() / 1000))))}
							</div>
							<div class="text-lg text-red-200">
								seconds remaining
							</div>
							<div class="mt-4 w-full bg-gray-700 rounded-full h-3">
								<div 
									class="bg-red-500 h-3 rounded-full transition-all duration-1000" 
									style="width: {Math.max(0, Math.min(100, ((data.levelData.timerEndTime - Math.floor(Date.now() / 1000)) / data.levelData.timerDuration) * 100))}%"
								></div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Current Status -->
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
					<h2 class="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
						📊 Game Status
					</h2>
					<div class="space-y-3">
						<div class="flex justify-between items-center">
							<span class="text-gray-300">Voting:</span>
							<span class="px-3 py-1 rounded-full text-sm font-bold {data.levelData?.allowAns ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}">
								{data.levelData?.allowAns ? '🟢 OPEN' : '🔴 CLOSED'}
							</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-300">Results:</span>
							<span class="px-3 py-1 rounded-full text-sm font-bold {data.levelData?.resultsRevealed ? 'bg-blue-900/50 text-blue-300' : 'bg-yellow-900/50 text-yellow-300'}">
								{data.levelData?.resultsRevealed ? '✅ REVEALED' : '⏳ PENDING'}
							</span>
						</div>
						{#if data.levelData?.resultsRevealed && data.levelData?.correct}
							<div class="mt-4 p-4 bg-purple-900/50 rounded-lg border border-purple-500/30">
								<div class="text-center">
									<div class="text-4xl mb-2">
										{data.levelData.correct === 'alive' ? '🐱' : '💀'}
									</div>
									<div class="text-lg font-bold text-purple-300">
										Cat is {data.levelData.correct.toUpperCase()}!
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Player Statistics -->
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
					<h2 class="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
						👥 Players
					</h2>
					<div class="space-y-4">
						<div class="flex justify-between items-center">
							<span class="text-gray-300">Active Players:</span>
							<span class="text-3xl font-bold text-green-400">{data.activeUsersCount}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-300">Eliminated:</span>
							<span class="text-3xl font-bold text-red-400">{data.eliminatedUsersCount}</span>
						</div>
						<div class="w-full bg-gray-700 rounded-full h-4">
							<div 
								class="bg-green-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2" 
								style="width: {data.activeUsersCount + data.eliminatedUsersCount > 0 ? (data.activeUsersCount / (data.activeUsersCount + data.eliminatedUsersCount)) * 100 : 0}%"
							>
								{#if data.activeUsersCount > 0}
									<span class="text-xs font-bold text-white">
										{Math.round((data.activeUsersCount / (data.activeUsersCount + data.eliminatedUsersCount)) * 100)}%
									</span>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Center Column: Voting Display -->
			<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20 p-8">
				<h2 class="text-3xl font-bold text-green-400 mb-6 text-center flex items-center justify-center gap-2">
					🗳️ Live Voting
				</h2>
				
				<div class="text-center mb-8">
					<div class="text-6xl font-bold text-white mb-2">
						{data.voteStats.total}
					</div>
					<div class="text-xl text-gray-300">
						Total Votes Cast
					</div>
					<div class="text-sm text-gray-400 mt-2">
						{data.activeUsersCount - data.voteStats.total} pending
					</div>
				</div>

				<!-- Vote Breakdown -->
				<div class="space-y-6">
					<!-- Alive Votes -->
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="text-2xl flex items-center gap-2">
								🐱 <span class="text-green-400 font-bold">ALIVE</span>
							</span>
							<span class="text-2xl font-bold text-green-400">
								{data.voteStats.alive}
							</span>
						</div>
						<div class="w-full bg-gray-700 rounded-full h-6">
							<div 
								class="bg-green-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center" 
								style="width: {data.voteStats.total > 0 ? (data.voteStats.alive / data.voteStats.total) * 100 : 0}%"
							>
								{#if data.voteStats.alive > 0}
									<span class="text-sm font-bold text-white">
										{Math.round((data.voteStats.alive / data.voteStats.total) * 100)}%
									</span>
								{/if}
							</div>
						</div>
					</div>

					<!-- Dead Votes -->
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="text-2xl flex items-center gap-2">
								💀 <span class="text-red-400 font-bold">DEAD</span>
							</span>
							<span class="text-2xl font-bold text-red-400">
								{data.voteStats.dead}
							</span>
						</div>
						<div class="w-full bg-gray-700 rounded-full h-6">
							<div 
								class="bg-red-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center" 
								style="width: {data.voteStats.total > 0 ? (data.voteStats.dead / data.voteStats.total) * 100 : 0}%"
							>
								{#if data.voteStats.dead > 0}
									<span class="text-sm font-bold text-white">
										{Math.round((data.voteStats.dead / data.voteStats.total) * 100)}%
									</span>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Progress to next phase -->
				{#if data.voteStats.total < data.activeUsersCount}
					<div class="mt-8 text-center">
						<div class="text-sm text-gray-400 mb-2">
							Waiting for {data.activeUsersCount - data.voteStats.total} more vote{data.activeUsersCount - data.voteStats.total !== 1 ? 's' : ''}
						</div>
						<div class="w-full bg-gray-700 rounded-full h-3">
							<div 
								class="bg-yellow-500 h-3 rounded-full transition-all duration-500 animate-pulse" 
								style="width: {data.activeUsersCount > 0 ? (data.voteStats.total / data.activeUsersCount) * 100 : 0}%"
							></div>
						</div>
					</div>
				{:else if data.voteStats.total === data.activeUsersCount && !data.levelData?.votingEnded}
					<div class="mt-8 text-center">
						<div class="text-lg font-bold text-yellow-400 animate-pulse">
							🎯 All votes collected! Waiting for admin...
						</div>
					</div>
				{/if}
			</div>

			<!-- Right Column: Recent Activity -->
			<div class="space-y-6">
				<!-- Recent Votes -->
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-indigo-500/20 p-6">
					<h2 class="text-2xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
						⚡ Recent Votes
					</h2>
					{#if data.recentVotes.length > 0}
						<div class="space-y-2 max-h-96 overflow-y-auto">
							{#each data.recentVotes as vote}
								<div class="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
									<div class="flex items-center gap-2">
										<span class="text-lg">
											{vote.answer === 'alive' ? '🐱' : '💀'}
										</span>
										<span class="font-medium text-white">
											{vote.userName}
										</span>
									</div>
									<span class="text-xs text-gray-400">
										{new Date(vote.timestamp).toLocaleTimeString()}
									</span>
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-center text-gray-400 py-8">
							No votes yet for this level
						</div>
					{/if}
				</div>

				<!-- Quantum Box -->
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
					<h2 class="text-xl font-bold text-cyan-400 mb-4 text-center">
						Quantum State
					</h2>
					<div class="relative h-48 w-full overflow-hidden rounded-lg border-2 border-cyan-400 bg-gradient-to-br from-gray-800 to-gray-900">
						<div class="absolute inset-0 flex items-center justify-center">
							{#if data.levelData?.resultsRevealed && data.levelData?.correct}
								{#if data.levelData.correct === 'alive'}
									<div class="text-center">
										<div class="text-6xl mb-2 animate-pulse">🐱</div>
										<div class="text-lg font-bold text-green-400">ALIVE</div>
									</div>
								{:else}
									<div class="text-center">
										<div class="text-6xl mb-2">💀</div>
										<div class="text-lg font-bold text-red-400">DEAD</div>
									</div>
								{/if}
							{:else}
								<div class="text-center animate-quantum-float">
									<div class="text-6xl mb-2 animate-bounce">❓</div>
									<div class="text-lg font-bold text-cyan-400">
										{data.levelData?.votingEnded ? 'CALCULATING...' : 'SUPERPOSITION'}
									</div>
									<div class="flex justify-center space-x-1 mt-2">
										<div class="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style="animation-delay: 0s;"></div>
										<div class="w-2 h-2 bg-purple-400 rounded-full animate-ping" style="animation-delay: 0.2s;"></div>
										<div class="w-2 h-2 bg-indigo-400 rounded-full animate-ping" style="animation-delay: 0.4s;"></div>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div class="relative z-10 text-center py-4 border-t border-cyan-500/20">
		<div class="text-sm text-gray-400">
			Last updated: {new Date().toLocaleTimeString()} | Auto-refresh every 0.2s
		</div>
	</div>
</div>

<style>
	@keyframes quantum-float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-10px); }
	}

	.animate-quantum-float {
		animation: quantum-float 3s ease-in-out infinite;
	}
</style>
