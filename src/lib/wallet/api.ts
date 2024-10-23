type AuthBody = {
    public_key: string;
    signature: string;
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
};

export type AssetBalances = {
    [assetId: string]: {
        asset_genesis: {
            genesis_point: string;
            name: string;
            meta_hash: string;
            asset_id: string;
            asset_type: string;
            output_index: number;
        };
        balance: string;
    };
}

type ListBalancesResponse = {
    asset_balances: AssetBalances;
}

const fetchFromApi = async <T>(endpoint: string, method: 'GET' | 'POST', body: T, requireAuth = true) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    console.log(endpoint, apiUrl);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (requireAuth) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error('No auth token found');
        }
        headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(apiUrl, {
        method,
        headers,
        ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
        throw new Error('Failed to connect wallet');
    }

    const data = await response.json();
    console.log('----> data', data);
    return data;
};

export const auth = async (ordinalsPublicKey: string, signature = 'valid_signature') => {
    const body: AuthBody = {
        public_key: ordinalsPublicKey,
        signature,
    };
    const response: { token: string } = await fetchFromApi('/wallet/connect', 'POST', body, false);
    return response;
};

export const receive = async ({ assetId, amount }: { assetId: string, amount: number }) => {
    const body: ReceiveBody = {
        asset_id: assetId,
        amt: amount,
    };
    return fetchFromApi('/wallet/receive', 'POST', body);
};

export const sendStart = async ({ invoice }: { invoice: string }) => {
    const body: SendStartBody = {
        invoice,
    };
    return fetchFromApi('/wallet/send/start', 'POST', body);
};

export const sendComplete = async ({ psbt }: { psbt: string }) => {
    const body: SendCompleteBody = {
        psbt,
    };
    return fetchFromApi('/wallet/send/complete', 'POST', body);
};

export const listBalances = async (): Promise<ListBalancesResponse> => {
    return fetchFromApi('/wallet/balances', 'GET', {});
};

type InvoiceInfo = {
    encoded: string;
    asset_id: string;
    asset_type: 'NORMAL' | "COLLECTIBLE";
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

export const decodeInvoice = async ({ address }: { address: string }): Promise<InvoiceInfo> => {
    return fetchFromApi('/wallet/send/decode', 'POST', { address });
};

