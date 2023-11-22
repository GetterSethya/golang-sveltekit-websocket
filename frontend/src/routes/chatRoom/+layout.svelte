<script lang="ts">
	import type { User } from '$lib/types/myTypes';
	import type { LayoutData } from './$types';

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

	$: console.log(data);
</script>

<div class="h-[94vh] w-screen flex flex-row">
	<div class="bg-surface-500 w-1/2 border-x dark:border-surface-700">
		<div class="flex p-5 border-b dark:border-surface-700">
			<h4 class="h4 font-bold">Message</h4>
		</div>

		{#each data.chatRooms as room}
			<a href="/{room.id}" class="border-b dark:border-surface-700 p-5 flex flex-col">
				<h4 class="h4">{room.messages[0]?.sender?.name || getOtherUser(room.participant) || ''}</h4>
				<article class="text-surface-400">
					{room.messages[0]?.messageBody || ''}
				</article>
				<p class="ms-auto text-surface-400"><small>12:00</small></p>
			</a>
		{/each}
	</div>

	<div class="w-full m-auto px-5">
		<slot />
	</div>
</div>
