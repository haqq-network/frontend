#!/usr/bin/env tsx

/**
 * Script to bridge ETH from Sepolia to target L2 chain using L1StandardBridge
 *
 * Usage:
 *   PRIVATE_KEY=0x... BRIDGE_ADDRESS=0x... tsx scripts/send-eth-from-csv.ts <csv-file> [--dry-run]
 *   MNEMONIC="word1 word2 ..." BRIDGE_ADDRESS=0x... tsx scripts/send-eth-from-csv.ts <csv-file> [--dry-run]
 *
 * Options:
 *   --dry-run         Show what would be sent without actually sending
 *
 * Environment Variables:
 *   PRIVATE_KEY      Private key of the wallet to send from (required if MNEMONIC not set)
 *   MNEMONIC         Seed phrase (12 or 24 words) to derive account from (required if PRIVATE_KEY not set)
 *   ACCOUNT_INDEX    Account index to use from mnemonic (default: 0)
 *   BRIDGE_ADDRESS   L1 Standard Bridge contract address on Sepolia (required)
 *
 * Note: Addresses are automatically grouped by 'From' column and amounts are summed
 *       before bridging (one transaction per unique address)
 */

import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
} from 'viem';
import { privateKeyToAccount, mnemonicToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';

export const L1StandardBridgeAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_localToken', type: 'address' },
      { internalType: 'address', name: '_remoteToken', type: 'address' },
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint32', name: '_minGasLimit', type: 'uint32' },
      { internalType: 'bytes', name: '_extraData', type: 'bytes' },
    ],
    name: 'bridgeERC20To',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint32', name: '_minGasLimit', type: 'uint32' },
      { internalType: 'bytes', name: '_extraData', type: 'bytes' },
    ],
    name: 'bridgeETHTo',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_l1Token', type: 'address' },
      { internalType: 'address', name: '_l2Token', type: 'address' },
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint32', name: '_minGasLimit', type: 'uint32' },
      { internalType: 'bytes', name: '_extraData', type: 'bytes' },
    ],
    name: 'depositERC20To',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint32', name: '_minGasLimit', type: 'uint32' },
      { internalType: 'bytes', name: '_extraData', type: 'bytes' },
    ],
    name: 'depositETHTo',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

interface AddressInfo {
  address: string;
  totalAmount: bigint;
  transactionCount: number;
}

// Parse command line arguments
const args = process.argv.slice(2);
let csvFile = args[0];
const dryRun = args.includes('--dry-run');

if (!csvFile) {
  console.error('Error: CSV file path is required');
  console.error(
    'Usage: PRIVATE_KEY=0x... BRIDGE_ADDRESS=0x... tsx scripts/send-eth-from-csv.ts <csv-file> [--dry-run]',
  );
  console.error(
    '   or: MNEMONIC="word1 word2 ..." BRIDGE_ADDRESS=0x... tsx scripts/send-eth-from-csv.ts <csv-file> [--dry-run]',
  );
  console.error('\nExamples:');
  console.error('  scripts/send-eth-from-csv.ts export-transaction-list.csv');
  console.error('  scripts/send-eth-from-csv.ts ./export-transaction-list.csv');
  console.error(
    '  scripts/send-eth-from-csv.ts scripts/export-transaction-list.csv',
  );
  process.exit(1);
}

// Resolve file path: if not absolute, try relative to current directory, then scripts folder
if (!path.isAbsolute(csvFile)) {
  // First try relative to current working directory
  const cwdPath = path.resolve(process.cwd(), csvFile);
  if (fs.existsSync(cwdPath)) {
    csvFile = cwdPath;
  } else {
    // Try in scripts folder (same folder as this script)
    const scriptsDir = path.join(process.cwd(), 'scripts');
    const scriptsPath = path.join(scriptsDir, csvFile);
    if (fs.existsSync(scriptsPath)) {
      csvFile = scriptsPath;
    } else {
      // Use resolved path (will show error if file doesn't exist)
      csvFile = path.resolve(csvFile);
    }
  }
}

const privateKey = process.env.PRIVATE_KEY;
const mnemonic = process.env.MNEMONIC || process.env.SEED_PHRASE;
const accountIndex = parseInt(process.env.ACCOUNT_INDEX || '0', 10);
const bridgeAddress = process.env.BRIDGE_ADDRESS;

if (!privateKey && !mnemonic) {
  console.error(
    'Error: Either PRIVATE_KEY or MNEMONIC/SEED_PHRASE environment variable is required',
  );
  console.error('  PRIVATE_KEY=0x... (private key in hex format)');
  console.error(
    '  MNEMONIC="word1 word2 word3 ..." (12 or 24 word seed phrase)',
  );
  process.exit(1);
}

if (privateKey && mnemonic) {
  console.error(
    'Error: Both PRIVATE_KEY and MNEMONIC are set. Please use only one.',
  );
  process.exit(1);
}

if (!bridgeAddress) {
  console.error('Error: BRIDGE_ADDRESS environment variable is required');
  console.error(
    'Example: BRIDGE_ADDRESS=0x611bc60e604803b4f064810b4630290515bfba8c',
  );
  process.exit(1);
}

// Use Sepolia chain with default RPC
const chain = sepolia;
const rpcUrl = sepolia.rpcUrls.default.http[0];

// Parse CSV and extract addresses
function parseCSV(filePath: string): AddressInfo[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `CSV file not found: ${filePath}\nMake sure the file exists in the current directory or scripts folder.`,
    );
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim());

  const fromIndex = headers.indexOf('From');
  const amountIndex = headers.indexOf('Amount');

  if (fromIndex === -1 || amountIndex === -1) {
    throw new Error('CSV must contain "From" and "Amount" columns');
  }

  const addressMap = new Map<string, bigint>();
  const transactionCounts = new Map<string, number>();

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV line (handling quoted values)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const fromAddress = values[fromIndex]?.replace(/"/g, '').trim();
    const amountStr = values[amountIndex]?.replace(/"/g, '').trim();

    if (!fromAddress || !amountStr) continue;

    // Parse amount (remove " ETH" suffix)
    const amountValue = amountStr.replace(' ETH', '').trim();
    const amountWei = parseEther(amountValue);

    // Aggregate amounts per address
    const currentTotal = addressMap.get(fromAddress) || 0n;
    addressMap.set(fromAddress, currentTotal + amountWei);

    const count = transactionCounts.get(fromAddress) || 0;
    transactionCounts.set(fromAddress, count + 1);
  }

  return Array.from(addressMap.entries()).map(([address, totalAmount]) => ({
    address: address as `0x${string}`,
    totalAmount,
    transactionCount: transactionCounts.get(address) || 0,
  }));
}

async function main() {
  console.log('📄 Reading CSV file:', csvFile);
  const addresses = parseCSV(csvFile);

  const totalTransactions = addresses.reduce(
    (sum, a) => sum + a.transactionCount,
    0,
  );
  console.log(
    `\n📊 Found ${addresses.length} unique addresses (grouped from ${totalTransactions} transactions)`,
  );
  console.log(`💡 Amounts are automatically summed per address`);

  // Create account from private key or mnemonic
  const account = privateKey
    ? privateKeyToAccount(privateKey as `0x${string}`)
    : mnemonicToAccount(mnemonic!, { accountIndex });

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });

  const senderAddress = account.address;
  console.log(`\n👤 Sender address: ${senderAddress}`);
  if (mnemonic) {
    console.log(`🔑 Using mnemonic (account index: ${accountIndex})`);
  } else {
    console.log(`🔑 Using private key`);
  }
  console.log(`🌐 Network: ${chain.name} (Chain ID: ${chain.id})`);
  console.log(`🔗 RPC URL: ${rpcUrl}`);
  console.log(`🌉 Bridge address: ${bridgeAddress}`);
  console.log(`📋 Method: bridgeETHTo (bridging to L2)`);

  if (dryRun) {
    console.log('\n🔍 DRY RUN MODE - No transactions will be sent\n');
  }

  // Calculate total amount needed
  const totalNeeded = addresses.reduce((sum, a) => sum + a.totalAmount, 0n);

  console.log(`\n💰 Total ETH needed: ${formatEther(totalNeeded)} ETH`);

  // Check balance
  const balance = await publicClient.getBalance({ address: senderAddress });
  console.log(`💵 Current balance: ${formatEther(balance)} ETH`);

  if (balance < totalNeeded) {
    console.error(
      `\n❌ Error: Insufficient balance. Need ${formatEther(totalNeeded)} ETH, have ${formatEther(balance)} ETH`,
    );
    process.exit(1);
  }

  console.log('\n🌉 Bridging ETH to L2...\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < addresses.length; i++) {
    const { address, totalAmount, transactionCount } = addresses[i];

    const groupedInfo =
      transactionCount > 1
        ? `(sum of ${transactionCount} transactions: ${formatEther(totalAmount)} ETH)`
        : '';

    console.log(
      `[${i + 1}/${addresses.length}] Bridging ${formatEther(totalAmount)} ETH to ${address} on L2 ${groupedInfo}`,
    );

    if (dryRun) {
      console.log(
        `   ✓ Would bridge ${formatEther(totalAmount)} ETH to ${address} using bridgeETHTo`,
      );
      successCount++;
      continue;
    }

    try {
      // Use bridgeETHTo to bridge ETH from L1 (Sepolia) to L2
      // bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData)
      const hash = await walletClient.writeContract({
        address: bridgeAddress as `0x${string}`,
        abi: L1StandardBridgeAbi,
        functionName: 'bridgeETHTo',
        args: [
          address as `0x${string}`, // _to: destination address on L2
          200000, // _minGasLimit: minimum gas for L2 execution
          '0x' as `0x${string}`, // _extraData: optional extra data
        ],
        value: totalAmount, // ETH amount to bridge
      });

      console.log(`   ✓ Bridge transaction sent: ${hash}`);

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });
      console.log(`   ✓ Confirmed in block ${receipt.blockNumber}`);

      successCount++;
    } catch (error) {
      console.error(
        `   ❌ Failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      failCount++;
    }

    // Small delay to avoid rate limiting
    if (i < addresses.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✅ Summary:`);
  console.log(`   Successful bridges: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(
    `   Total ETH bridged: ${formatEther(addresses.slice(0, successCount).reduce((sum, a) => sum + a.totalAmount, 0n))} ETH`,
  );
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
