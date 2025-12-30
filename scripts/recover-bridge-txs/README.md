# Bridge ETH from CSV Script

This script reads addresses from a CSV file and bridges ETH from Sepolia (L1) to a target L2 chain using the Optimism L1StandardBridge contract.

## Features

- **Automatic Grouping**: Addresses from the 'From' column are automatically grouped and amounts are summed
- **One Transaction Per Address**: If an address appears multiple times in the CSV, all amounts are summed and bridged in a single transaction
- **Sepolia Network**: Uses Sepolia testnet with default RPC endpoint
- **L1 to L2 Bridging**: Uses `bridgeETHTo` method from L1StandardBridge to bridge ETH to L2

## Prerequisites

- Node.js and pnpm installed
- A private key OR seed phrase (mnemonic) with sufficient ETH balance on Sepolia
- L1 Standard Bridge contract address on Sepolia
- CSV file with 'From' and 'Amount' columns

## Usage

### Using Private Key

```bash
PRIVATE_KEY=0x... BRIDGE_ADDRESS=0x611bc60e604803b4f064810b4630290515bfba8c pnpm exec ts-node scripts/send-eth-from-csv.ts /path/to/export-transaction-list-1767107237768.csv
```

### Using Seed Phrase (Mnemonic)

```bash
MNEMONIC="word1 word2 word3 ... word12" BRIDGE_ADDRESS=0x611bc60e604803b4f064810b4630290515bfba8c pnpm exec ts-node scripts/send-eth-from-csv.ts /path/to/export-transaction-list-1767107237768.csv
```

### Using Seed Phrase with Account Index

```bash
MNEMONIC="word1 word2 word3 ... word12" ACCOUNT_INDEX=1 BRIDGE_ADDRESS=0x... pnpm exec ts-node scripts/send-eth-from-csv.ts /path/to/file.csv
```

### Dry Run (Preview Without Bridging)

```bash
PRIVATE_KEY=0x... BRIDGE_ADDRESS=0x... pnpm exec ts-node scripts/send-eth-from-csv.ts /path/to/file.csv --dry-run
# or
MNEMONIC="word1 word2 ..." BRIDGE_ADDRESS=0x... pnpm exec ts-node scripts/send-eth-from-csv.ts /path/to/file.csv --dry-run
```

## Options

- `--dry-run`: Preview what would be bridged without actually sending transactions

## Environment Variables

- `PRIVATE_KEY`: Private key of the wallet to send from (required if MNEMONIC not set)
- `MNEMONIC` or `SEED_PHRASE`: Seed phrase (12 or 24 words) to derive account from (required if PRIVATE_KEY not set)
- `ACCOUNT_INDEX`: Account index to use from mnemonic (default: 0). Use 0 for first account, 1 for second, etc.
- `BRIDGE_ADDRESS`: L1 Standard Bridge contract address on Sepolia (required)
  - Testethiq: `0x611bc60e604803b4f064810b4630290515bfba8c`

**Note**: You must provide either `PRIVATE_KEY` OR `MNEMONIC`/`SEED_PHRASE`, but not both.

## CSV Format

The CSV file must contain:

- `From` column: Address to send ETH to
- `Amount` column: Amount in format like "0.1 ETH"

Example:

```csv
Transaction Hash,Status,Method,Blockno,DateTime (UTC),From,From_Nametag,To,To_Nametag,Amount,Value (USD),Txn Fee
"0x...","Success","Transfer","9945548","2025-12-30 13:42:12","0xda80ffc27aa531e41b8d14603c8501dd20963da9","","0xfb30129241e7520e66b96426259e95359c3e2800","","0.1 ETH","$0.00","0.0000317"
```

## Examples

### Using Private Key

Bridge ETH to addresses from transaction list (amounts are automatically grouped and summed per address):

```bash
PRIVATE_KEY=0x1234567890abcdef... BRIDGE_ADDRESS=0x611bc60e604803b4f064810b4630290515bfba8c pnpm exec ts-node scripts/send-eth-from-csv.ts ~/Downloads/export-transaction-list-1767107237768.csv
```

### Using Seed Phrase

```bash
MNEMONIC="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about" BRIDGE_ADDRESS=0x611bc60e604803b4f064810b4630290515bfba8c pnpm exec ts-node scripts/send-eth-from-csv.ts ~/Downloads/export-transaction-list-1767107237768.csv
```

## How It Works

1. Reads the CSV file and extracts addresses from the 'From' column
2. **Groups addresses**: If the same address appears multiple times, it groups them together
3. **Sums amounts**: All amounts for the same address are summed into a single total
4. Bridges ETH using `L1StandardBridge.bridgeETHTo()` method:
   - Calls the bridge contract on Sepolia (L1)
   - Bridges ETH to the target L2 chain
   - Sends to the address from the 'From' column on L2
5. Uses Sepolia testnet with the default RPC endpoint

## Bridge Method

The script uses `bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData)` from the L1StandardBridge contract:

- `_to`: Destination address on L2 (from CSV 'From' column)
- `_minGasLimit`: 200000 (minimum gas for L2 execution)
- `_extraData`: Empty bytes (`0x`)

## Security Warning

⚠️ **Never commit your private key or seed phrase to version control!**

- Use environment variables
- Consider using a dedicated wallet with limited funds
- Test with small amounts first
- Keep your seed phrase secure - anyone with access can control all derived accounts
- When using mnemonic, the script uses account index 0 by default (first account)
