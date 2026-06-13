import { Hono } from 'hono'

const dt = new Hono()

dt.get("/", async (c) => {
	const now = new Date();
	const dd = now.getDate();
	const mm = now.getMonth() + 1;
	const yy = now.getFullYear();
	const lunar = ConvertSolar2Lunar(dd, mm, yy, 7, true);
	const lunar_vn_date_short = lunar; // already dd/mm/yyyy
	const iso_string = now.toISOString();
	const timestamp_unix = Math.floor(now.getTime() / 1000);
	const time_short = now.toLocaleTimeString("en-GB", { hour12: false });
	const date_short = now.toLocaleDateString("en-GB");

	const data = {
		iso_string,
		timestamp_unix,
		time_short,
		date_short,
		lunar_vn_date_short
	};

	return c.json(data)
})

export { dt }

/* ------------------------------
   JS PORT OF YOUR LUA FUNCTIONS
--------------------------------*/

const PI = Math.PI;
const INT = n => Math.floor(n);

function jdFromDate(dd, mm, yy) {
	let a = INT((14 - mm) / 12);
	let y = yy + 4800 - a;
	let m = mm + 12 * a - 3;
	let jd =
		dd +
		INT((153 * m + 2) / 5) +
		365 * y +
		INT(y / 4) -
		INT(y / 100) +
		INT(y / 400) -
		32045;

	if (jd < 2299161) {
		jd =
			dd +
			INT((153 * m + 2) / 5) +
			365 * y +
			INT(y / 4) -
			32083;
	}
	return jd;
}

function jdToDate(jd) {
	let a, b, c, d, e, m;
	if (jd > 2299160) {
		a = jd + 32044;
		b = INT((4 * a + 3) / 146097);
		c = a - INT((b * 146097) / 4);
	} else {
		b = 0;
		c = jd + 32082;
	}
	d = INT((4 * c + 3) / 1461);
	e = c - INT((1461 * d) / 4);
	m = INT((5 * e + 2) / 153);

	let day = e - INT((153 * m + 2) / 5) + 1;
	let month = m + 3 - 12 * INT(m / 10);
	let year = b * 100 + d - 4800 + INT(m / 10);

	return `${day}/${month}/${year}`;
}

function getNewMoonDay(k, timeZone) {
	let T = k / 1236.85;
	let T2 = T * T;
	let T3 = T2 * T;
	let dr = PI / 180;

	let Jd1 =
		2415020.75933 +
		29.53058868 * k +
		0.0001178 * T2 -
		0.000000155 * T3;

	Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

	let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
	let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
	let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

	let C1 =
		(0.1734 - 0.000393 * T) * Math.sin(M * dr) +
		0.0021 * Math.sin(2 * dr * M);

	C1 -= 0.4068 * Math.sin(Mpr * dr);
	C1 += 0.0161 * Math.sin(2 * dr * Mpr);
	C1 -= 0.0004 * Math.sin(3 * dr * Mpr);
	C1 += 0.0104 * Math.sin(2 * dr * F);
	C1 -= 0.0051 * Math.sin(dr * (M + Mpr));
	C1 -= 0.0074 * Math.sin(dr * (M - Mpr));
	C1 += 0.0004 * Math.sin(dr * (2 * F + M));
	C1 -= 0.0004 * Math.sin(dr * (2 * F - M));
	C1 -= 0.0006 * Math.sin(dr * (2 * F + Mpr));
	C1 += 0.001 * Math.sin(dr * (2 * F - Mpr));
	C1 += 0.0005 * Math.sin(dr * (2 * Mpr + M));

	let deltat =
		T < -11
			? 0.001 +
			0.000839 * T +
			0.0002261 * T2 -
			0.00000845 * T3 -
			0.000000081 * T * T3
			: -0.000278 + 0.000265 * T + 0.000262 * T2;

	let JdNew = Jd1 + C1 - deltat;

	return INT(JdNew + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn, timeZone) {
	let T = (jdn - 2451545.5 - timeZone / 24) / 36525;
	let T2 = T * T;
	let dr = PI / 180;

	let M =
		357.5291 +
		35999.0503 * T -
		0.0001559 * T2 -
		0.00000048 * T * T2;

	let L0 =
		280.46645 +
		36000.76983 * T +
		0.0003032 * T2;

	let DL =
		(1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);

	DL +=
		(0.019993 - 0.000101 * T) * Math.sin(2 * dr * M) +
		0.00029 * Math.sin(3 * dr * M);

	let L = (L0 + DL) * dr;
	L -= PI * 2 * INT(L / (PI * 2));

	return INT((L / PI) * 6);
}

function getLunarMonth11(yy, timeZone) {
	let off = jdFromDate(31, 12, yy) - 2415021;
	let k = INT(off / 29.530588853);
	let nm = getNewMoonDay(k, timeZone);
	let sunLong = getSunLongitude(nm, timeZone);

	if (sunLong >= 9) nm = getNewMoonDay(k - 1, timeZone);

	return nm;
}

function getLeapMonthOffset(a11, timeZone) {
	let k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
	let last = 0;
	let i = 1;

	let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);

	while (arc !== last && i < 14) {
		last = arc;
		i++;
		arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
	}

	return i - 1;
}

function ConvertSolar2Lunar(dd, mm, yy, timeZone, addYear) {
	let dayNumber = jdFromDate(dd, mm, yy);
	let k = INT((dayNumber - 2415021.076998695) / 29.530588853);

	let monthStart = getNewMoonDay(k + 1, timeZone);
	if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);

	let a11 = getLunarMonth11(yy, timeZone);
	let b11 = a11;
	let lunarYear;

	if (a11 >= monthStart) {
		lunarYear = yy;
		a11 = getLunarMonth11(yy - 1, timeZone);
	} else {
		lunarYear = yy + 1;
		b11 = getLunarMonth11(yy + 1, timeZone);
	}

	let lunarDay = dayNumber - monthStart + 1;
	let diff = INT((monthStart - a11) / 29);

	let lunarLeap = 0;
	let lunarMonth = diff + 11;

	if (b11 - a11 > 365) {
		let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
		if (diff >= leapMonthDiff) {
			lunarMonth = diff + 10;
			if (diff === leapMonthDiff) lunarLeap = 1;
		}
	}

	if (lunarMonth > 12) lunarMonth -= 12;
	if (lunarMonth >= 11 && diff < 4) lunarYear--;

	const ddStr = lunarDay < 10 ? "0" + lunarDay : lunarDay;
	const mmStr = lunarMonth < 10 ? "0" + lunarMonth : lunarMonth;

	return addYear ? `${ddStr}/${mmStr}/${lunarYear}` : `${ddStr}/${mmStr}`;
}
