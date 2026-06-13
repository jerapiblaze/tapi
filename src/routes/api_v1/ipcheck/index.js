import { Hono } from 'hono'

const ipcheck = new Hono()

function checkWarp(request) {
	const warpHeader = request.header("CF-Warp");
	if (warpHeader) {
		return (warpHeader === "on")
	} else {
		return (request.cf.asn === 13335)
	}
};


ipcheck.get("/", async (c) => {
	const request = c.req
	const { cf } = c.req.raw || {};
	const { country, city, region, regionCode, asn, asOrganization, colo, continent, latitude, longitude, postalCode, timezone } = cf || {};
	const ip = request.header('Cf-Connecting-IP');
	const ray_id = request.header('Cf-Ray');
	const cfWorkerName = request.header("CF-Worker");
	const isWarp = request.header("CF-Warp") ? true : (asn === 13335 ? true:false)
	const user_agent = request.header('User-Agent');
	const data = {
		user_ip: ip,
		user_city: city,
		user_country: country,
		user_region: region,
		user_continent: continent,
		user_regioncode: regionCode,
		user_asn: asn,
		user_org: asOrganization,
		user_postalcode: postalCode,
		user_timezone: timezone,
		user_latitude: latitude,
		user_longitude: longitude,
		user_iscfwarp: isWarp,
		user_ua: user_agent,
		cf_datacenter: colo,
		cf_rayid: ray_id,
		cf_workername: cfWorkerName
	}
	return c.json(data)
})

export { ipcheck }
