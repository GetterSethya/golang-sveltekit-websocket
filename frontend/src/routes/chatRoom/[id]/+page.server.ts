import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { ServerResponse } from '$lib/types/myTypes';

export const load: PageServerLoad = async ({ cookies, params, fetch }) => {
	let session = cookies.get('session');
	let res: { status: number; response: ServerResponse } | undefined;
	try {
		const fetchChatRooms = await fetch(API_URL + '/chat_room?crid=' + params.id, {
			method: 'GET',
			headers: new Headers({ Authorization: session as string })
		});

		const jsonString = await fetchChatRooms.json();

		res = { status: fetchChatRooms.status, response: jsonString };
	} catch (err) {
		console.error(err);
	}

	console.log(res);

	return { res };
};
