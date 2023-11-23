import { responseToastEnum, type responseToast } from '$lib/types/myTypes';
import { ZodError, z } from 'zod';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

const checkEmailSchema = z.string().email();

export const actions: Actions = {
	checkEmail: async ({ request, cookies, fetch }) => {
		let data: responseToast;

		let session = cookies.get('session');

		let fd = await request.formData();
		const email = fd.get('input-email');

		try {
			checkEmailSchema.parse(email);
		} catch (err) {
			console.error(err);
			if (err instanceof ZodError) {
				const error = err.errors.map((e) => {
					return e.message;
				});
				data = { error: true, message: error, type: responseToastEnum.warning };

				return fail(400, data);
			} else {
				data = { error: true, message: ['Internal server error'], type: responseToastEnum.error };

				return fail(500, data);
			}
		}

		let res: number | undefined;

		try {
			const fetchCheckEmail = await fetch(API_URL + '/checkEmail?email=' + email, {
				method: 'get',
				headers: new Headers({ Authorization: session as string })
			});

			res = fetchCheckEmail.status;
		} catch (err) {
			console.error(err);
			data = { error: true, message: ['Internal server error'], type: responseToastEnum.error };
			return fail(500, data);
		}

		if (res && res != 200) {
			data = { error: true, message: ['User did not exists'], type: responseToastEnum.warning };
			return fail(404, data);
		} else if (res && res == 200) {
			data = {
				error: false,
				message: ['Success, email is valid'],
				type: responseToastEnum.primary
			};
			return data;
		} else {
			data = { error: true, message: ['Internal server error'], type: responseToastEnum.error };
			return fail(500, data);
		}
	},
	createPersonal: async ({ request, cookies }) => {
		let data: responseToast;
	}
};
