import { Hono } from 'hono'
import CfRand from '../../../../public/static/js/cfrand.js'

const random = new Hono()

random.get("/", async (c) => {
	const cfRand = await CfRand(Math.random())
	const randomValue = cfRand()
	const minQuery = c.req.query('min') || null
	const maxQuery = c.req.query('max') || null
	const integerQuery = c.req.query('integer') || null
	const min = minQuery !== null ? Number(minQuery) : null
	const max = maxQuery !== null ? Number(maxQuery) : null
	const integer = integerQuery !== null ? Boolean(integerQuery) : null
	if (integer) {
		if (min === null || max === null) {
			return new Response("Min and Max values are required for integer random values", { status: 400 })
		}
		const returnValue = Math.floor(randomValue * (max - min + 1)) + min
		return c.json({ "randomValue": returnValue })
	} else {
		if (min !== null && max === null) {
			return new Response("Max value is required when min is specified", { status: 400 })
		}
		if (max !== null && min === null) {
			return new Response("Min value is required when max is specified", { status: 400 })
		}
		if (min !== null && max !== null) {
			const returnValue = randomValue * (max - min) + min
			return c.json({ "randomValue": returnValue })
		}
		if (min === null && max === null) {
			const returnValue = randomValue
			return c.json({ "randomValue": returnValue })
		}
	}
})

export { random }
