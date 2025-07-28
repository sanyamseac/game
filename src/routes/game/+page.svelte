<script lang="ts">
	import type { PageData, ActionData } from "./$types"
	import { enhance } from '$app/forms'
	import { invalidateAll } from "$app/navigation"
	import { onMount } from "svelte"

	let { data, form } : {data : PageData, form : ActionData} = $props()
	onMount(() => {
		setInterval(() => {
			invalidateAll()
		}, 1000)
	})
</script>

<svelte:head>
	<title>Is Meow Gone?</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
	<div class="container mx-auto px-4 py-16">
		<div class="text-center mb-12">
			<img src="/favicon.png" alt="Is Meow Gone?" class="mx-auto mb-4 h-20" />
			<h1 class="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
				Is Meow Gone?
			</h1>
			<p class="text-xl text-gray-300">
				IIIT Society for Applied Quantum Computing
			</p>
            {#if data.userPoints !== undefined}
                <p class="text-lg text-gray-400 mt-2">Your Score: <span class="font-bold text-yellow-300">{data.userPoints}</span></p>
            {/if}
		</div>

		<div class="max-w-2xl mx-auto">
			{#if data.level === null}
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-500/20 p-8 text-center">
					<div class="text-6xl mb-4">⏳</div>
					<h2 class="text-2xl font-bold text-gray-400 mb-4">Waiting for Game to Start</h2>
					<p class="text-gray-300">
						No levels are currently available. Please wait for the admin to start the game.
					</p>
				</div>
			{:else}
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
					<div class="text-center mb-8">
						<h2 class="text-3xl font-bold text-cyan-400 mb-2">
							Level {data.level}
						</h2>
						<div class="text-6xl mb-4">📦</div>
						<p class="text-xl text-gray-300 mb-2">
							Is Schrödinger's cat alive or dead?
						</p>
						<p class="text-sm text-gray-400">
							Make your quantum observation...
						</p>
					</div>

					{#if data.hasVoted}
						<div class="text-center">
							<div class="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-4">
								<div class="text-4xl mb-2">✅</div>
								<h3 class="text-xl font-bold text-green-400 mb-2">Vote Recorded</h3>
								<p class="text-green-200">
									You have already cast your vote for Level {data.level}
								</p>
							</div>
							<p class="text-gray-400 text-sm">
								Waiting for other players and admin decision...
							</p>
						</div>
					{:else if !data.levelActive}
						<div class="text-center">
							<div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
								<div class="text-4xl mb-2">🔒</div>
								<h3 class="text-xl font-bold text-red-400 mb-2">Voting Closed</h3>
								<p class="text-red-200">
									Voting has been closed for Level {data.level}
								</p>
							</div>
						</div>
					{:else}
						<form method="POST" action="?/vote" use:enhance class="space-y-6">
							<div class="text-center">
								<p class="text-lg text-gray-300 mb-6">
									Cast your vote:
								</p>
							</div>

							<div class="grid gap-4">
								<label class="block">
									<input 
										type="radio" 
										name="answer" 
										value="1" 
										required
										class="sr-only peer"
									>
									<div class="p-6 bg-green-900/20 border-2 border-green-500/30 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-green-400 peer-checked:bg-green-900/40 hover:border-green-400/60">
										<div class="text-center">
											<div 
class="text-4xl mb-2">😺</div>
											<div class="text-xl font-bold text-green-400">Cat is ALIVE</div>
											<div class="text-sm text-gray-300">The quantum state collapsed to life</div>
										</div>
									</div>
								</label>

								<label class="block">
									<input 
										type="radio" 
										name="answer" 
										value="0" 
										required
										class="sr-only peer"
									>
									<div class="p-6 bg-red-900/20 border-2 border-red-500/30 rounded-lg cursor-pointer transition-all duration-300 peer-checked:border-red-400 peer-checked:bg-red-900/40 hover:border-red-400/60">
										<div class="text-center">
											<div class="text-4xl mb-2">💀</div>
											<div class="text-xl font-bold text-red-400">Cat is DEAD</div>
											<div class="text-sm text-gray-300">The quantum state collapsed to death</div>
										</div>
									</div>
								</label>
							</div>

							<div class="text-center">
								<button 
									type="submit"
									class="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:from-cyan-500 hover:to-purple-500"
								>
									🔬 Make Observation
								</button>
							</div>
						</form>
					{/if}
				</div>
			{/if}

			{#if form?.message}
				<div class="mt-6 p-4 rounded-lg text-center {form.success ?
'bg-green-900/20 border border-green-500/30 text-green-200' : 'bg-red-900/20 border border-red-500/30 text-red-200'}">
					{form.message}
				</div>
			{/if}
		</div>
	</div>
</div>