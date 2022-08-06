/**
 * MIT License

Copyright (c) 2021 Octokit contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

const enc = new TextEncoder();

function hexToUInt8Array(string: string) {
	// convert string to pairs of 2 characters
	const pairs = string.match(/[\dA-F]{2}/gi)!;

	// convert the octets to integers
	const integers = pairs.map((s) => parseInt(s, 16));

	return new Uint8Array(integers);
}

async function importKey(secret: string) {
	return crypto.subtle.importKey(
		'raw', // raw format of the key - should be Uint8Array
		enc.encode(secret),
		{
			// algorithm details
			name: 'HMAC',
			hash: { name: 'SHA-256' },
		},
		false, // export = false
		['sign', 'verify'], // what this key can do
	);
}

async function verify(secret: string, data: string, signature: string) {
	return crypto.subtle.verify('HMAC', await importKey(secret), hexToUInt8Array(signature), enc.encode(data));
}

const secret = process.env.GITHUB_SECRET_TOKEN;

const continueHeaders = new Headers();
continueHeaders.set('X-Middleware-Next', '1');

export default async function middleware(request: Request) {
	if (!secret) return new Response(null, { headers: continueHeaders });
	const githubSignature = request.headers.get('X-Hub-Signature-256');
	if (!githubSignature) return new Response(null, { status: 401, statusText: 'Signature Missing' });
	const payload = await request.text();
	const verified = await verify(secret, payload, githubSignature);
	if (!verified) return new Response(null, { status: 401 });
	return new Response(null, { headers: continueHeaders });
}
