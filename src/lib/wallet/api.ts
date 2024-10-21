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

const fetchFromApi = async <T>(endpoint: string, method: string, body: T) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    console.log(endpoint, apiUrl);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        throw new Error('No auth token found');
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(apiUrl, {
        method,
        headers,
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error('Failed to connect wallet');
    }

    return response.json();
};

export const auth = async (ordinalsPublicKey: string, signature = 'valid_signature') => {
    const body: AuthBody = {
        public_key: ordinalsPublicKey,
        signature,
    };
    const response: { token: string } = await fetchFromApi('/wallet/connect', 'POST', body);
    localStorage.setItem('authToken', response.token);
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

export const listBalances = async () => {
    return fetchFromApi('/wallet/balances', 'GET', {});
};

export const mockListBalances = async () => {
    return setTimeout(() => {
        return Promise.resolve([
            { asset_id: 'sats', balance: Math.floor(Math.random() * 1 / 100 * 10e8) },
        ]);
    }, 1000);
};
