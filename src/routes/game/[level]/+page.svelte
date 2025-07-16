<script lang="ts">
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	import { onMount, onDestroy } from 'svelte'
	import { invalidate } from '$app/navigation'

	let { data, form } = $props()

	let selectedAnswer = $state('')
	let isSubmitting = $state(false)
	let showQuantumEffect = $state(false)
	let catState = $state('unknown') // 'unknown', 'alive', 'dead'
	let quantumParticles: Array<{ x: number; y: number; vx: number; vy: number }> = []
	let formRef: HTMLFormElement
	let gameDataInterval: ReturnType<typeof setInterval>
	let voteStats = $state({ alive: 0, dead: 0, total: 0 })

	let level = $derived(parseInt($page.params.level))
	let hasVoted = $derived(data.hasVoted)
	let userVote = $derived(data.userVote)
	let levelData = $derived(data.levelData)
	let gameDetails = $derived(data.gameDetails)

	onMount(() => {
		for (let i = 0; i < 20; i++) {
			quantumParticles.push({
				x: Math.random() * 400,
				y: Math.random() * 300,
				vx: (Math.random() - 0.5) * 2,
				vy: (Math.random() - 0.5) * 2,
			})
		}
		animateParticles()

		// Set up auto-refresh for game data
		gameDataInterval = setInterval(() => {
			invalidate('app:game-data')
		}, 2000)

		// Set initial state based on data
		if (hasVoted) {
			selectedAnswer = userVote || ''
		}

		if (levelData?.resultsRevealed && levelData?.correct) {
			catState = levelData.correct
		}

		// Fetch vote statistics
		fetchVoteStats()
	})

	onDestroy(() => {
		if (gameDataInterval) {
			clearInterval(gameDataInterval)
		}
	})

	async function fetchVoteStats() {
		try {
			const response = await fetch(`/api/votes/${level}`)
			if (response.ok) {
				voteStats = await response.json()
			}
		} catch (error) {
			console.error('Failed to fetch vote stats:', error)
		}
	}

	function animateParticles() {
		quantumParticles = quantumParticles.map((particle) => ({
			...particle,
			x: (particle.x + particle.vx + 400) % 400,
			y: (particle.y + particle.vy + 300) % 300,
		}))

		if (showQuantumEffect) {
			requestAnimationFrame(animateParticles)
		}
	}

	function handleAnswerSelect(answer: string) {
		if (!isSubmitting && !showQuantumEffect && !hasVoted) {
			console.log('Answer selected:', answer);
			selectedAnswer = answer
			showQuantumEffect = true
			animateParticles()

			setTimeout(() => {
				showQuantumEffect = false
				console.log('Quantum measurement complete, submitting form...');
				if (formRef) {
					console.log('Form ref found, requesting submit');
					formRef.requestSubmit()
				} else {
					console.error('Form ref not found');
				}
			}, 2000)
		} else {
			console.log('Button disabled - isSubmitting:', isSubmitting, 'showQuantumEffect:', showQuantumEffect, 'hasVoted:', hasVoted);
		}
	}

	function resetQuantumState() {
		catState = 'unknown'
		selectedAnswer = ''
		showQuantumEffect = false
	}

	// Auto-refresh vote stats
	$effect(() => {
		const interval = setInterval(fetchVoteStats, 500)
		return () => clearInterval(interval)
	})
</script>

<svelte:head>
	<title>Schrödinger's Cat - Level {level}</title>
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
				<span class="text-gray-300">Quantum Game</span>
			</div>
			<div class="flex items-center gap-4">
				<div class="text-sm text-gray-400">
					Current Level: <span class="font-bold text-cyan-400">{level}</span>
				</div>
				{#if level > 1}
					<a
						href="/game/{level - 1}"
						class="rounded bg-gray-700 px-3 py-1 text-sm transition-colors hover:bg-gray-600"
					>
						← Previous
					</a>
				{/if}
			</div>
		</div>
	</nav>

	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1
				class="mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent"
			>
				Schrödinger's Cat Paradox
			</h1>
			<p class="text-xl text-gray-300">Level {level}</p>
			<div class="mt-4 rounded-lg bg-black/30 p-4 backdrop-blur-sm">
				<p class="text-sm text-gray-300">
					In quantum mechanics, a cat in a box can be both alive and dead simultaneously
					until observed.
					<br />What is the state of the cat at this level?
				</p>
			</div>

			<!-- Error/Success Messages -->
			{#if form?.message}
				<div
					class="mt-4 rounded-lg p-4 {form.message.includes('success')
						? 'border border-green-500 bg-green-900/50 text-green-200'
						: 'border border-red-500 bg-red-900/50 text-red-200'}"
				>
					<div class="flex items-center justify-center gap-2">
						{#if form.message.includes('success')}
							<span class="text-xl">✅</span>
							<span>Vote recorded successfully!</span>
						{:else}
							<span class="text-xl">❌</span>
							<span>{form.message}</span>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Game Status -->
			{#if hasVoted}
				<div class="mt-4 rounded-lg border border-blue-500 bg-blue-900/50 p-4 text-blue-200">
					<div class="flex items-center justify-center gap-2">
						<span class="text-xl">🗳️</span>
						<span>You voted: {userVote === 'alive' ? '🐱 Alive' : '💀 Dead'}</span>
					</div>
					{#if !levelData?.votingEnded}
						<p class="mt-2 text-center text-xs">Waiting for other players...</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Quantum Box Visualization -->
		<div class="mb-8 flex justify-center">
			<div class="relative">
				<!-- The Box -->
				<div
					class="relative h-48 w-80 overflow-hidden rounded-lg border-2 border-cyan-400 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl sm:h-64 sm:w-96"
				>
					<!-- Quantum Effect Overlay -->
					{#if showQuantumEffect}
						<div
							class="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
						></div>
						<!-- Quantum Particles -->
						{#each quantumParticles as particle}
							<div
								class="absolute h-1 w-1 animate-pulse rounded-full bg-cyan-400"
								style="left: {Math.min(particle.x, 320)}px; top: {Math.min(
									particle.y,
									240,
								)}px;"
							></div>
						{/each}
						<!-- Scanning Lines Effect -->
						<div
							class="absolute inset-0 h-4 animate-pulse bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
							style="animation: scan 1s linear infinite;"
						></div>
					{/if}

					<!-- Cat State Display -->
					<div class="absolute inset-0 flex items-center justify-center">
						{#if levelData?.resultsRevealed && levelData?.correct}
							{#if levelData.correct === 'alive'}
								<div
									class="scale-110 transform text-center transition-transform duration-500"
								>
									<div class="mb-4 animate-pulse text-4xl sm:text-6xl">🐱</div>
									<p class="text-sm font-bold text-green-400 sm:text-base">
										Cat is Alive!
									</p>
									<p class="text-xs text-gray-400 sm:text-sm">Purring and happy</p>
									<div class="mt-2">
										<div
											class="mx-auto h-1 w-16 animate-pulse rounded-full bg-green-400"
										></div>
									</div>
								</div>
							{:else}
								<div
									class="scale-110 transform text-center transition-transform duration-500"
								>
									<div class="mb-4 text-4xl sm:text-6xl">�</div>
									<p class="text-sm font-bold text-red-400 sm:text-base">
										Cat is Dead
									</p>
									<p class="text-xs text-gray-400 sm:text-sm">
										The quantum state collapsed
									</p>
									<div class="mt-2">
										<div
											class="mx-auto h-1 w-16 rounded-full bg-red-400 opacity-50"
										></div>
									</div>
								</div>
							{/if}
						{:else}
							<div class="animate-quantum-float text-center">
								<div class="mb-4 animate-bounce text-4xl sm:text-6xl">❓</div>
								<p class="text-sm font-bold text-cyan-400 sm:text-base">
									{#if levelData?.votingEnded}
										Awaiting Results
									{:else}
										Quantum Superposition
									{/if}
								</p>
								<p class="text-xs text-gray-400 sm:text-sm">
									{#if levelData?.votingEnded}
										Calculating quantum state...
									{:else}
										Both alive and dead
									{/if}
								</p>
								<div class="mt-2 flex justify-center space-x-1">
									<div
										class="h-2 w-2 animate-ping rounded-full bg-cyan-400"
										style="animation-delay: 0s;"
									></div>
									<div
										class="h-2 w-2 animate-ping rounded-full bg-purple-400"
										style="animation-delay: 0.2s;"
									></div>
									<div
										class="h-2 w-2 animate-ping rounded-full bg-indigo-400"
										style="animation-delay: 0.4s;"
									></div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Quantum Measurement Indicator -->
					{#if showQuantumEffect}
						<div class="absolute top-2 right-2">
							<div class="h-3 w-3 animate-ping rounded-full bg-cyan-400"></div>
						</div>
						<div class="absolute top-2 left-2 animate-pulse text-xs text-cyan-400">
							MEASURING...
						</div>
					{/if}

					<!-- Energy Bars -->
					<div class="absolute right-2 bottom-2 left-2">
						<div class="flex justify-center space-x-1">
							{#each Array(5) as _, i}
								<div
									class="w-1 rounded-full bg-cyan-400 transition-all duration-300 {showQuantumEffect
										? 'h-4 animate-pulse'
										: 'h-2'}"
									style="animation-delay: {i * 0.1}s;"
								></div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Box Label -->
				<div class="absolute -bottom-8 left-1/2 -translate-x-1/2 transform">
					<p class="text-center text-xs text-gray-400 sm:text-sm">
						Quantum Isolation Chamber
					</p>
				</div>
			</div>
		</div>

		<!-- Prediction Interface -->
		<div class="mx-auto max-w-md">
			{#if !levelData?.votingEnded}
				<form
					bind:this={formRef}
					method="POST"
					use:enhance={() => {
						isSubmitting = true
						return async ({ result }) => {
							isSubmitting = false
							if (result.type === 'success') {
								await invalidate('app:game-data')
								fetchVoteStats()
							} else {
								resetQuantumState()
							}
						}
					}}
					class="space-y-6"
				>
					<input type="hidden" name="answer" value={selectedAnswer} />
					
					<div class="mb-6 text-center">
						<h2 class="mb-2 text-2xl font-bold text-cyan-400">
							{hasVoted ? 'Your Vote' : 'Cast Your Vote'}
						</h2>
						<p class="text-gray-400">
							{hasVoted ? 'Waiting for other players...' : 'Choose the cat\'s quantum state'}
						</p>
					</div>

					<!-- Answer Buttons -->
					{#if !hasVoted}
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<button
								type="button"
								on:click={() => handleAnswerSelect('alive')}
								disabled={isSubmitting || hasVoted}
								class="group relative transform rounded-lg border-2 bg-gradient-to-br from-green-600 to-green-700 p-4 transition-all duration-300 hover:scale-105 hover:from-green-500 hover:to-green-600 disabled:cursor-not-allowed disabled:opacity-50 sm:p-6
									{selectedAnswer === 'alive'
									? 'glow-green border-green-400 shadow-lg shadow-green-400/25'
									: 'border-green-600'}"
							>
								<div class="mb-2 text-3xl sm:text-4xl">🐱</div>
								<div class="text-sm font-bold text-white sm:text-base">ALIVE</div>
								<div class="text-xs text-green-200 sm:text-sm">The cat survives</div>
								{#if selectedAnswer === 'alive'}
									<div
										class="absolute inset-0 animate-pulse rounded-lg bg-green-400/20"
									></div>
								{/if}
								{#if showQuantumEffect}
									<div class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
										<div class="text-cyan-400 text-xs">MEASURING...</div>
									</div>
								{/if}
								<div
									class="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<div class="h-2 w-2 animate-ping rounded-full bg-green-300"></div>
								</div>
							</button>

							<button
								type="button"
								on:click={() => handleAnswerSelect('dead')}
								disabled={isSubmitting || hasVoted}
								class="group relative transform rounded-lg border-2 bg-gradient-to-br from-red-600 to-red-700 p-4 transition-all duration-300 hover:scale-105 hover:from-red-500 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:p-6
									{selectedAnswer === 'dead'
									? 'glow-red border-red-400 shadow-lg shadow-red-400/25'
									: 'border-red-600'}"
							>
								<div class="mb-2 text-3xl sm:text-4xl">💀</div>
								<div class="text-sm font-bold text-white sm:text-base">DEAD</div>
								<div class="text-xs text-red-200 sm:text-sm">The cat has died</div>
								{#if selectedAnswer === 'dead'}
									<div
										class="absolute inset-0 animate-pulse rounded-lg bg-red-400/20"
									></div>
								{/if}
								{#if showQuantumEffect}
									<div class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
										<div class="text-cyan-400 text-xs">MEASURING...</div>
									</div>
								{/if}
								<div
									class="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<div class="h-2 w-2 animate-ping rounded-full bg-red-300"></div>
								</div>
							</button>
						</div>
					{:else}
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div class="relative rounded-lg border-2 p-4 sm:p-6 {userVote === 'alive' ? 'border-green-400 bg-green-900/50' : 'border-gray-600 bg-gray-800/50'}">
								<div class="mb-2 text-3xl sm:text-4xl">🐱</div>
								<div class="text-sm font-bold text-white sm:text-base">ALIVE</div>
								<div class="text-xs text-green-200 sm:text-sm">The cat survives</div>
								{#if userVote === 'alive'}
									<div class="absolute top-2 right-2">
										<span class="text-green-400 text-xl">✓</span>
									</div>
								{/if}
							</div>
							<div class="relative rounded-lg border-2 p-4 sm:p-6 {userVote === 'dead' ? 'border-red-400 bg-red-900/50' : 'border-gray-600 bg-gray-800/50'}">
								<div class="mb-2 text-3xl sm:text-4xl">💀</div>
								<div class="text-sm font-bold text-white sm:text-base">DEAD</div>
								<div class="text-xs text-red-200 sm:text-sm">The cat has died</div>
								{#if userVote === 'dead'}
									<div class="absolute top-2 right-2">
										<span class="text-red-400 text-xl">✓</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Submitting Status -->
					{#if isSubmitting}
						<div class="flex items-center justify-center gap-2 rounded-lg bg-purple-900/50 py-4">
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-purple-400 border-t-transparent"
							></div>
							<span class="text-purple-300">Recording Your Vote...</span>
						</div>
					{/if}
				</form>
			{:else}
				<div class="text-center">
					<h2 class="mb-4 text-2xl font-bold text-cyan-400">Voting Completed</h2>
					{#if levelData?.resultsRevealed}
						<div class="rounded-lg border border-cyan-500/20 bg-black/20 p-6 backdrop-blur-sm">
							<p class="text-lg text-gray-300">
								The quantum state has been determined: <strong class="text-cyan-400">{levelData.correct}</strong>
							</p>
							{#if userVote === levelData.correct}
								<div class="mt-4 text-green-400">
									🎉 You chose correctly and advance to the next round!
								</div>
							{:else}
								<div class="mt-4 text-red-400">
									💥 You chose incorrectly and have been eliminated.
								</div>
							{/if}
						</div>
					{:else}
						<div class="rounded-lg border border-yellow-500/20 bg-yellow-900/20 p-6 backdrop-blur-sm">
							<p class="text-yellow-300">
								The admin is calculating the quantum results...
							</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Quantum Mechanics Info -->
		<div class="mx-auto mt-12 max-w-2xl">
			<div class="rounded-lg border border-cyan-500/20 bg-black/20 p-6 backdrop-blur-sm">
				<h3 class="mb-3 text-lg font-bold text-cyan-400">🧪 Quantum Mechanics Principle</h3>
				<p class="text-sm leading-relaxed text-gray-300">
					In Schrödinger's famous thought experiment, a cat in a sealed box is both alive
					and dead simultaneously until someone opens the box to observe it. This
					demonstrates the quantum superposition principle, where particles can exist in
					multiple states until measured.
				</p>
				<div class="mt-4 flex items-center gap-2 text-xs text-gray-400">
					<span>⚛️</span>
					<span>Level {level}: Each level represents a different quantum scenario</span>
				</div>
			</div>
		</div>

		<!-- Game Instructions -->
		<div class="mx-auto mt-6 max-w-md">
			<div
				class="rounded-lg border border-indigo-500/20 bg-indigo-900/30 p-4 backdrop-blur-sm"
			>
				<h4 class="mb-2 text-sm font-bold text-indigo-400">📋 How to Play</h4>
				<ul class="space-y-1 text-xs text-gray-300">
					<li>• Vote whether you think the cat is alive or dead</li>
					<li>• Wait for all players to submit their votes</li>
					<li>• The admin will randomly determine the correct answer</li>
					<li>• Wrong votes eliminate you from the game</li>
					<li>• Last player standing wins!</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes quantum-float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes scan {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(400%);
		}
	}

	.animate-quantum-float {
		animation: quantum-float 3s ease-in-out infinite;
	}

	/* Custom glow effects */
	.glow-cyan {
		box-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
	}

	.glow-green {
		box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
	}

	.glow-red {
		box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
	}

	/* Quantum particle trail effect */
	@keyframes particle-trail {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(0.3);
		}
	}
</style>
