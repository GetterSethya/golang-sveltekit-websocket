<script lang="ts">
	import Menu from '$lib/components/menu.svelte';
	import ThreeDot from '$lib/svg/threeDot.svelte';
	import type { PageData } from './$types';
	import PaperPlane from '$lib/svg/paperPlane.svelte';
	import type { User } from '$lib/types/myTypes';
	import CenterModal from '$lib/components/centerModal.svelte';
	import { getOtherUserId } from '$lib/misc/misc';
	import UserChatBubble from '$lib/components/userChatBubble.svelte';
	import OtherUserChatBubble from '$lib/components/otherUserChatBubble.svelte';
	import { onMount } from 'svelte';
	import { navigating, page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';

	export let data: PageData;
	let inputMessage: string;
	let chatContainer: HTMLDivElement;
	let waitingResult = false;

	function setChatTitle(idata: any) {
		if (data.chatRoom.chatRoomType == 'group') {
			return idata.roomName;
		}
		if (data.chatRoom.chatRoomType == 'personal') {
			let title;
			data.chatRoom.participant.forEach((u: User) => {
				if (u.id != data.userData.id) {
					title = u.name;
				}
			});
			return title;
		}
	}

	onMount(() => {
		setTimeout(() => {
			chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
		}, 100);
	});

	$: if ($navigating) {
		setTimeout(() => {
			chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
		}, 100);
	}

	let otherUserId = getOtherUserId(data.userData.id, data.chatRoom.participant);
	let chatRoomState = { showDotMenu: false, showDetailPesonal: false };
</script>

{#if data.chatRoom.chatRoomType == 'personal'}
	<CenterModal userId={String(otherUserId)} bind:show={chatRoomState.showDetailPesonal} />
{/if}

<div class="w-full h-full flex flex-col">
	<div class="border-b border-surface-200 dark:border-surface-700 p-5 flex flex-row justify-center">
		<h4 class="h4 font-bold">{setChatTitle(data)}</h4>
		<Menu bind:show={chatRoomState.showDotMenu}>
			<button
				on:click={() => {
					chatRoomState.showDotMenu = !chatRoomState.showDotMenu;
				}}
				class="p-1"
				slot="menu"><ThreeDot /></button
			>
			<div class="flex flex-col" slot="options">
				<button
					on:click={() => {
						chatRoomState.showDotMenu = !chatRoomState.showDotMenu;
						chatRoomState.showDetailPesonal = true;
					}}
					class="btn font-bold">Detail</button
				>
				<button
					on:click={() => {
						chatRoomState.showDotMenu = !chatRoomState.showDotMenu;
					}}
					class="btn font-bold text-primary-500">Leave</button
				>
			</div>
		</Menu>
	</div>

	<!-- chat container -->
	<div bind:this={chatContainer} class="overflow-x-hidden px-10 overflow-y-scroll">
		{#each data.chatRoom.messages as msg}
			{#if msg.userId == data.userData.id}
				<UserChatBubble message={msg.messageBody} strDateTime={msg.createdAt} />
			{:else}
				<OtherUserChatBubble
					name={msg.sender.name}
					message={msg.messageBody}
					strDateTime={msg.createdAt}
				/>
			{/if}
		{/each}
	</div>

	<form
		use:enhance={() => {
			waitingResult = true;
			return async ({ result }) => {
				inputMessage = '';
				waitingResult = false;
				await applyAction(result);
			};
		}}
		action="?chatroom/{data.chatRoom.id}"
		method="POST"
		class="mt-auto flex flex-row border-t border-surface-200 dark:border-surface-700 dark:bg-surface-800"
	>
		<input
			class="w-full p-2 bg-transparent m-2 border rounded border-surface-200 dark:border-surface-700 dark:bg-surface-700"
			style="outline: none;"
			bind:value={inputMessage}
			type="text"
			name="messageBody"
			minlength="1"
			required
			placeholder="Ketik sesuatu..."
		/>
		<input type="hidden" name="messageType" value="message" />
		<input type="hidden" name="chatRoomId" value={data.chatRoom.id} />
		<input type="hidden" name="messageLink" value="" />
		<button class="p-2 m-2 w-16 btn variant-filled-primary rounded">
			<PaperPlane />
		</button>
	</form>
</div>
