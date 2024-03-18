import { FALCONER_ENDPOINT } from '../../constants';

export interface EstimatedFeeRequest {
  chainId: string;
  bodyBytes: string;
  fromAddress: string;
  pubkey: string;
}

export interface EstimatedFeeResponse {
  fee: string;
  gas_price: string;
  gas_used: string;
}

export async function getEstimatedFee({
  chainId,
  bodyBytes,
  fromAddress,
  pubkey,
}: EstimatedFeeRequest): Promise<EstimatedFeeResponse> {
  const requestUrl = new URL('/tx/simulate', FALCONER_ENDPOINT);

  const response = await fetch(requestUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chain_id: chainId,
      b64_body_bytes: bodyBytes,
      from_addr: fromAddress,
      pub_key: pubkey,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Transaction simulation failed. Status: ${response.status}`,
    );
  }

  const responseJson: EstimatedFeeResponse = await response.json();

  return responseJson;
}
