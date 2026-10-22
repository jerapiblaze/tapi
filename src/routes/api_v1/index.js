import { Hono } from 'hono'

import { ipcheck } from './ipcheck'
import { dt } from './timedate'
import { update } from './updates'
import { nope } from './nope'
import { random } from './random'

const apiv1 = new Hono()

apiv1.get("/", (c) => {
	return c.text("hello!")
})

apiv1.route("/ipcheck", ipcheck)
apiv1.route("/timedate", dt)
apiv1.route("/updates", update)
apiv1.route("/nope", nope)
apiv1.route("/random", random)

export { apiv1 }
