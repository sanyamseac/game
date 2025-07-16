<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import type { ActionData } from './$types'

	let { data }: { form: ActionData, data: any } = $props()
	let isSubmitting = $state(false)
	let form = $state({
		message: ''
	})
</script>

<svelte:head>
	<title>Login - ISAQC Quantum Cat Challenge</title>
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
				<span class="text-gray-300">Login</span>
			</div>
		</div>
	</nav>

	<div class="container mx-auto px-4 py-16">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
				⚛️ Join the Quantum Challenge
			</h1>
			<p class="text-xl text-gray-300 mb-2">
				IIIT Society for Applied Quantum Computing
			</p>
			<p class="text-lg text-gray-400">
				Enter the quantum realm and test your intuition
			</p>
		</div>

		<!-- Login Form -->
		<div class="max-w-md mx-auto">
			<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
				<h2 class="text-2xl font-bold text-cyan-400 mb-6 text-center">
					🚀 Join the Challenge
				</h2>
				
				<!-- Registration Status -->
				{#if !data.allowRegistration}
					<div class="mb-6 rounded-lg border border-red-500/50 bg-red-900/20 p-4">
						<div class="flex items-center justify-center gap-2 text-red-300">
							<span class="text-xl">🚫</span>
							<span class="font-medium">Registration Closed</span>
						</div>
						<p class="text-red-200 text-sm mt-2 text-center">
							The game has already started. New players cannot join at this time.
						</p>
						<div class="mt-4 text-center">
							<a href="/" class="text-cyan-400 hover:text-cyan-300 text-sm underline">
								← Return to Home
							</a>
						</div>
					</div>
				{:else}
					<div class="mb-6 rounded-lg border border-green-500/50 bg-green-900/20 p-4">
						<div class="flex items-center justify-center gap-2 text-green-300">
							<span class="text-xl">✅</span>
							<span class="font-medium">Registration Open</span>
						</div>
						<p class="text-green-200 text-sm mt-2 text-center">
							Enter your details to join the quantum challenge!
						</p>
					</div>
				{/if}
				
				<form 
					method="post" 
					action="?/login" 
					use:enhance={() => {
						if (!data.allowRegistration) return
						isSubmitting = true
						return async ({ result }) => {
							if (result.type === 'success') {
								goto(`/game/${data.currentLevel}`)
							} else {
								form.message = result.type === 'error' ? result.error : 'An error occurred. Please try again.'
							}
							isSubmitting = false
						}
					}}
					class="space-y-6"
					class:opacity-50={!data.allowRegistration}
				>
					<fieldset disabled={!data.allowRegistration}>
						<div>
							<label for="name" class="block text-sm font-medium text-gray-300 mb-2">
								👤 Your Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								disabled={isSubmitting || !data.allowRegistration}
								class="w-full rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
								placeholder="Enter your full name"
							/>
						</div>

						<div>
							<label for="email" class="block text-sm font-medium text-gray-300 mb-2">
								📧 Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								disabled={isSubmitting || !data.allowRegistration}
								class="w-full rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
								placeholder="your.email@example.com"
							/>
						</div>

						<button 
							type="submit"
							disabled={isSubmitting || !data.allowRegistration}
							class="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:from-cyan-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
						>
							{#if isSubmitting}
								<div class="flex items-center justify-center gap-2">
									<div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									Entering Quantum Realm...
								</div>
							{:else if !data.allowRegistration}
								🔒 Registration Closed
							{:else}
								🌌 Enter the Game
							{/if}
						</button>
					</fieldset>
				</form>

				<!-- Error Message -->
				{#if form?.message}
					<div class="mt-6 rounded-lg border border-red-500 bg-red-900/50 p-4 text-center">
						<div class="flex items-center justify-center gap-2">
							<span class="text-xl">❌</span>
							<span class="text-red-200">{form.message}</span>
						</div>
					</div>
				{/if}

				<!-- Info Box -->
				<div class="mt-8 rounded-lg border border-indigo-500/20 bg-indigo-900/30 p-4">
					<h3 class="text-sm font-bold text-indigo-400 mb-2">🧪 About This Challenge</h3>
					<p class="text-xs text-gray-300 leading-relaxed">
						Experience quantum mechanics through Schrödinger's famous thought experiment. 
						Vote on the cat's state, survive the eliminations, and prove your quantum intuition!
					</p>
				</div>
			</div>
		</div>

		<!-- Features Preview -->
		<div class="max-w-3xl mx-auto mt-16">
			<div class="grid gap-6 md:grid-cols-3">
				<div class="text-center">
					<div class="text-4xl mb-2">🎲</div>
					<h3 class="font-bold text-white mb-1">Quantum Randomness</h3>
					<p class="text-sm text-gray-400">True 50/50 probability decisions</p>
				</div>
				<div class="text-center">
					<div class="text-4xl mb-2">⚡</div>
					<h3 class="font-bold text-white mb-1">Fast-Paced Action</h3>
					<p class="text-sm text-gray-400">10-second rounds keep you engaged</p>
				</div>
				<div class="text-center">
					<div class="text-4xl mb-2">🏆</div>
					<h3 class="font-bold text-white mb-1">Last One Standing</h3>
					<p class="text-sm text-gray-400">Elimination-style tournament</p>
				</div>
			</div>
		</div>
	</div>
</div>
