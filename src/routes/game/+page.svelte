<script lang="ts">
	import type { PageData, ActionData } from "./$types"

	let { data, form } : {data : PageData, form : ActionData} = $props()
</script>

{#if data.level === null}
	<p>No levels available at the moment.</p>
{:else if data.level === -1}
	<h1>Level Inactive</h1>
	<p>This level is currently inactive.</p>
{:else}
	<h1>Current Level: {data.level}</h1>
	<form method="POST" action="/game/vote">
		<select name="answer" required>
			<option value="" disabled={data.level === null} selected>Cat Alive</option>
			<option value="1">Yes</option>
			<option value="0">No</option>
		</select>
		<button type="submit">Vote</button>
	</form>
{/if}

{#if !form?.success && form?.message}
	<p>{form.message}</p>
{/if}