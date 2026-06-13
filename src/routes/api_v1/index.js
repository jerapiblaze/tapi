import { Hono } from 'hono'

import { ipcheck } from './ipcheck'
import { dt } from './timedate'

const apiv1 = new Hono()

apiv1.get("/", (c) => {
	return c.text("hello!")
})

apiv1.route("/ipcheck", ipcheck)
apiv1.route("/timedate", dt)

export { apiv1 }
