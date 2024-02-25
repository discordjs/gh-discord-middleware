import { verify, sign } from '@octokit/webhooks-methods';
import { get } from '@vercel/edge-config';

const debugLog = await get<boolean | undefined>('debugLogs');

function log(...messages: unknown[]) {
	if (debugLog) {
		console.log(...messages);
	}
}

const secret = process.env.GITHUB_SECRET_TOKEN;

const continueHeaders = new Headers();
continueHeaders.set('X-Middleware-Next', '1');

export default async function middleware(request: Request) {
	if (!secret) {
		log('No secret set, continuing');
		return new Response(null, { headers: continueHeaders });
	}

	const githubSignature = request.headers.get('X-Hub-Signature-256');
	if (!githubSignature) {
		log('Secret set, no signature header');
		return new Response(null, { status: 401, statusText: 'Signature Missing' });
	}

	const payload = await request.text();
	const verified = await verify(secret, payload, githubSignature);
	if (!verified) {
		log('Verification failed. Local:', await sign(secret, payload), 'Received:', githubSignature);
		return new Response(null, { status: 401 });
	}

	return new Response(null, { headers: continueHeaders });
}
