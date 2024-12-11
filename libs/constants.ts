export const APP_NAME = "Tajfi";
export const APP_DESCRIPTION =
	"A secure, privacy-first digital wallet using Taproot Assets.";
export const HOME_HERO_DESCRIPTION =
	"Integrate with Nostr for private communication and Lightning Network for fast transactions.";
export const APP_FOOTER_DESCRIPTION =
	"Manage your digital assets securely with Tajfi.";

export const KEY_DEBUG_BALANCES = `${APP_NAME}_storage:debug:user:wallet-balance`;
export const KEY_DEBUG_TRANSFERS = `${APP_NAME}_storage:debug:user:wallet-transfers`;

export const KEY_CURRENT_WALLET_ID = `${APP_NAME}_storage:current-wallet-id`;
export const KEY_WALLETS = `${APP_NAME}_storage:wallets`;
export const KEY_AUTH_TOKEN = `${APP_NAME}_storage:auth-token`;
export const KEY_WALLET_DATA = `${APP_NAME}_storage:wallet-data`;
export const AUTH_MESSAGE = "Sign in to Tajfi";

// ENVIRONMENT VARIABLES

export const DEFAULT_ASSET_ID = process.env.EXPO_PUBLIC_DEFAULT_ASSET_ID || "";
export const DEFAULT_ASSET_NAME = process.env.EXPO_PUBLIC_DEFAULT_ASSET_NAME || "";
export const PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL || "";


// TODO: use zod to validate these
if (!DEFAULT_ASSET_ID) {
	throw new Error('EXPO_PUBLIC_DEFAULT_ASSET_ID must be defined');
}

if (!DEFAULT_ASSET_NAME) {
	throw new Error('EXPO_PUBLIC_DEFAULT_ASSET_NAME must be defined');
}

if (!PUBLIC_API_URL) {
	throw new Error('EXPO_PUBLIC_API_URL must be defined');
}
