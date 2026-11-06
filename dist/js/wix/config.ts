// Written by install/deploy.mjs --stack static from .env.local's WIX_CLIENT_ID (what `wix env pull`
// writes; on a migration preview the site being migrated), else wix.config.json, or --client-id.
// The public OAuth client id — not a secret: it only mints anonymous visitor tokens.
export const WIX_CLIENT_ID: string = "36d515cd-302a-4ce5-8b8a-77ff6e040c8b";
