import { Hono } from 'hono'

const update = new Hono()

update.get('/:key', async (c) => {
	const key = c.req.param('key')
	const value = await c.env.KV_UPDATE_CACHE.get(key);
	// Return 404 if not found
	if (value === null) {
		return c.json({ error: 'Not found', timestamp: Date.now() }, 404)
	}
	return c.json({ key: key, value: value, timestamp: Date.now() });
})

update.post('/:key?secret=:secret', async (c) => {
	const key = c.req.param('key')
	const secret = c.req.param('secret')
	const correctSecret = await c.env.KV_UPDATE_SECRET.get('key')
	if (secret !== correctSecret) {
		return c.json({ error: 'Invalid secret', timestamp: Date.now() }, 403)
	}
	// value from body, can be anything
	const value = await c.req.text()
	await c.env.KV_UPDATE_CACHE.put(key, value)
	return c.json({ key: key, timestamp: Date.now() });
})

export default update
