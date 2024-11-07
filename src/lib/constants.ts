export const CELL_WIDTH = 100 * 3
export const CELL_HEIGHT = 150 * 3
export const CELL_PADDING = 16
export const MIN_ROW_HEIGHT = CELL_HEIGHT + 2 * CELL_PADDING
export const MIN_CARD_HEIGHT = CELL_HEIGHT
export const LIST_ITEM_HEIGHT = 100
export const LIST_ITEM_IMAGE_HEIGHT = 100 - 2 * CELL_PADDING
export const IS_TESTNET = false
export const NETWORK_NAME = IS_TESTNET ? 'Testnet' : 'Mainnet';
export const DEBUG = true

export const APP_NAME = 'Tajfi'
export const APP_DESCRIPTION = 'A secure, privacy-first digital wallet using Taproot Assets.'
export const HOME_HERO_DESCRIPTION =
  'Integrate with Nostr for private communication and Lightning Network for fast transactions.'
export const APP_FOOTER_DESCRIPTION = 'Manage your digital assets securely with Tajfi.'
export const AUTH_MESSAGE = 'Sign in to Tajfi'

// LOCAL STORAGE
const STORAGE_VERSION = 'v1'

export const KEY_DEBUG_BALANCES = `${APP_NAME}_storage:${STORAGE_VERSION}:debug:user:wallet-balance`
export const KEY_DEBUG_TRANSFERS = `${APP_NAME}_storage:${STORAGE_VERSION}:debug:user:wallet-transfers`
export const KEY_CURRENT_WALLET_ID = `${APP_NAME}_storage:${STORAGE_VERSION}:current-wallet-id`

export const KEY_WALLETS = `${APP_NAME}_storage:${STORAGE_VERSION}:wallets`
export const KEY_AUTH_TOKEN = `${APP_NAME}_storage:${STORAGE_VERSION}:auth-token`
export const KEY_WALLET_DATA = `${APP_NAME}_storage:${STORAGE_VERSION}:wallet-data`
