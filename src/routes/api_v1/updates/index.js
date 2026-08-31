import { Hono } from 'hono'

const update = new Hono()
const encoder = new TextEncoder()

async function secretsMatch(providedSecret, expectedSecret, { allowMissingSecret = false } = {}) {
	const [providedHash, expectedHash] = await Promise.all([
		crypto.subtle.digest('SHA-256', encoder.encode(providedSecret ?? '')),
		crypto.subtle.digest('SHA-256', encoder.encode(expectedSecret ?? ''))
	])

	return (allowMissingSecret && providedSecret == null && expectedSecret == null)
		|| (typeof providedSecret === 'string'
			&& typeof expectedSecret === 'string'
			&& crypto.subtle.timingSafeEqual(providedHash, expectedHash))
}

update.get('/:key?', async (c) => {
	const key = c.req.param('key')
	if (!key) {
		return c.json({ error: 'Key is required', timestamp: Date.now() }, 400)
	}
	const secret = c.req.query('secret')
	// get read secret for the key
	const correctSecret = await c.env.KV_UPDATE_SECRET.get(`${key}:r`)
	if (!(await secretsMatch(secret, correctSecret, { allowMissingSecret: true }))) {
		return c.json({ error: 'Invalid secret', key: key, timestamp: Date.now() }, 403)
	}
	const value = await c.env.KV_UPDATE_CACHE.get(key);
	// Return 404 if not found
	if (value === null) {
		return c.json({ error: 'Not found', timestamp: Date.now() }, 404)
	}
	const parsedValue = JSON.parse(value);
	if (!parsedValue) {
		return c.json({ error: 'Invalid value', timestamp: Date.now() }, 500)
	}
	return c.json({ key: key, value: parsedValue.value, timestamp: parsedValue.timestamp });
})

update.post('/:key?', async (c) => {
	const key = c.req.param('key')
	if (!key) {
		return c.json({ error: 'Key is required', timestamp: Date.now() }, 400)
	}
	const secret = c.req.query('secret')
	// get write secret for the key
	const correctSecret = await c.env.KV_UPDATE_SECRET.get(`${key}:w`)
	if (!(await secretsMatch(secret, correctSecret))) {
		return c.json({ error: 'Invalid secret', key: key, timestamp: Date.now() }, 403)
	}
	// value from body, can be anything
	const value = await c.req.text()
	const valueToPut = {
		value: value,
		timestamp: Date.now()
	}
	await c.env.KV_UPDATE_CACHE.put(key, JSON.stringify(valueToPut))
	return c.json({ key: key, timestamp: valueToPut.timestamp });
})

export default update
