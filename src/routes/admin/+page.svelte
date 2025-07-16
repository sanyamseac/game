<script lang="ts">
	import { enhance } from '$app/forms'
	import { invalidate, invalidateAll } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'

	let { data, form } = $props()

	let refreshInterval: ReturnType<typeof setInterval>

	onMount(() => {
		// Auto-refresh every 2 seconds
		refreshInterval = setInterval(() => {
			invalidateAll()
		}, 300)
	})

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval)
		}
	})

	let isProcessing = $state(false)
	let autoStartTimer = $state(false)

	let endRef: HTMLFormElement
</script>

<svelte:head>
	<title>Admin Panel - Quantum Cat Game</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
	<!-- Navigation Bar -->
	<nav class="border-b border-cyan-500/20 bg-black/20 backdrop-blur-sm">
		<div class="container mx-auto flex items-center justify-between px-4 py-4">
			<div class="flex items-center gap-4">
				<a href="/" class="text-cyan-400 transition-colors hover:text-cyan-300">
					🏠 Home
				</a>
				<span class="text-gray-500">|</span>
				<span class="text-gray-300">Admin Panel</span>
			</div>
			<div class="flex items-center gap-4">
				<a
					href="/game/{data.currentLevel}"
					class="rounded bg-blue-700 px-3 py-1 text-sm transition-colors hover:bg-blue-600"
				>
					🎮 View Game
				</a>
				<a
					href="/display"
					class="rounded bg-green-700 px-3 py-1 text-sm transition-colors hover:bg-green-600"
				>
					📊 Display Board
				</a>
			</div>
		</div>
	</nav>

	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1
				class="mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent"
			>
				🔧 ISAQC Admin Control Panel
			</h1>
			<p class="text-xl text-gray-300">Level {data.currentLevel} Management</p>
			<div class="mt-2 text-sm text-purple-300">
				IIIT Society for Applied Quantum Computing
			</div>
		</div>

		<!-- Status Messages -->
		{#if form?.message}
			<div
				class="mb-6 rounded-lg p-4 {form.success
					? 'border border-green-500 bg-green-900/50 text-green-200'
					: 'border border-red-500 bg-red-900/50 text-red-200'}"
			>
				<div class="flex items-center justify-center gap-2">
					<span class="text-xl">{form.success ? '✅' : '❌'}</span>
					<span>{form.message}</span>
				</div>
				{#if form.correctAnswer}
					<div class="mt-2 text-center text-sm">
						Correct Answer: <strong>{form.correctAnswer}</strong> | 
						Eliminated: <strong>{form.eliminatedCount}</strong> players
					</div>
				{/if}
			</div>
		{/if}

		<!-- Game Overview -->
		<div class="mb-8 grid gap-6 md:grid-cols-3">
			<!-- Current Level Status -->
			<div class="rounded-lg border border-cyan-500/20 bg-black/20 p-6 backdrop-blur-sm">
				<h3 class="mb-4 text-lg font-bold text-cyan-400">📊 Level Status</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span>Current Level:</span>
						<span class="font-bold text-cyan-400">{data.currentLevel}</span>
					</div>
					<div class="flex justify-between">
						<span>Voting:</span>
						<span class="font-bold {data.levelData?.allowAns ? 'text-green-400' : 'text-red-400'}">
							{data.levelData?.allowAns ? 'Open' : 'Closed'}
						</span>
					</div>
					<div class="flex justify-between">
						<span>Results:</span>
						<span class="font-bold {data.levelData?.resultsRevealed ? 'text-blue-400' : 'text-yellow-400'}">
							{data.levelData?.resultsRevealed ? 'Revealed' : 'Pending'}
						</span>
					</div>
					{#if data.levelData?.correct}
						<div class="flex justify-between border-t border-gray-600 pt-2">
							<span>Correct Answer:</span>
							<span class="font-bold text-purple-400">{data.levelData.correct}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Vote Statistics -->
			<div class="rounded-lg border border-green-500/20 bg-black/20 p-6 backdrop-blur-sm">
				<h3 class="mb-4 text-lg font-bold text-green-400">🗳️ Vote Statistics</h3>
				<div class="space-y-3">
					<div class="flex justify-between text-sm">
						<span>Total Votes:</span>
						<span class="font-bold text-white">{data.voteStats.total}</span>
					</div>
					<div class="space-y-2">
						<div class="flex justify-between text-sm">
							<span class="flex items-center gap-1">
								🐱 Alive:
							</span>
							<span class="font-bold text-green-400">
								{data.voteStats.alive} ({data.voteStats.total > 0 ? Math.round((data.voteStats.alive / data.voteStats.total) * 100) : 0}%)
							</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="flex items-center gap-1">
								💀 Dead:
							</span>
							<span class="font-bold text-red-400">
								{data.voteStats.dead} ({data.voteStats.total > 0 ? Math.round((data.voteStats.dead / data.voteStats.total) * 100) : 0}%)
							</span>
						</div>
					</div>
					<div class="w-full bg-gray-700 rounded-full h-3">
						<div 
							class="bg-green-500 h-3 rounded-full transition-all duration-300" 
							style="width: {data.voteStats.total > 0 ? (data.voteStats.alive / data.voteStats.total) * 100 : 0}%"
						></div>
					</div>
				</div>
			</div>

			<!-- Player Statistics -->
			<div class="rounded-lg border border-purple-500/20 bg-black/20 p-6 backdrop-blur-sm">
				<h3 class="mb-4 text-lg font-bold text-purple-400">👥 Player Statistics</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span>Active Players:</span>
						<span class="font-bold text-green-400">{data.activeUsersCount}</span>
					</div>
					<div class="flex justify-between">
						<span>Voted This Round:</span>
						<span class="font-bold text-blue-400">{data.voteStats.total}</span>
					</div>
					<div class="flex justify-between">
						<span>Pending Votes:</span>
						<span class="font-bold text-yellow-400">{data.activeUsersCount - data.voteStats.total}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Admin Controls -->
		<div class="mb-8">
			<h3 class="mb-4 text-xl font-bold text-cyan-400">🎛️ Game Controls</h3>
			
			<!-- Registration and Game Start Controls -->
			<div class="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-900/20 p-6 backdrop-blur-sm">
				<h4 class="mb-4 text-lg font-bold text-yellow-400">🚀 Game Flow Controls</h4>
				<div class="grid gap-4 md:grid-cols-3">
					<!-- Registration Control -->
					<form
						method="POST"
						action="?/toggleRegistration"
						use:enhance={() => {
							isProcessing = true
							return async ({ result }) => {
								isProcessing = false
								if (result.type === 'success') {
									invalidate('app:admin-data')
								}
							}
						}}
					>
						<button
							type="submit"
							disabled={isProcessing}
							class="w-full rounded-lg px-4 py-3 text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 {data.gameDetails.allowReg ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}"
						>
							{data.gameDetails.allowReg ? '🚫 Stop Registration' : '✅ Allow Registration'}
						</button>
					</form>

					<!-- Game Start Control -->
					<form
						method="POST"
						action="?/startGame"
						use:enhance={() => {
							isProcessing = true
							return async ({ result }) => {
								isProcessing = false
								if (result.type === 'success') {
									invalidate('app:admin-data')
								}
							}
						}}
					>
						<button
							type="submit"
							disabled={isProcessing || data.gameDetails.gameStarted}
							class="w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-bold transition-all duration-300 hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
							onclick={(e) => {
								if (!confirm('Are you sure you want to start the game? This will begin Level 1 and players can start voting.')) {
									e.preventDefault()
								}
							}}
						>
							🎮 Start Game
						</button>
					</form>

					<!-- Status Indicator -->
					<div class="flex items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-bold {data.gameDetails.gameStarted ? 'border-green-500 bg-green-900/50 text-green-300' : 'border-yellow-500 bg-yellow-900/50 text-yellow-300'}">
						{#if data.gameDetails.gameStarted}
							🟢 Game Active
						{:else}
							🟡 Pre-Game Lobby
						{/if}
					</div>
				</div>
			</div>

			<!-- Level Controls -->
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<!-- End Voting -->
				<form
					bind:this = {endRef}
					method="POST"
					action="?/endVoting"
					use:enhance={() => {
						isProcessing = true
						return async ({ result }) => {
							isProcessing = false
							if (result.type === 'success') {
								invalidate('app:admin-data')
							}
						}
					}}
				>
					<button
						type="submit"
						disabled={isProcessing || data.levelData?.votingEnded}
						class="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-bold transition-all duration-300 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
					>
						🛑 End Voting
					</button>
				</form>

				<!-- Reveal Results -->
				<form
					method="POST"
					action="?/revealResults"
					use:enhance={() => {
						isProcessing = true
						return async ({ result }) => {
							isProcessing = false
							if (result.type === 'success') {
								invalidate('app:admin-data')
							}
						}
					}}
				>
					<button
						type="submit"
						disabled={isProcessing || !data.levelData?.votingEnded || data.levelData?.resultsRevealed}
						class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold transition-all duration-300 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
					>
						🎲 Reveal Results
					</button>
				</form>

				<!-- Next Level -->
				<form
					method="POST"
					action="?/nextLevel"
					use:enhance={() => {
						isProcessing = true
						return async ({ result }) => {
							isProcessing = false
							if (result.type === 'success') {
								invalidate('app:admin-data')
								// Auto-start timer if toggle is enabled
								if (autoStartTimer) {
									setTimeout(async () => {
										try {
											const formData = new FormData()
											const response = await fetch('/admin?/startTimer', {
												method: 'POST',
												body: formData
											})
											if (response.ok) {
												invalidate('app:admin-data')
												// Auto-end voting after timer duration
												setTimeout(() => {
													endRef.requestSubmit()
												}, (data.levelData?.timerDuration || 10) * 1000)
											}
										} catch (error) {
											console.error('Failed to auto-start timer:', error)
										}
									}, 500) // Small delay to ensure level transition is complete
								}
							}
						}
					}}
				>
					<button
						type="submit"
						disabled={isProcessing || !data.levelData?.resultsRevealed}
						class="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-bold transition-all duration-300 hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
					>
						⬆️ Next Level
					</button>
				</form>

				<!-- Reset Game -->
				<form
					method="POST"
					action="?/resetGame"
					use:enhance={() => {
						isProcessing = true
						return async ({ result }) => {
							isProcessing = false
							if (result.type === 'success') {
								invalidate('app:admin-data')
							}
						}
					}}
				>
					<button
						type="submit"
						disabled={isProcessing}
						class="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-bold transition-all duration-300 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
						onclick={(e) => {
							if (!confirm('Are you sure you want to reset the entire game? This will bring back all eliminated players.')) {
								e.preventDefault()
							}
						}}
					>
						🔄 Reset Game
					</button>
				</form>
			</div>

			<!-- Timer Controls -->
			<div class="mb-6 rounded-lg border border-blue-500/20 bg-blue-900/20 p-6 backdrop-blur-sm">
				<h4 class="mb-4 text-lg font-bold text-blue-400">⏱️ Timer Controls</h4>
				
				<!-- Auto Start Timer Toggle -->
				<div class="mb-4 rounded-lg border border-purple-500/30 bg-purple-900/20 p-4">
					<label class="flex items-center gap-3 cursor-pointer">
						<input 
							type="checkbox" 
							bind:checked={autoStartTimer}
							class="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
						>
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-purple-300">🚀 Auto-start timer on Next Level</span>
							<span class="text-xs text-purple-400">({data.levelData?.timerDuration || 10}s)</span>
						</div>
					</label>
					<p class="text-xs text-purple-400 mt-1 ml-7">
						When enabled, timer will automatically start when advancing to next level
					</p>
				</div>

				<div class="grid gap-4 md:grid-cols-3">
					<!-- Start Timer -->
					<form
						method="POST"
						action="?/startTimer"
						use:enhance={() => {
							setTimeout(() => {
									endRef.requestSubmit()
							}, 10000)
							isProcessing = true
							return async ({ result }) => {
								isProcessing = false
								if (result.type === 'success') {
									invalidate('app:admin-data')
								}
							}
						}}
					>
						<button
							type="submit"
							disabled={isProcessing || data.levelData?.timerActive || data.levelData?.votingEnded}
							class="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-bold transition-all duration-300 hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
						>
							▶️ Start Timer
						</button>
					</form>

					<!-- Stop Timer -->
					<form
						method="POST"
						action="?/stopTimer"
						use:enhance={() => {
							isProcessing = true
							return async ({ result }) => {
								isProcessing = false
								if (result.type === 'success') {
									invalidate('app:admin-data')
								}
							}
						}}
					>
						<button
							type="submit"
							disabled={isProcessing || !data.levelData?.timerActive}
							class="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-bold transition-all duration-300 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
						>
							⏹️ Stop Timer
						</button>
					</form>

					<!-- Timer Status -->
					<div class="flex items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-bold {data.levelData?.timerActive ? 'border-green-500 bg-green-900/50 text-green-300' : 'border-gray-500 bg-gray-900/50 text-gray-300'}">
						{#if data.levelData?.timerActive}
							⏱️ Timer Active
						{:else}
							⏸️ Timer Inactive
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Vote Details -->
		<div class="rounded-lg border border-gray-500/20 bg-black/20 p-6 backdrop-blur-sm mb-8">
			<h3 class="mb-4 text-xl font-bold text-gray-300">📋 Vote Details - Level {data.currentLevel}</h3>
			{#if data.votes.length > 0}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-gray-600">
								<th class="pb-2 text-left">Player</th>
								<th class="pb-2 text-left">Email</th>
								<th class="pb-2 text-left">Vote</th>
								<th class="pb-2 text-left">Time</th>
							</tr>
						</thead>
						<tbody>
							{#each data.votes as vote}
								<tr class="border-b border-gray-700/50">
									<td class="py-2">{vote.userName}</td>
									<td class="py-2 text-gray-400">{vote.userEmail}</td>
									<td class="py-2">
										<span class="inline-flex items-center gap-1 rounded px-2 py-1 text-xs {vote.answer === 'alive' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}">
											{vote.answer === 'alive' ? '🐱' : '💀'}
											{vote.answer}
										</span>
									</td>
									<td class="py-2 text-gray-400">
										{new Date(vote.timestamp).toLocaleTimeString()}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="py-8 text-center text-gray-400">
					No votes recorded for this level yet.
				</div>
			{/if}
		</div>

		<!-- Eliminated Players -->
		<div class="rounded-lg border border-red-500/20 bg-black/20 p-6 backdrop-blur-sm">
			<h3 class="mb-4 text-xl font-bold text-red-300">💀 Eliminated Players ({data.eliminatedCount})</h3>
			{#if data.eliminatedPlayers && data.eliminatedPlayers.length > 0}
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.eliminatedPlayers as player}
						<div class="rounded-lg border border-red-600/30 bg-red-900/20 p-4">
							<div class="flex items-center gap-3">
								<div class="text-2xl">👻</div>
								<div class="flex-1">
									<div class="font-medium text-red-200">{player.name}</div>
									<div class="text-xs text-red-400">{player.email}</div>
									<div class="text-xs text-gray-500 mt-1">
										Eliminated at Level {player.level}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-600/30">
					<div class="flex items-center justify-center gap-2 text-sm text-red-300">
						<span>⚰️</span>
						<span>These players' quantum states have collapsed and can no longer participate</span>
						<span>🌌</span>
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-gray-400">
					<div class="text-4xl mb-2">🎉</div>
					<p>No players eliminated yet!</p>
					<p class="text-sm mt-1">All participants are still in the quantum superposition.</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Loading animation for buttons */
	button:disabled {
		position: relative;
	}
	
	button:disabled::after {
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		margin: auto;
		border: 2px solid transparent;
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	@keyframes spin {
		0% { transform: translate(-50%, -50%) rotate(0deg); }
		100% { transform: translate(-50%, -50%) rotate(360deg); }
	}
</style>
