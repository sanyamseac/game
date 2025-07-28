<script lang="ts">
	import type { ActionData } from "./$types"

	let { form } : {form : ActionData} = $props();
</script>
<form action="?/login" method="post">
	<label for="name">Name</label>
	<input type="text" id="name" name="name" required />
	<label for="email">Email</label>
	<input type="email" id="email" name="email" required />
	<button type="submit">Login</button>
</form>
{#if !form?.success && form?.message}
	<p>{form.message}</p>
{/if}
