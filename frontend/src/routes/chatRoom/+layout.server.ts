import { API_URL } from '$env/static/private';
import type { LayoutServerLoad, PageServerLoad } from './$types';
import type { ChatRoom, ServerResponse } from '$lib/types/myTypes';

export const load: LayoutServerLoad = async ({ cookies, params, fetch }) => {
	let session = cookies.get('session');
	let res: { status: number; response: ServerResponse } | undefined;
	try {
		const fetchChatRooms = await fetch(API_URL + '/chat_room', {
			method: 'GET',
			headers: new Headers({ Authorization: session as string })
		});

		const jsonString = await fetchChatRooms.json();

		res = { status: fetchChatRooms.status, response: jsonString };
	} catch (err) {
		console.error(err);
	}

	console.log(res);

	return { chatRooms: res?.response.data.chatrooms as ChatRoom[] };
};