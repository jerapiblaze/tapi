import { Hono } from 'hono'
import CfRand from '../../../../public/static/js/cfrand.js'

const nope = new Hono()

nope.get("/", async (c) => {
	const cfRand = await CfRand(Math.random())
	const data = await c.env.KV_NOPE_CACHE.get("nope_cache")
	// convert the cached data from JSON string to object
	const parsedData = data ? JSON.parse(data) : null
	// Get random number from the parsed data, if available
	const randomIndex = parsedData ? Math.floor(cfRand() * parsedData.length)+1 : null
	const randomValue = cfRand()
	if (randomIndex !== null && randomIndex <= parsedData.length - 1 && randomValue < 0.5) {
		const randomItem = parsedData[randomIndex]
		return c.json({ "reason": randomItem, "cacheHit": true, "randomInt": randomIndex })
	} else {
		// make request to NaaS API: https://naas.isalman.dev/no
		const response = await fetch("https://naas.isalman.dev/no")
		const naasData = await response.json()
		// append cache the response in KV_NOPE_CACHE
		const updatedData = parsedData ? [...parsedData, naasData.reason] : [naasData.reason]
		// drop the oldest item if the cache exceeds a certain size (e.g., 1024 items)
		if (updatedData.length > 1024) {
			updatedData.shift()
		}
		await c.env.KV_NOPE_CACHE.put("nope_cache", JSON.stringify(updatedData))
		return c.json({ "reason": naasData.reason, "cacheHit": false, "randomInt": randomIndex })
	}
})

export { nope }
