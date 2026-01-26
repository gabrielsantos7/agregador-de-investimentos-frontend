import * as dotenv from 'dotenv';
import { defineConfig } from 'orval';

dotenv.config();

const API_URL = process.env.VITE_API_URL;

export default defineConfig({
	api: {
		input: `${API_URL}/v3/api-docs`,
		output: {
			target: '../../http/requests',
			mode: 'tags',
			schemas: '../../http/schemas',
			client: 'react-query',
			httpClient: 'axios',
			clean: true,

			override: {
				fetch: {
					includeHttpResponseReturnType: true,
				},
				mutator: {
					path: './orval.client.ts',
					name: 'orvalClient',
				},
			},
		},

		hooks: {
			afterAllFilesWrite: 'pnpm format',
		},
	},
});
