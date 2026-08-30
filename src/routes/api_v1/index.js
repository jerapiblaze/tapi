import { Hono } from 'hono'

import { ipcheck } from './ipcheck'
import { dt } from './timedate'
import update from './updates'

const apiv1 = new Hono()

apiv1.get("/", (c) => {
	return c.text("hello!")
})

apiv1.route("/ipcheck", ipcheck)
apiv1.route("/timedate", dt)
apiv1.route("/updates", update)

export { apiv1 }
