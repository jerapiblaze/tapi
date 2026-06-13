import { Hono } from 'hono'

const site = new Hono()

site.get("/", (c) => {
	return c.redirect("https://j12tee.qzz.io")
})

site.get("/:page", (c) => {
	const page = c.req.param("page")
	if (page.endsWith(".api")){
		return c.redirect(`/api/v1/${page.split(".")[0]}`)
	}
	if (page === "index" || page === "index.html" || page === ""){
		return c.env.ASSETS.fetch(new Request(`https://assets.local/static/html/index.html`))
	}
	return c.env.ASSETS.fetch(new Request(`https://assets.local/static/html/${page}`))
})

site.get("/assets/*", (c) => {
	const path = c.req.path.split("/").slice(2).join("/")
	console.log(path)
	return c.env.ASSETS.fetch(new Request(`https://assets.local/${path}`))
})


export { site }
