<script lang="ts">
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>Error - Quantum Cat Game</title>
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
				<span class="text-gray-300">Error</span>
			</div>
		</div>
	</nav>

	<div class="container mx-auto px-4 py-16">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
				⚠️ Quantum Decoherence Detected
			</h1>
			<p class="text-xl text-gray-300 mb-2">
				IIIT Society for Applied Quantum Computing
			</p>
		</div>

		<!-- Error Display -->
		<div class="max-w-2xl mx-auto">
			<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-red-500/20 p-8 text-center">
				<div class="text-8xl mb-6">🙀</div>
				
				<h2 class="text-3xl font-bold text-red-400 mb-4">
					Error {$page.status}
				</h2>
				
				<div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
					<p class="text-lg text-red-200 mb-2">
						{$page.error?.message || 'Something went wrong in the quantum realm'}
					</p>
					<p class="text-sm text-gray-400">
						The quantum state has collapsed unexpectedly
					</p>
				</div>

				<!-- Common Error Messages -->
				{#if $page.status === 404}
					<div class="mb-6">
						<p class="text-gray-300 mb-4">
							🔍 The page you're looking for doesn't exist in this quantum dimension
						</p>
						<p class="text-sm text-gray-400">
							Perhaps it's in a superposition state, or maybe it never existed at all...
						</p>
					</div>
				{:else if $page.status === 500}
					<div class="mb-6">
						<p class="text-gray-300 mb-4">
							🔧 Internal server error - The quantum computer needs maintenance
						</p>
						<p class="text-sm text-gray-400">
							Our quantum engineers are working to restore the system
						</p>
					</div>
				{:else if $page.status === 403}
					<div class="mb-6">
						<p class="text-gray-300 mb-4">
							🚫 Access denied - You don't have quantum clearance for this area
						</p>
						<p class="text-sm text-gray-400">
							Your quantum entanglement credentials are insufficient
						</p>
					</div>
				{:else}
					<div class="mb-6">
						<p class="text-gray-300 mb-4">
							🌌 An unexpected quantum anomaly has occurred
						</p>
						<p class="text-sm text-gray-400">
							The universe is stranger than we can imagine
						</p>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="">
					<a
						href="/"
						class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold transition-all duration-300 hover:bg-blue-500 hover:scale-105"
					>
						🏠 Return Home
					</a>
				</div>
			</div>

			<!-- Fun Quantum Facts -->
			<div class="mt-8 bg-black/20 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
				<h3 class="text-lg font-bold text-cyan-400 mb-4 text-center">
					🧠 Quantum Fact While You Wait
				</h3>
				<div class="text-center text-gray-300">
					<p class="text-sm">
						In quantum mechanics, the "observer effect" states that the act of observation changes the system being observed. 
						Perhaps by looking at this error page, you've already started fixing the problem! 🔬
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Quantum glitch animation for the error icon */
	@keyframes quantumGlitch {
		0%, 100% { transform: translateX(0px); }
		10% { transform: translateX(-2px) scaleX(0.98); }
		20% { transform: translateX(2px); }
		30% { transform: translateX(-1px) scaleY(0.97); }
		40% { transform: translateX(1px); }
		50% { transform: translateX(-2px) scaleX(1.02); }
		60% { transform: translateX(2px); }
		70% { transform: translateX(-1px); }
		80% { transform: translateX(1px) scaleY(1.02); }
		90% { transform: translateX(-1px); }
	}

	.text-8xl {
		animation: quantumGlitch 3s infinite;
	}
</style>
