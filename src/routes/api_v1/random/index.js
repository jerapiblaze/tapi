import { Hono } from 'hono'
import CfRand from '../../../../public/static/js/cfrand.js'

const random = new Hono()

random.get("/", async (c) => {
	const cfRand = await CfRand(Math.random())
	return c.json({ "randomValue": cfRand() })
})

export { random }
