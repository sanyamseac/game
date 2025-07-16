<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation'
	import { onMount, onDestroy } from 'svelte'

	let { data } = $props()

	let refreshInterval: ReturnType<typeof setInterval>
	let quantumParticles: Array<{ x: number; y: number; vx: number; vy: number }> = []

	onMount(() => {
		// Initialize quantum particles for visual effect
		for (let i = 0; i < 30; i++) {
			quantumParticles.push({
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				vx: (Math.random() - 0.5) * 1,
				vy: (Math.random() - 0.5) * 1,
			})
		}
		animateParticles()

		// Auto-refresh every 3 seconds to check if game started
		refreshInterval = setInterval(() => {
			invalidateAll()
		}, 500)
	})

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval)
		}
	})

	function animateParticles() {
		quantumParticles = quantumParticles.map((particle) => ({
			...particle,
			x: (particle.x + particle.vx + window.innerWidth) % window.innerWidth,
			y: (particle.y + particle.vy + window.innerHeight) % window.innerHeight,
		}))

		requestAnimationFrame(animateParticles)
	}
</script>

<svelte:head>
	<title>ISAQC Quantum Cat Game - Waiting Lobby</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
	<!-- Quantum Particles Background -->
	{#each quantumParticles as particle}
		<div
			class="absolute h-1 w-1 rounded-full bg-cyan-400/30 animate-pulse"
			style="left: {particle.x}px; top: {particle.y}px;"
		></div>
	{/each}

	<!-- Navigation Bar -->
	<nav class="border-b border-cyan-500/20 bg-black/20 backdrop-blur-sm relative z-10">
		<div class="container mx-auto flex items-center justify-between px-4 py-4">
			<div class="flex items-center gap-4">
				<a href="/" class="text-cyan-400 transition-colors hover:text-cyan-300">
					🏠 Home
				</a>
				<span class="text-gray-500">|</span>
				<span class="text-gray-300">Quantum Lobby</span>
			</div>
		</div>
	</nav>

	<div class="container mx-auto px-4 py-8 relative z-10">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h1
				class="mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-6xl font-bold text-transparent"
			>
				⚛️ ISAQC Quantum Cat Challenge
			</h1>
			<p class="text-2xl text-gray-300 mb-2">
				IIIT Society for Applied Quantum Computing
			</p>
		</div>

		<!-- Waiting Status -->
		<div class="mb-12 text-center">
			<div class="mx-auto max-w-2xl rounded-xl border-2 border-cyan-500/30 bg-black/40 p-8 backdrop-blur-sm">
				<div class="mb-6">
					<div class="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center animate-pulse">
						<span class="text-4xl">⏳</span>
					</div>
					<h2 class="text-3xl font-bold text-cyan-400 mb-2">Pre-Game Lobby</h2>
					<p class="text-lg text-gray-300">
						Welcome to the quantum chamber! The game administrator will start the tournament soon.
					</p>
				</div>

				<!-- Registration Status -->
				<div class="mb-6 rounded-lg border p-4 {data.allowRegistration ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20'}">
					<div class="flex items-center justify-center gap-2">
						{#if data.allowRegistration}
							<span class="text-green-400 text-xl">✅</span>
							<span class="text-green-300 font-medium">Registration is OPEN</span>
						{:else}
							<span class="text-red-400 text-xl">🚫</span>
							<span class="text-red-300 font-medium">Registration is CLOSED</span>
						{/if}
					</div>
					{#if data.allowRegistration}
						<p class="text-green-200 text-sm mt-2">
							New players can still join the game using the "Join Game" button above.
						</p>
					{:else}
						<p class="text-red-200 text-sm mt-2">
							No new players can join. The tournament will begin shortly.
						</p>
					{/if}
				</div>

				<!-- Auto-refresh indicator -->
				<div class="flex items-center justify-center gap-2 text-sm text-gray-400">
					<div class="h-2 w-2 animate-ping rounded-full bg-cyan-400"></div>
					<span>Waiting for game to start... (Auto-refreshing)</span>
				</div>
			</div>
		</div>

		<!-- Game Rules Preview -->
		<div class="mx-auto max-w-4xl">
			<div class="rounded-xl border border-indigo-500/20 bg-indigo-900/20 p-8 backdrop-blur-sm">
				<h3 class="mb-6 text-center text-2xl font-bold text-indigo-400">🧪 How the Quantum Game Works</h3>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<span class="text-2xl">1️⃣</span>
							<div>
								<h4 class="font-bold text-white mb-1">Quantum Vote</h4>
								<p class="text-sm text-gray-300">Each round, vote whether Schrödinger's cat is alive or dead</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-2xl">2️⃣</span>
							<div>
								<h4 class="font-bold text-white mb-1">Random Measurement</h4>
								<p class="text-sm text-gray-300">Admin randomly determines reality (50/50 quantum chance)</p>
							</div>
						</div>
					</div>
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<span class="text-2xl">3️⃣</span>
							<div>
								<h4 class="font-bold text-white mb-1">Quantum Elimination</h4>
								<p class="text-sm text-gray-300">Wrong predictions cause quantum decoherence (elimination)</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-2xl">4️⃣</span>
							<div>
								<h4 class="font-bold text-white mb-1">Quantum Survivor</h4>
								<p class="text-sm text-gray-300">Last player standing wins the ISAQC Championship!</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Timer Warning -->
				<div class="mt-6 rounded-lg border border-yellow-500/50 bg-yellow-900/20 p-4">
					<div class="flex items-center gap-2 text-yellow-300">
						<span class="text-xl">⏰</span>
						<span class="font-medium">Game Rules:</span>
					</div>
					<ul class="mt-2 space-y-1 text-sm text-yellow-200">
						<li>• Each level has a 10-second timer for voting</li>
						<li>• Random answer selected if timer expires</li>
						<li>• All players vote simultaneously in the same quantum chamber</li>
						<li>• Game continues until only one quantum survivor remains</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-12 text-center">
			<p class="text-gray-400 text-sm">
				🔬 Based on Schrödinger's famous quantum mechanics thought experiment
			</p>
		</div>
	</div>
</div>

<style>
	@keyframes quantum-float {
		0%, 100% {
			transform: translateY(0px) rotate(0deg);
		}
		50% {
			transform: translateY(-10px) rotate(180deg);
		}
	}

	.animate-quantum-float {
		animation: quantum-float 4s ease-in-out infinite;
	}
</style>
