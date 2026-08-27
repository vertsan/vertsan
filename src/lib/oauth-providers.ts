export interface OAuthProvider {
	name: string;
	authorizeUrl: string;
	tokenUrl: string;
	userInfoUrl: string;
	scope: string;
	getClientId: () => string;
	getClientSecret: () => string;
	getAuthorizationUrl: (redirectUri: string, state: string) => string;
	exchangeCode: (
		code: string,
		redirectUri: string,
	) => Promise<{
		access_token: string;
		token_type?: string;
	}>;
	fetchUser: (accessToken: string) => Promise<{
		id: string | number;
		name: string;
		email?: string;
		avatar?: string;
		profileUrl?: string;
	}>;
}

export const providers: Record<string, OAuthProvider> = {
	google: {
		name: "Google",
		authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
		tokenUrl: "https://oauth2.googleapis.com/token",
		userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
		scope: "openid email profile",
		getClientId: () => process.env.GOOGLE_CLIENT_ID || "",
		getClientSecret: () => process.env.GOOGLE_CLIENT_SECRET || "",
		getAuthorizationUrl(redirectUri, state) {
			const params = new URLSearchParams({
				client_id: this.getClientId(),
				redirect_uri: redirectUri,
				response_type: "code",
				scope: this.scope,
				state,
				access_type: "offline",
				prompt: "consent",
			});
			return `${this.authorizeUrl}?${params.toString()}`;
		},
		async exchangeCode(code, redirectUri) {
			const res = await fetch(this.tokenUrl, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					code,
					client_id: this.getClientId(),
					client_secret: this.getClientSecret(),
					redirect_uri: redirectUri,
					grant_type: "authorization_code",
				}),
			});
			if (!res.ok)
				throw new Error("Failed to exchange Google authorization code");
			return res.json();
		},
		async fetchUser(accessToken) {
			const res = await fetch(this.userInfoUrl, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			if (!res.ok) throw new Error("Failed to fetch Google user info");
			const data = await res.json();
			return {
				id: data.id,
				name: data.name || data.email,
				email: data.email,
				avatar: data.picture,
			};
		},
	},
	github: {
		name: "GitHub",
		authorizeUrl: "https://github.com/login/oauth/authorize",
		tokenUrl: "https://github.com/login/oauth/access_token",
		userInfoUrl: "https://api.github.com/user",
		scope: "read:user user:email",
		getClientId: () => process.env.GITHUB_CLIENT_ID || "",
		getClientSecret: () => process.env.GITHUB_CLIENT_SECRET || "",
		getAuthorizationUrl(redirectUri, state) {
			const params = new URLSearchParams({
				client_id: this.getClientId(),
				redirect_uri: redirectUri,
				scope: this.scope,
				state,
			});
			return `${this.authorizeUrl}?${params.toString()}`;
		},
		async exchangeCode(code, redirectUri) {
			const res = await fetch(this.tokenUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
				body: new URLSearchParams({
					code,
					client_id: this.getClientId(),
					client_secret: this.getClientSecret(),
					redirect_uri: redirectUri,
				}),
			});
			if (!res.ok)
				throw new Error("Failed to exchange GitHub authorization code");
			return res.json();
		},
		async fetchUser(accessToken) {
			const res = await fetch(this.userInfoUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: "application/vnd.github+json",
				},
			});
			if (!res.ok) throw new Error("Failed to fetch GitHub user info");
			const data = await res.json();
			let email = data.email;
			if (!email) {
				const emailRes = await fetch("https://api.github.com/user/emails", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: "application/vnd.github+json",
					},
				});
				if (emailRes.ok) {
					const emails = await emailRes.json();
					const primary = emails.find(
						(e: { primary?: boolean; verified?: boolean }) =>
							e.primary && e.verified,
					);
					if (primary) email = primary.email;
				}
			}
			return {
				id: data.id,
				name: data.name || data.login,
				email,
				avatar: data.avatar_url,
				profileUrl: data.html_url,
			};
		},
	},
};

export type ProviderName = keyof typeof providers;
