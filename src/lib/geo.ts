export type VisitorCountry = { code: string; name: string };

const UNKNOWN: VisitorCountry = { code: "XX", name: "Unknown" };

function displayName(code: string) {
	try {
		return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
	} catch {
		return code;
	}
}

/**
 * Reads the visitor's country from the geolocation headers Netlify attaches
 * to every request (`x-nf-geo` is base64-encoded JSON, `x-country` is the code).
 */
export function getRequestCountry(request: Request): VisitorCountry {
	const geoHeader = request.headers.get("x-nf-geo");
	if (geoHeader) {
		try {
			const geo = JSON.parse(atob(geoHeader)) as {
				country?: { code?: string; name?: string };
			};
			const code = geo.country?.code?.toUpperCase();
			if (code && /^[A-Z]{2}$/.test(code)) {
				return { code, name: geo.country?.name || displayName(code) };
			}
		} catch {
			// fall through to x-country
		}
	}

	const code = request.headers.get("x-country")?.toUpperCase();
	if (code && /^[A-Z]{2}$/.test(code)) {
		return { code, name: displayName(code) };
	}
	return UNKNOWN;
}
