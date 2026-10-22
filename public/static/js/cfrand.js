// Expanded Version, to be used for debugging.
function xmur3(str) {
	for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 3432918353), h = h << 13 | h >>> 19;
	return function () {
		h = Math.imul(h ^ h >>> 16, 2246822507);
		h = Math.imul(h ^ h >>> 13, 3266489909);
		return (h ^= h >>> 16) >>> 0;
	}
}

function xoshiro128(a, b, c, d) {
	return function () {
		var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
		c ^= a; d ^= b;
		b ^= c; a ^= d; c ^= t;
		d = d << 11 | d >>> 21;
		return (r >>> 0) / 4294967296;
	}
}

const CfRand = async s => {
	const drand = (await (await fetch("https://drand.cloudflare.com/public/latest")).json()).signature;
	const seed = xmur3((s === undefined ? null : s.toString()) + crypto.getRandomValues(new Uint8Array(10)).toString() + drand + Date.now());
	return xoshiro128(seed(), seed(), seed(), seed());
};

export default CfRand; // Only use this line when in ESM mode.
