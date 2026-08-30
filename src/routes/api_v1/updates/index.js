import { Hono } from 'hono'

const update = new Hono()

update.get('/:key', async (c) => {
	const key = c.req.param('key')
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
	const secret = c.req.query('secret')
	const correctSecret = await c.env.KV_UPDATE_SECRET.get(key)
	if (secret !== correctSecret) {
		return c.json({ error: 'Invalid secret', key: key, timestamp: Date.now(), secret: secret }, 403)
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
