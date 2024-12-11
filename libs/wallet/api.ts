import { PUBLIC_API_URL } from "../constants";
import { getAuthToken } from "./db";

type AuthBody = {
	public_key: string;
	signature: string;
	message: string;
};

type ReceiveBody = {
	asset_id: string;
	amt: number;
};

type SendStartBody = {
	invoice: string;
};

type SendCompleteBody = {
	psbt: string;
	signature_hex: string;
	sighash: string;
};

export type AssetBalances = {
	[assetId: string]: {
		asset_genesis: {
			genesis_point: string;
			name: string;
			meta_hash: string;
			asset_id: string;
			asset_type: "NORMAL" | "COLLECTIBLE";
			output_index: number;
		};
		balance: string;
	};
};

type InvoiceInfo = {
	encoded: string;
	asset_id: string;
	asset_type: "NORMAL" | "COLLECTIBLE";
	amount: string;
	group_key: string;
	script_key: string;
	internal_key: string;
	tapscript_sibling: string;
	taproot_output_key: string;
	proof_courier_addr: string;
	asset_version: string;
	address_version: string;
};

type ListBalancesResponse = {
	asset_balances: AssetBalances;
};

export type HistoryTransaction = {
	txid: string;
	timestamp: string;
	height: number;
	asset_id: string;
	type: "send" | "receive";
	amount: number;
};

export type Order = {
	asset_id: string;
	amount_to_sell: number;
	amount_sats_to_receive: number;
	outpoint: {
		txid: string;
		output_index: number;
	};
	virtual_psbt: string;
	anchor_psbt: string;
	passive_asset_psbts: string[];
};

type SendCompleteResponse = {
	transfer_timestamp: string;
	anchor_tx_hash: string;
	anchor_tx_height_hint: number;
	anchor_tx_chain_fees: string;
	inputs: {
		anchor_point: string;
		asset_id: string;
		script_key: string;
		amount: string;
	}[];
	outputs: {
		anchor: object;
		script_key: string;
		script_key_is_local: boolean;
		amount: string;
		new_proof_blob: string;
		split_commit_root_hash: string;
		output_type: string;
		asset_version: string;
		lock_time: string;
		relative_lock_time: string;
		proof_delivery_status: string;
	}[];
	anchor_tx_block_hash: {
		incididunt_7: boolean;
	};
};

const fetchFromApi = async <Body, Response>(
	endpoint: string,
	method: "GET" | "POST",
	body: Body,
	requireAuth = true,
) => {
	const apiUrl = `${PUBLIC_API_URL}${endpoint}`;
	const headers: HeadersInit = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	if (requireAuth) {
		const authToken = await getAuthToken();
		if (!authToken) {
			throw new Error("No auth token found");
		}
		headers.Authorization = `Bearer ${authToken}`;
	}

	const response = await fetch(apiUrl, {
		method,
		headers,
		...(method === "POST" ? { body: JSON.stringify(body) } : {}),
	});

	if (!response.ok) {
		throw new Error(response.statusText);
	}

	const data = await response.json();
	return data as Response;
};

export const auth = async ({
	tapasPublicKey,
	signature,
	message,
}: { tapasPublicKey: string; signature: string; message: string }) => {
	const body: AuthBody = {
		public_key: tapasPublicKey,
		signature,
		message,
	};
	const response: { token: string } = await fetchFromApi(
		"/wallet/connect",
		"POST",
		body,
		false,
	);
	return response;
};

export const receive = async ({
	assetId,
	amount,
}: { assetId: string; amount: number }): Promise<InvoiceInfo> => {
	const body: ReceiveBody = {
		asset_id: assetId,
		amt: amount,
	};
	return fetchFromApi("/wallet/receive", "POST", body);
};

export const sendStart = async ({
	invoice,
}: { invoice: string }): Promise<{
	funded_psbt: string;
	sighash_hex_to_sign: string;
}> => {
	const body: SendStartBody = {
		invoice,
	};
	return fetchFromApi("/wallet/send/start", "POST", body);
};

export const sendComplete = async ({
	psbt,
	signature_hex,
	sighash,
}: {
	psbt: string;
	signature_hex: string;
	sighash: string;
}): Promise<SendCompleteResponse> => {
	const body: SendCompleteBody = {
		psbt,
		signature_hex,
		sighash,
	};
	return fetchFromApi("/wallet/send/complete", "POST", body);
};

export const listBalances = async (): Promise<ListBalancesResponse> => {
	return fetchFromApi("/wallet/balances", "GET", {});
};

export const listTransfers = async (): Promise<HistoryTransaction[]> => {
	return fetchFromApi("/wallet/transfers", "GET", {});
};

export const listOrders = async (): Promise<Order[]> => {
	return fetchFromApi("/orders", "GET", {});
};

export const decodeInvoice = async ({
	address,
}: { address: string }): Promise<InvoiceInfo> =>
	fetchFromApi("/wallet/send/decode", "POST", { address });

export type SellAssetStartBody = {
	asset_id: string;
	amount_to_sell: number;
};

// TODO: refactor API types - use same types from backend
export type SellAssetStartResponse = {
	funded_psbt: string;
	change_output_index: number;
	passive_asset_psbts: string[];
	sighash_hex_to_sign: string;
};

export const sellAssetStart = async (body: SellAssetStartBody) =>
	fetchFromApi<SellAssetStartBody, SellAssetStartResponse>(
		"/wallet/sell/start",
		"POST",
		body,
	);

export type SellAssetCompleteBody = {
	psbt: string;
	sighash_hex: string;
	signature_hex: string;
	amount_sats_to_receive: number;
};

export type SellAssetCompleteResponse = {
	signed_virtual_psbt: string;
	modified_anchor_psbt: string;
};

export const sellAssetComplete = async (body: SellAssetCompleteBody) =>
	fetchFromApi<SellAssetCompleteBody, SellAssetCompleteResponse>(
		"/wallet/sell/complete",
		"POST",
		body,
	);

export type BuyAssetStartBody = {
	psbt: string;
	anchor_psbt: string;
};

export type BuyAssetStartResponse = {
	updated_virtual_psbt: string;
	updated_anchor_psbt: string;
};

export const buyAssetStart = async (body: BuyAssetStartBody) =>
	fetchFromApi<BuyAssetStartBody, BuyAssetStartResponse>(
		"/wallet/buy/start",
		"POST",
		body,
	);

export type BuyAssetCompleteBody = {
	psbt: string;
	anchor_psbt: string;
	sighash_hex: string;
	signature_hex: string;
	amount_sats_to_pay: number;
};

export type BuyAssetCompleteResponse = {
	signed_virtual_psbt: string;
	modified_anchor_psbt: string;
};

export const buyAssetComplete = async (body: BuyAssetCompleteBody) =>
	fetchFromApi<BuyAssetCompleteBody, BuyAssetCompleteResponse>(
		"/wallet/buy/complete",
		"POST",
		body,
	);
