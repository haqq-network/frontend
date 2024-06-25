import cookie from 'cookie';

// Define the type for the data structure in wagmi.store
interface WagmiStore {
  state: {
    connections: {
      __type: string;
      value: [
        [
          string,
          {
            accounts: string[];
            chainId: number;
            connector: { id: string; name: string; type: string; uid: string };
          },
        ],
      ];
    };
    chainId: number;
    current: string;
  };
  version: number;
}

// Function to get chainId and wallet address from a cookie string
export function parseWagmiCookies(cookiesString: string | null | undefined): {
  chainId: number | null;
  walletAddress: string | null;
} {
  try {
    if (
      cookiesString === undefined ||
      cookiesString === null ||
      cookiesString === ''
    ) {
      console.warn('No cookie string');
      return { chainId: null, walletAddress: null };
    }
    // Parse the cookies
    const cookies = cookie.parse(cookiesString);

    // Check if the 'wagmi.store' key exists in the cookies
    if (!cookies['wagmi.store']) {
      console.warn('Missing key wagmi.store in cookies');
      return { chainId: null, walletAddress: null };
    }

    // Parse the 'wagmi.store' value as JSON
    const wagmiStore: WagmiStore = JSON.parse(cookies['wagmi.store']);

    const connectionsMap = new Map(wagmiStore.state.connections.value);
    const currentConnection = connectionsMap.get(wagmiStore.state.current);

    if (!currentConnection) {
      console.warn('No current connection found');
      return { chainId: null, walletAddress: null };
    }

    // Extract the chainId and address
    const chainId = currentConnection.chainId;
    const walletAddress = currentConnection.accounts[0];

    return { chainId, walletAddress };
  } catch (error) {
    console.error('Error extracting data:', error);
    return { chainId: null, walletAddress: null };
  }
}
