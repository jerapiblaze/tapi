/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { apiv1 } from './routes/api_v1/index.js'
import { site } from './routes/site/index.js'

const app = new Hono()

app.use(
	'/api/*',
	cors({
		origin: (origin, c) => {
			return origin
		},
		// `c` is a `Context` object
		allowMethods: (origin, c) => {
			return ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE']
		},
		maxAge: 3600
	})
)

app.route("/", site)
app.route("/api/v1", apiv1)

export default app
