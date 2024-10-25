type AuthBody = {
  public_key: string
  signature: string
}

type ReceiveBody = {
  asset_id: string
  amt: number
}

type SendStartBody = {
  invoice: string
}

type SendCompleteBody = {
  psbt: string
  signature_hex: string
}

export type AssetBalances = {
  [assetId: string]: {
    asset_genesis: {
      genesis_point: string
      name: string
      meta_hash: string
      asset_id: string
      asset_type: 'NORMAL' | 'COLLECTIBLE'
      output_index: number
    }
    balance: string
  }
}

type InvoiceInfo = {
  encoded: string
  asset_id: string
  asset_type: 'NORMAL' | 'COLLECTIBLE'
  amount: string
  group_key: string
  script_key: string
  internal_key: string
  tapscript_sibling: string
  taproot_output_key: string
  proof_courier_addr: string
  asset_version: string
  address_version: string
}

type ListBalancesResponse = {
  asset_balances: AssetBalances
}

type SendCompleteResponse = {
  transfer_timestamp: string
  anchor_tx_hash: string
  anchor_tx_height_hint: number
  anchor_tx_chain_fees: string
  inputs: Array<{
    anchor_point: string
    asset_id: string
    script_key: string
    amount: string
  }>
  outputs: Array<{
    anchor: object
    script_key: string
    script_key_is_local: boolean
    amount: string
    new_proof_blob: string
    split_commit_root_hash: string
    output_type: string
    asset_version: string
    lock_time: string
    relative_lock_time: string
    proof_delivery_status: string
  }>
  anchor_tx_block_hash: {
    incididunt_7: boolean
  }
}

const fetchFromApi = async <T>(endpoint: string, method: 'GET' | 'POST', body: T, requireAuth = true) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
  console.log(endpoint, apiUrl)

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (requireAuth) {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      throw new Error('No auth token found')
    }
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(apiUrl, {
    method,
    headers,
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()
  return data
}

export const auth = async (ordinalsPublicKey: string, signature = 'valid_signature') => {
  const body: AuthBody = {
    public_key: ordinalsPublicKey,
    signature,
  }
  const response: { token: string } = await fetchFromApi('/wallet/connect', 'POST', body, false)
  return response
}

export const receive = async ({ assetId, amount }: { assetId: string; amount: number }): Promise<InvoiceInfo> => {
  const body: ReceiveBody = {
    asset_id: assetId,
    amt: amount,
  }
  return fetchFromApi('/wallet/receive', 'POST', body)
}

export const sendStart = async ({
  invoice,
}: { invoice: string }): Promise<{
  funded_psbt: string
  sighash_hex_to_sign: string
}> => {
  const body: SendStartBody = {
    invoice,
  }
  return fetchFromApi('/wallet/send/start', 'POST', body)
}

export const sendComplete = async ({
  psbt,
  signature_hex,
}: {
  psbt: string
  signature_hex: string
}): Promise<SendCompleteResponse> => {
  const body: SendCompleteBody = {
    psbt,
    signature_hex,
  }
  return fetchFromApi('/wallet/send/complete', 'POST', body)
}

export const listBalances = async (): Promise<ListBalancesResponse> => {
  return fetchFromApi('/wallet/balances', 'GET', {})
}

export const decodeInvoice = async ({ address }: { address: string }): Promise<InvoiceInfo> => {
  return fetchFromApi('/wallet/send/decode', 'POST', { address })
}
