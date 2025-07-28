<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let timer = $state(0);
	let timerActive = $state(false);
	let timerInterval: NodeJS.Timeout;
	let autoTimer = $state(false);

	function submitStopVoting() {
		const formElement = document.getElementById('stopVotingForm') as HTMLFormElement;
		if (formElement) {
			formElement.requestSubmit();
		}
	}

	function startTimer() {
		if (timerActive) {
			clearInterval(timerInterval);
		}

		timer = 10;
		timerActive = true;

		timerInterval = setInterval(() => {
			timer--;
			if (timer <= 0) {
				clearInterval(timerInterval);
				timerActive = false;
				submitStopVoting();
			}
		}, 1000);
	}

	function stopTimer() {
		clearInterval(timerInterval);
		timerActive = false;
		timer = 0;
	}

	onMount(() => {
		return () => {
			if (timerInterval) {
				clearInterval(timerInterval);
			}
		};
	});

	onMount(() => {
		setInterval(() => {
			invalidateAll();
		}, 200);
	});
</script>

<svelte:head>
	<title>Is Meow Gone? - Live Display</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white font-sans overflow-hidden">
	<!-- Header -->
	<div class="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm bg-black/20">
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<div class="flex items-center gap-4">
				<div class="text-4xl">🐾</div>
				<div>
					<h1 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
						Is Meow Gone?
					</h1>
					<p class="text-slate-300">Live Game Display</p>
				</div>
			</div>
			<div class="text-right">
				<div class="text-2xl font-bold text-emerald-400">Level {data.currentLevel?.id || 'N/A'}</div>
				<div class="text-sm text-slate-400">Current Round</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-8 h-[calc(100vh-120px)]">
		<!-- Left Stats Panel -->
		<div class="col-span-3 space-y-6">
			<!-- Game Stats -->
			<div class="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<h2 class="text-xl font-semibold mb-4 text-cyan-400">📊 Game Stats</h2>
				<div class="space-y-4">
					<div class="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
						<span class="text-slate-300">Total Players</span>
						<span class="text-2xl font-bold text-emerald-400">{data.totalUsers}</span>
					</div>
					<div class="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
						<span class="text-slate-300">Voted</span>
						<span class="text-2xl font-bold text-amber-400">{data.votedUsers}</span>
					</div>
					<div class="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
						<span class="text-slate-300">Remaining</span>
						<span class="text-2xl font-bold text-rose-400">{data.remainingPlayers}</span>
					</div>
				</div>
			</div>

			<!-- Admin Controls -->
			<div class="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<h2 class="text-xl font-semibold mb-4 text-purple-400">🔧 Admin Controls</h2>
				<div class="space-y-3">
					{#if !data.gameStarted}
						<form method="POST" action="?/startGame" use:enhance={() => { if (autoTimer) { startTimer(); } }}>
							<button type="submit" class="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-semibold transition-all text-sm">
								🚀 Start Game
							</button>
						</form>
					{/if}

					{#if data.gameStarted && data.currentLevel?.answer !== null}
						<form method="POST" action="?/nextLevel" use:enhance={() => { if (autoTimer) { startTimer(); } }}>
							<button type="submit" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-semibold transition-all text-sm">
								➡️ Next Level
							</button>
						</form>
					{/if}

					{#if data.gameStarted && data.currentLevel?.active}
						<form method="POST" action="?/stopVoting" use:enhance id="stopVotingForm">
							<button type="submit" class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 font-semibold transition-all text-sm">
								⏹️ Stop Voting
							</button>
						</form>
					{/if}

					{#if data.gameStarted && data.currentLevel?.answer === null}
						<form method="POST" action="?/decide" use:enhance>
							<button type="submit" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-semibold transition-all text-sm">
								🎲 Random Result
							</button>
						</form>
					{/if}

					<form method="POST" action="?/resetGame" use:enhance>
						<button type="submit" class="w-full px-4 py-2 bg-rose-700 text-white rounded-lg hover:bg-rose-600 font-semibold transition-all text-sm" onclick={(e) => { if (!confirm('Reset entire game?')) { e.preventDefault(); } }}>
							🔄 Reset
						</button>
					</form>
				</div>
			</div>

			<!-- Timer Controls -->
			<div class="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
				<h2 class="text-xl font-semibold mb-4 text-cyan-400">⏰ Timer</h2>
				<div class="flex gap-2 mb-4">
					<button onclick={startTimer} disabled={timerActive} class="flex-1 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:text-slate-400 transition-colors text-sm">
						Start
					</button>
					<button onclick={stopTimer} class="flex-1 px-3 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition-colors text-sm">
						Stop
					</button>
				</div>
				<label class="flex items-center cursor-pointer">
					<input type="checkbox" bind:checked={autoTimer} class="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500" />
					<span class="ml-2 text-xs text-slate-300">Auto-Timer</span>
				</label>
			</div>
		</div>

		<!-- Central Display Area -->
		<div class="col-span-6 flex flex-col justify-center items-center">
			<div class="relative">
				<!-- Main Display Circle -->
				<div class="w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border-4 border-white/20 flex flex-col items-center justify-center relative overflow-hidden">
					<!-- Background Animation -->
					<div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
					
					<!-- Timer Display (when active) -->
					{#if timerActive}
						<div class="text-8xl font-mono font-bold text-red-400 animate-pulse z-10">
							{timer.toString().padStart(2, '0')}
						</div>
						<div class="text-xl text-red-300 mt-4 z-10">Voting Ends In</div>
					
					<!-- Results Display (when level has answer) -->
					{:else if data.currentLevel && data.currentLevel.answer !== null}
						<div class="text-center z-10">
							{#if data.currentLevel.answer}
								<div class="text-9xl mb-4">😸</div>
								<div class="text-4xl font-bold text-emerald-400 mb-2">ALIVE!</div>
								<div class="text-xl text-emerald-300">The cat survives!</div>
							{:else}
								<div class="text-9xl mb-4">💀</div>
								<div class="text-4xl font-bold text-rose-400 mb-2">DEAD!</div>
								<div class="text-xl text-rose-300">The cat didn't make it...</div>
							{/if}
						</div>
					
					<!-- Pending Measurement Display (voting ended, no result yet) -->
					{:else if data.currentLevel && !data.currentLevel.active && data.currentLevel.answer === null}
						<div class="text-center z-10">
							<div class="text-8xl mb-4 animate-spin">⚛️</div>
							<div class="text-3xl font-bold text-purple-400 mb-2">MEASURING...</div>
							<div class="text-xl text-purple-300">Quantum state collapsing</div>
						</div>
					
					<!-- Waiting/Question Mark Display -->
					{:else if data.currentLevel?.active}
						<div class="text-center z-10">
							<div class="text-9xl mb-4 animate-bounce">❓</div>
							<div class="text-3xl font-bold text-cyan-400 mb-2">VOTING</div>
							<div class="text-xl text-cyan-300">Cast your votes now!</div>
						</div>
					
					<!-- Game Status Display -->
					{:else}
						<div class="text-center z-10">
							<div class="text-9xl mb-4">🐾</div>
							<div class="text-3xl font-bold text-purple-400 mb-2">QUANTUM CAT</div>
							<div class="text-xl text-purple-300">
								{#if !data.gameStarted}
									Waiting to start...
								{:else}
									Get ready for next level!
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<!-- Vote Progress Ring -->
				{#if data.currentLevel?.active && data.totalUsers > 0}
					<div class="absolute inset-0 w-96 h-96">
						<svg class="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
							<!-- Background circle -->
							<circle 
								cx="60" 
								cy="60" 
								r="54" 
								fill="none" 
								stroke="rgba(255,255,255,0.1)" 
								stroke-width="4"
							/>
							<!-- Progress circle -->
							<circle 
								cx="60" 
								cy="60" 
								r="54" 
								fill="none" 
								stroke="url(#gradient)" 
								stroke-width="4"
								stroke-dasharray="{2 * Math.PI * 54}"
								stroke-dashoffset="{2 * Math.PI * 54 * (1 - data.votedUsers / data.totalUsers)}"
								stroke-linecap="round"
								class="transition-all duration-500 ease-out"
							/>
							<defs>
								<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
									<stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
								</linearGradient>
							</defs>
						</svg>
					</div>
				{/if}
			</div>

			<!-- Vote Progress Text -->
			{#if data.currentLevel?.active}
				<div class="mt-8 text-center">
					<div class="text-2xl font-bold text-white">{data.votedUsers} / {data.totalUsers}</div>
					<div class="text-slate-400">votes cast</div>
				</div>
			{/if}
		</div>

		<!-- Right Leaderboard Panel -->
		<div class="col-span-3 space-y-6">
			<!-- Leaderboard -->
			<div class="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
				<h2 class="text-xl font-semibold mb-4 text-amber-400">🏆 Leaderboard</h2>
				{#if data.topPlayers && data.topPlayers.length > 0}
					<div class="space-y-3">
						{#each data.topPlayers as player, i}
							<div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
										{i + 1}
									</div>
									<span class="font-medium text-white truncate">{player.name}</span>
								</div>
								<div class="text-amber-400 font-bold">{player.points}</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-12">
						<div class="text-6xl mb-4">👥</div>
						<p class="text-slate-400">No players yet</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Notification Bar -->
	{#if form?.message}
		<div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
			<div class="px-6 py-3 rounded-full backdrop-blur-sm border {form.success ? 'bg-emerald-900/80 text-emerald-300 border-emerald-500/30' : 'bg-rose-900/80 text-rose-300 border-rose-500/30'} shadow-lg">
				{form.message}
			</div>
		</div>
	{/if}
</div>