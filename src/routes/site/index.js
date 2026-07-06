import { Hono } from 'hono'

const site = new Hono()

site.get("/", (c) => {
	return c.env.ASSETS.fetch(new Request(`https://assets.local/static/html/index.html`))
})

site.get("/:page", (c) => {
	const page = c.req.param("page")
	if (page.endsWith(".api")){
		return c.redirect(`/api/v1/${page.split(".")[0]}`)
	}
	if (page === "index" || page === "index.html" || page === ""){
		return c.env.ASSETS.fetch(new Request(`https://assets.local/static/html/index.html`))
	}
	return c.env.ASSETS.fetch(new Request(`https://assets.local/static/html/${page}`, {
		// enable caching for static pages
		headers: {
			"Cache-Control": "public, max-age=3600"
		}
	}))
})

site.get("/assets/*", (c) => {
	const path = c.req.path.split("/").slice(2).join("/")
	console.log(path)
	return c.env.ASSETS.fetch(new Request(`https://assets.local/${path}`, {
		// enable caching for static pages
		headers: {
			"Cache-Control": "public, max-age=3600"
		}
	}))
})


export { site }
