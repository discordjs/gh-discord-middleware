import { verify } from '@octokit/webhooks-methods';

const secret = process.env.GITHUB_SECRET_TOKEN;

const continueHeaders = new Headers();
continueHeaders.set('X-Middleware-Next', '1');

export default async function middleware(request: Request) {
	console.log(
		await verify(
			"It's a Secret to Everybody",
			'Hello, World!',
			'sha256=757107ea0eb2509fc211221cce984b8a37570b6d7586c22c46f4379c8b043e17',
		),
	);
	if (!secret) return new Response(null, { headers: continueHeaders });
	const githubSignature = request.headers.get('X-Hub-Signature-256');
	if (!githubSignature) return new Response(null, { status: 401, statusText: 'Signature Missing' });
	const payload = await request.text();
	const verified = await verify(secret, payload, githubSignature);
	if (!verified) return new Response(null, { status: 401 });
	return new Response(null, { headers: continueHeaders });
}
