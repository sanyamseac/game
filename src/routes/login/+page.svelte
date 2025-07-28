<script lang="ts">
	import type { ActionData } from "./$types"

	let { form } : {form : ActionData} = $props();
</script>

<svelte:head>
	<title>Join Game - Quantum Cat</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
	<!-- Animated background particles -->
	<div class="absolute inset-0">
		<div class="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
		<div class="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-bounce opacity-80"></div>
		<div class="absolute bottom-32 left-16 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-40"></div>
		<div class="absolute bottom-20 right-20 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-70"></div>
		<div class="absolute top-1/3 left-1/4 w-1 h-1 bg-rose-400 rounded-full animate-bounce opacity-60"></div>
		<div class="absolute top-2/3 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-ping opacity-50"></div>
	</div>

	<!-- Main login container -->
	<div class="relative z-10 w-full max-w-md">
		<!-- Header section -->
		<div class="text-center mb-8">
			<div class="text-8xl mb-4 animate-bounce">🐾</div>
			<h1 class="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
				Is Meow Gone?
			</h1>
			<p class="text-slate-300 text-lg">Join this fun quantum game</p>
			<div class="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mt-4 rounded-full"></div>
		</div>

		<!-- Login form -->
		<div class="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
			<!-- Subtle background glow -->
			<div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl"></div>
			
			<div class="relative z-10">
				<form action="?/login" method="post" class="space-y-6">
					<!-- Name field -->
					<div class="space-y-2">
						<label for="name" class="block text-sm font-medium text-slate-300 mb-2">
							Player Name
						</label>
						<div class="relative group">
							<input 
								type="text" 
								id="name" 
								name="name" 
								required 
								placeholder="Enter your name"
								class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 group-hover:border-slate-500"
							/>
							<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
						</div>
					</div>

					<!-- Email field -->
					<div class="space-y-2">
						<label for="email" class="block text-sm font-medium text-slate-300 mb-2">
							Email Address
						</label>
						<div class="relative group">
							<input 
								type="email" 
								id="email" 
								name="email" 
								required 
								placeholder="Enter your email"
								class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 group-hover:border-slate-500"
							/>
							<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
						</div>
					</div>

					<!-- Submit button -->
					<button 
						type="submit" 
						class="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group"
					>
						<span class="relative z-10 flex items-center justify-center gap-2">
							<span>Enter Quantum Realm</span>
							<span class="text-xl">🚪</span>
						</span>
						<div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
					</button>
				</form>

				<!-- Error message -->
				{#if !form?.success && form?.message}
					<div class="mt-6 p-4 bg-rose-900/50 border border-rose-500/30 rounded-xl text-rose-300 text-center backdrop-blur-sm">
						<div class="flex items-center justify-center gap-2">
							<span class="text-xl">⚠️</span>
							<span>{form.message}</span>
						</div>
					</div>
				{/if}

				<!-- Game info -->
				<div class="mt-8 text-center">
					<p class="text-slate-400 text-sm mb-3">
						Ready to influence quantum probability?
					</p>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="text-center mt-8 text-slate-500 text-sm">
			<p>May the quantum odds be ever in your favor 🎲</p>
		</div>
	</div>

	<!-- Floating elements -->
	<div class="absolute top-10 left-10 text-4xl opacity-20 animate-spin-slow">⚛️</div>
	<div class="absolute bottom-10 right-10 text-3xl opacity-30 animate-pulse">🌌</div>
	<div class="absolute top-1/4 right-10 text-2xl opacity-25 animate-bounce">🔬</div>
</div>

<style>
	@keyframes spin-slow {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	.animate-spin-slow {
		animation: spin-slow 8s linear infinite;
	}
</style>