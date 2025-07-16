<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { invalidate } from '$app/navigation'

	let { data } = $props()
	let refreshInterval: ReturnType<typeof setInterval>

	onMount(() => {
		// Auto-refresh every 3 seconds
		refreshInterval = setInterval(() => {
			invalidate('app:eliminated-data')
		}, 3000)
	})

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval)
		}
	})
</script>

<svelte:head>
	<title>Eliminated - ISAQC Quantum Challenge</title>
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
				<span class="text-gray-300">Quantum Observer</span>
			</div>
			<div class="flex items-center gap-4">
				<a
					href="/display"
					class="rounded bg-green-700 px-3 py-1 text-sm transition-colors hover:bg-green-600"
				>
					📊 Live Display
				</a>
			</div>
		</div>
	</nav>

	<div class="container mx-auto px-4 py-16">
		<!-- Header -->
		<div class="text-center mb-12">
			<div class="text-8xl mb-6">👻</div>
			<h1 class="text-5xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent mb-4">
				Quantum Decoherence
			</h1>
			<p class="text-2xl text-gray-300 mb-2">
				Your quantum state has collapsed
			</p>
			<div class="inline-flex items-center gap-2 rounded-full bg-red-900/50 border border-red-500/30 px-6 py-2">
				<span class="text-red-300">💀</span>
				<span class="text-sm font-medium text-red-200">Eliminated at Level {data.user.level}</span>
			</div>
		</div>

		<!-- Elimination Details -->
		<div class="max-w-2xl mx-auto mb-12">
			<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-red-500/20 p-8">
				<h2 class="text-2xl font-bold text-red-300 mb-6 text-center">
					🌌 What Happened?
				</h2>
				<div class="space-y-4 text-gray-300">
					<p class="text-center leading-relaxed">
						In the quantum realm, not all measurements lead to survival. Your prediction 
						of the cat's state didn't align with the quantum measurement result, causing 
						your quantum state to decohere and collapse.
					</p>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
						<div class="text-center p-4 bg-gray-800/50 rounded-lg">
							<div class="text-3xl mb-2">🧬</div>
							<div class="font-bold text-white">Your Reality</div>
							<div class="text-sm text-gray-400">The path you chose</div>
						</div>
						<div class="text-center p-4 bg-gray-800/50 rounded-lg">
							<div class="text-3xl mb-2">⚛️</div>
							<div class="font-bold text-white">Quantum Reality</div>
							<div class="text-sm text-gray-400">What actually occurred</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Current Game Status -->
		<div class="max-w-4xl mx-auto">
			<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
				<h2 class="text-2xl font-bold text-cyan-400 mb-6 text-center">
					🎮 Current Tournament Status
				</h2>
				<div class="grid gap-6 md:grid-cols-3">
					<!-- Current Level -->
					<div class="text-center p-6 bg-blue-900/30 rounded-lg border border-blue-500/30">
						<div class="text-4xl mb-2">📊</div>
						<div class="text-3xl font-bold text-blue-300">{data.currentLevel}</div>
						<div class="text-sm text-gray-300">Current Level</div>
					</div>

					<!-- Survivors -->
					<div class="text-center p-6 bg-green-900/30 rounded-lg border border-green-500/30">
						<div class="text-4xl mb-2">🐱</div>
						<div class="text-3xl font-bold text-green-300">{data.activePlayersCount}</div>
						<div class="text-sm text-gray-300">Survivors Remaining</div>
					</div>

					<!-- Eliminated -->
					<div class="text-center p-6 bg-red-900/30 rounded-lg border border-red-500/30">
						<div class="text-4xl mb-2">💀</div>
						<div class="text-3xl font-bold text-red-300">{data.eliminatedPlayersCount}</div>
						<div class="text-sm text-gray-300">Players Eliminated</div>
					</div>
				</div>

				{#if data.winner}
					<div class="mt-8 p-6 bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border border-yellow-500/30 rounded-lg text-center">
						<div class="text-5xl mb-3">🏆</div>
						<h3 class="text-2xl font-bold text-yellow-300 mb-2">Tournament Complete!</h3>
						<p class="text-xl text-yellow-200">
							<strong>{data.winner.name}</strong> has achieved quantum mastery!
						</p>
					</div>
				{:else if data.activePlayersCount === 1}
					<div class="mt-8 p-6 bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/30 rounded-lg text-center">
						<div class="text-5xl mb-3">⚡</div>
						<h3 class="text-2xl font-bold text-orange-300 mb-2">Final Round!</h3>
						<p class="text-lg text-orange-200">
							Only one quantum state remains - the final measurement approaches!
						</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Observer Mode -->
		<div class="max-w-2xl mx-auto mt-12">
			<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 text-center">
				<h3 class="text-xl font-bold text-purple-400 mb-4">
					🔬 Quantum Observer Mode
				</h3>
				<p class="text-gray-300 mb-6">
					Though your quantum state has collapsed, you can continue to observe 
					the ongoing tournament and witness the remaining players' journey 
					through the quantum realm.
				</p>
				<div class="space-y-4">
					<a
						href="/display"
						class="inline-block w-full rounded-lg bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3 font-bold text-white transition-all duration-300 hover:scale-105"
					>
						📊 Watch Live Tournament
					</a>
					<p class="text-xs text-gray-400">
						Follow the remaining players as they navigate the quantum challenges
					</p>
				</div>
			</div>
		</div>

		<!-- ISAQC Footer -->
		<div class="text-center mt-16">
			<div class="inline-flex items-center gap-2 rounded-full bg-purple-900/50 border border-purple-500/30 px-6 py-3">
				<span class="text-purple-300">🏛️</span>
				<span class="text-sm font-medium text-purple-200">IIIT Society for Applied Quantum Computing</span>
			</div>
			<p class="text-xs text-gray-500 mt-2">
				Thank you for participating in the quantum challenge!
			</p>
		</div>
	</div>
</div>
