// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: { email: string };
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				SUBSCRIBERS: KVNamespace;
				RESEND_API_KEY: string;
			};
		}
	}
}

export {};
