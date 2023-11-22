<script lang="ts">
	import type { User } from '$lib/types/myTypes';
	import type { LayoutData } from './$types';
	import { relativeTime } from '$lib/misc/misc.js';

	export let data: LayoutData;

	function getOtherUser(u: User[]) {
		let name = '';
		u.forEach((user) => {
			if (user.id != data.userData.id) {
				name = user.name;
			}
		});

		return name;
	}
</script>

<div class="h-[94vh] w-screen flex flex-row">
	<div class=" w-1/2 border-x border-surface-200 dark:border-surface-700">
		<div class="flex p-5 border-b border-surface-200 dark:border-surface-700">
			<h4 class="h4 font-bold">Message</h4>
		</div>

		{#each data.chatRooms as room}
			<a
				href="/chatRoom/{room.id}"
				class="border-b border-surface-200 dark:border-surface-700 p-5 flex flex-col"
			>
				<h4 class="h4">{room.messages[0]?.sender?.name || getOtherUser(room.participant) || ''}</h4>
				<article class="text-surface-400">
					{room.messages[0]?.messageBody || ''}
				</article>
				<p class="ms-auto text-surface-400"><small>{relativeTime(room.createdAt)}</small></p>
			</a>
		{/each}
	</div>

	<div class="w-full">
		<slot />
	</div>
</div>
