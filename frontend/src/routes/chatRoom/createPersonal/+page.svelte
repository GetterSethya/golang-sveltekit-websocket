<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toastData } from '$lib/store';
	import Search from '$lib/svg/search.svelte';
	import { responseToastEnum } from '$lib/types/myTypes';
	import { fade, scale } from 'svelte/transition';
	import type { ActionData } from './$types';

	let email: string;
	export let form: ActionData;
	let createPersonalState = { emailVerified: false };
	let waitingResult = false;

	$: toast = {
		message: form?.message,
		type: form?.type
	};

	$: $toastData = toast;

	$: console.log(form);
</script>

<main class="w-full min-h-[94vh] bg-surface-50 dark:bg-surface-900 flex">
	<div class="border border-surface-200 dark:border-surface-700 p-5 rounded w-1/2 m-auto">
		<h1 class="h3 font-bold">Start new conversation</h1>
		<div class="py-2.5 h-64 flex flex-col">
			<p class="text-surface-400 py-1">Email</p>
			<form
				use:enhance={() => {
					waitingResult = true;
					return async ({ result }) => {
						waitingResult = false;
						if (result.status == 200) {
							createPersonalState.emailVerified = true;
						}
						await applyAction(result);
					};
				}}
				method="POST"
				action="?/checkEmail"
				class="w-full border border-surface-200 dark:border-surface-700 rounded flex"
			>
				<input
					type="text"
					name="input-email"
					class="p-2 bg-transparent my-1 outline-none"
					placeholder="Ketik email teman mu.."
					bind:value={email}
					disabled={waitingResult}
				/>
				<button
					disabled={waitingResult}
					class="btn variant-ghost-secondary rounded-tr rounded-br rounded-tl-none rounded-bl-none ms-auto border-y border-e border-surface-200 dark:border-surface-700"
				>
					<Search />
				</button>
			</form>
			{#if createPersonalState.emailVerified}
				<form
					transition:fade
					use:enhance
					class="mt-auto flex"
					action="?/createPersonal"
					method="post"
				>
					<input type="hidden" name="verifiedEmail" bind:value={email} />
					<button class="ms-auto btn variant-filled-primary rounded">Create</button>
				</form>
			{/if}
		</div>
	</div>
</main>
