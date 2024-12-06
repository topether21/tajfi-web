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

const fetchFromApi = async <B, R>(
	endpoint: string,
	method: "GET" | "POST",
	body: B,
	requireAuth = true,
) => {
	const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`;
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
	return data as R;
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

export const decodeInvoice = async ({
	address,
}: { address: string }): Promise<InvoiceInfo> =>
	fetchFromApi("/wallet/send/decode", "POST", { address });

type SellAssetStartResponse = {
	funded_psbt: string;
	change_output_index: number;
	passive_asset_psbts: string[];
	sighash_hex_to_sign: string;
};

export const sellAssetStart = async ({
	assetId,
	amountToSell,
}: {
	assetId: string;
	amountToSell: number;
}) => {
	const {
		funded_psbt,
		change_output_index,
		passive_asset_psbts,
		sighash_hex_to_sign,
	} = await fetchFromApi<
		{ asset_id: string; amount_to_sell: number },
		SellAssetStartResponse
	>("/wallet/sell/start", "POST", {
		asset_id: assetId,
		amount_to_sell: amountToSell,
	});
	return {
		fundedPsbt: funded_psbt,
		changeOutputIndex: change_output_index,
		passiveAssetPsbts: passive_asset_psbts,
		sighashHexToSign: sighash_hex_to_sign,
	};
};
