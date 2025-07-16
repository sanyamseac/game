<script lang="ts">
	let { data } = $props()
</script>

<svelte:head>
	<title>Quantum Cat Game - Home</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
	<div class="container mx-auto px-4 py-16">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
				⚛️ Quantum Cat Game
			</h1>
			<p class="text-xl text-gray-300 mb-8">
				A social elimination game based on Schrödinger's Cat paradox
			</p>
		</div>

		<!-- Navigation Cards -->
		<div class="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
			<!-- Game Link -->
			<a href="/game/1" class="group block">
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-green-500/20 p-8 transition-all duration-300 hover:scale-105 hover:border-green-400/40">
					<div class="text-center">
						<div class="text-6xl mb-4">🎮</div>
						<h2 class="text-2xl font-bold text-green-400 mb-2">Play Game</h2>
						<p class="text-gray-300 text-sm">
							Join the quantum tournament and vote on the cat's fate
						</p>
					</div>
				</div>
			</a>

			<!-- Display Link -->
			<a href="/display" class="group block">
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/20 p-8 transition-all duration-300 hover:scale-105 hover:border-blue-400/40">
					<div class="text-center">
						<div class="text-6xl mb-4">📊</div>
						<h2 class="text-2xl font-bold text-blue-400 mb-2">Live Display</h2>
						<p class="text-gray-300 text-sm">
							Watch the tournament live with real-time vote tracking
						</p>
					</div>
				</div>
			</a>

			<!-- Admin Link -->
			<a href="/admin" class="group block">
				<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 transition-all duration-300 hover:scale-105 hover:border-purple-400/40">
					<div class="text-center">
						<div class="text-6xl mb-4">🔧</div>
						<h2 class="text-2xl font-bold text-purple-400 mb-2">Admin Panel</h2>
						<p class="text-gray-300 text-sm">
							Control the game flow and manage tournament rounds
						</p>
					</div>
				</div>
			</a>
		</div>

		<!-- Game Rules -->
		<div class="max-w-3xl mx-auto mt-16">
			<div class="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
				<h3 class="text-2xl font-bold text-cyan-400 mb-6 text-center">🧪 How It Works</h3>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<span class="text-2xl">1️⃣</span>
							<div>
								<h4 class="font-bold text-white">Vote</h4>
								<p class="text-sm text-gray-300">All players vote whether the quantum cat is alive or dead</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-2xl">2️⃣</span>
							<div>
								<h4 class="font-bold text-white">Random Decision</h4>
								<p class="text-sm text-gray-300">Admin randomly determines the correct answer (50/50 chance)</p>
							</div>
						</div>
					</div>
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<span class="text-2xl">3️⃣</span>
							<div>
								<h4 class="font-bold text-white">Elimination</h4>
								<p class="text-sm text-gray-300">Players who voted incorrectly are eliminated</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-2xl">4️⃣</span>
							<div>
								<h4 class="font-bold text-white">Continue</h4>
								<p class="text-sm text-gray-300">Repeat until only one player remains - the winner!</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Login Link -->
		<div class="text-center mt-12">
			<a href="/login" class="inline-block bg-gradient-to-r from-cyan-600 to-purple-600 px-8 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105">
				🚀 Start Playing
			</a>
		</div>
	</div>
</div>
