import { useCallback, useEffect, useMemo } from 'react';
import { useState } from 'react';
import { Card } from '../Card/Card';
import { Heading } from '../Typography/Typography';
import { formatDate } from '../../utils/format-date';
import { useNetwork } from 'wagmi';
import { getFormattedAddress, useSupportedChains } from '@haqq/shared';
import { pad, formatEther, decodeEventLog } from 'viem';

const withdrawABI = [
  {
    name: 'WithdrawalMade',
    type: 'event',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sumInWei',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'triggeredByAddress',
        type: 'address',
      },
    ],
  },
];
const depositABI = [
  {
    name: 'DepositMade',
    type: 'event',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiaryAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'depositId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sumInWeiDeposited',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'depositedBy',
        type: 'address',
      },
    ],
  },
];

type RawLogEntry = {
  address: string;
  blockNumber: string;
  data: string;
  gasPrice: string;
  gasUsed: string;
  logIndex: string;
  timeStamp: string;
  topics: string[];
  transactionHash: string;
  transactionIndex: string;
};

interface WithdrawalLogEntry extends RawLogEntry {
  parsedLog: any;
  type: 'withdraw' | 'deposit';
}

function getLogFetchUrl(contractAddress: string, address: string) {
  const getLogsUrl = new URL('https://explorer.haqq.network/api');
  getLogsUrl.searchParams.append('module', 'logs');
  getLogsUrl.searchParams.append('action', 'getLogs');
  getLogsUrl.searchParams.append('fromBlock', '14');
  getLogsUrl.searchParams.append('toBlock', 'latest');
  getLogsUrl.searchParams.append('address', contractAddress.toLowerCase());
  getLogsUrl.searchParams.append(
    'topic0',
    '0x565848cdb1369b8f0e5b0f6eb298a192163a96cf9f692903ec5f14cd2c0b7b65',
  );
  getLogsUrl.searchParams.append(
    'topic1',
    pad(address as `0x${string}`, { size: 32 }).toLowerCase(),
  );
  getLogsUrl.searchParams.append('topic0_1_opr', 'and');

  return getLogsUrl;
}

function getDepositLogsFetchUrl(contractAddress: string, address: string) {
  const getLogsUrl = new URL('https://explorer.haqq.network/api');
  getLogsUrl.searchParams.append('module', 'logs');
  getLogsUrl.searchParams.append('action', 'getLogs');
  getLogsUrl.searchParams.append('fromBlock', '14');
  getLogsUrl.searchParams.append('toBlock', 'latest');
  getLogsUrl.searchParams.append('address', contractAddress.toLowerCase());
  getLogsUrl.searchParams.append(
    'topic0',
    '0x7a96fe6dfcc54565c447f8c7708e3eadc4fc71f36ae29781f6617d3da8551c4b',
  );
  getLogsUrl.searchParams.append(
    'topic1',
    pad(address as `0x${string}`, { size: 32 }).toLowerCase(),
  );
  getLogsUrl.searchParams.append('topic0_1_opr', 'and');

  return getLogsUrl;
}

async function fetchWithdrawLogs({
  contractAddress,
  address,
}: {
  contractAddress: string;
  address: string;
}): Promise<WithdrawalLogEntry[]> {
  const logsFetchUrl = getLogFetchUrl(contractAddress, address);
  const response = await fetch(logsFetchUrl);
  const logs = await response.json();

  return (logs.result as RawLogEntry[])
    .map((entry) => {
      return {
        ...entry,
        topics: entry.topics.filter(Boolean),
      };
    })
    .map((logEntry) => {
      const parsedLog = decodeEventLog({
        abi: withdrawABI,
        data: logEntry.data,
        topics: logEntry.topics,
      } as any);

      return {
        ...logEntry,
        parsedLog,
        type: 'withdraw',
      };
    });
}

async function fetchDepositLogs({
  contractAddress,
  address,
}: {
  contractAddress: string;
  address: string;
}): Promise<WithdrawalLogEntry[]> {
  const logsFetchUrl = getDepositLogsFetchUrl(contractAddress, address);
  const response = await fetch(logsFetchUrl);
  const logs = await response.json();

  return (logs.result as RawLogEntry[])
    .map((entry) => {
      return {
        ...entry,
        topics: entry.topics.filter(Boolean),
      };
    })
    .map((logEntry) => {
      return {
        ...logEntry,
        parsedLog: decodeEventLog({ abi: depositABI, ...logEntry } as any),
        type: 'deposit',
      };
    });
}

function sortTxByBlock(array: WithdrawalLogEntry[]) {
  return array.sort((txA, txB) => {
    return Number(txA.blockNumber) - Number(txB.blockNumber);
  });
}

export function DepositWithdrawalList({
  contractAddress,
  address,
}: {
  contractAddress: string;
  address: string;
}) {
  const [withdrawLogsList, setWithdrawLogsList] = useState<
    WithdrawalLogEntry[]
  >([]);
  const [isFetching, setFetching] = useState(false);
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const symbol =
    chain?.nativeCurrency.symbol ?? chains[0]?.nativeCurrency.symbol;

  const handleGetTransactionList = useCallback(
    async (contractAddress: string, address: string) => {
      setFetching(true);
      const [withdrawLogs, depositLogs] = await Promise.all([
        fetchWithdrawLogs({ contractAddress, address }),
        fetchDepositLogs({ contractAddress, address }),
      ]);

      const sortedTransactions = sortTxByBlock([
        ...withdrawLogs,
        ...depositLogs,
      ]);

      // console.log({ withdrawLogs, depositLogs, sortedTransactions });
      setWithdrawLogsList(sortedTransactions);
      setFetching(false);
    },
    [],
  );

  useEffect(() => {
    handleGetTransactionList(contractAddress, address);
  }, [address, contractAddress, handleGetTransactionList]);

  if (isFetching || withdrawLogsList.length === 0) {
    return null;
  }

  return (
    <Card className="mx-auto w-full max-w-lg overflow-hidden">
      <div className="flex flex-col space-y-4">
        <div className="px-6 pt-6">
          <Heading level={3} className="uppercase">
            Transactions
          </Heading>
        </div>

        <div className="flex flex-col gap-y-[1px]">
          {withdrawLogsList.map((withdrawal, index) => {
            return (
              <DepositWithdrawalListItem
                key={`w_${index}`}
                withdrawal={withdrawal}
                symbol={symbol}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}

const EXPLORER_LINK = 'https://explorer.haqq.network';

function DepositWithdrawalListItem({
  withdrawal,
  symbol,
}: {
  symbol: string;
  withdrawal: WithdrawalLogEntry;
}) {
  const transactionTimestamp = useMemo(() => {
    return formatDate(new Date(Number(withdrawal.timeStamp) * 1000));
  }, [withdrawal.timeStamp]);

  return (
    <div className="h-[78px] border-t bg-white px-[16px] py-[14px] text-[12px] leading-[1.5em] transition-colors duration-150 ease-linear">
      <div className="flex justify-between">
        <div>
          {withdrawal.type === 'withdraw' && (
            <div className="flex w-fit select-none items-center justify-center rounded-[5px] bg-[#01B26E] px-[8px] py-[4px] text-xs font-[600] text-white">
              Withdraw
            </div>
          )}
          {withdrawal.type === 'deposit' && (
            <div className="flex w-fit select-none items-center justify-center rounded-[5px] bg-[#FCEDCE] px-[8px] py-[4px] text-xs font-[600] text-[#B26F1D]">
              Deposit created
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-[4px] text-[#8E8E8E]">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.224 8C14.224 10.9455 11.8361 13.3333 8.89063 13.3333C5.94511 13.3333 3.55729 10.9455 3.55729 8C3.55729 5.05448 5.94511 2.66667 8.89063 2.66667C11.8361 2.66667 14.224 5.05448 14.224 8ZM15.5573 8C15.5573 11.6819 12.5725 14.6667 8.89063 14.6667C5.20873 14.6667 2.22396 11.6819 2.22396 8C2.22396 4.3181 5.20873 1.33333 8.89063 1.33333C12.5725 1.33333 15.5573 4.3181 15.5573 8ZM9.55729 4C9.55729 3.63181 9.25882 3.33333 8.89063 3.33333C8.52244 3.33333 8.22396 3.63181 8.22396 4V7.64321L6.52083 8.77863C6.21447 8.98287 6.13169 9.39678 6.33593 9.70313C6.54016 10.0095 6.95407 10.0923 7.26043 9.88803L9.08231 8.67345C9.37905 8.47562 9.55729 8.14257 9.55729 7.78593V4Z"
              fill="currentColor"
            />
          </svg>
          <div className="font-[400]">{transactionTimestamp}</div>
        </div>
      </div>

      <div className="mt-[8px] flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <div className="flex items-center gap-[4px]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33333 2C2.60462 2 2 2.60462 2 3.33333V10.1146C2 10.6449 2.21107 11.1538 2.58594 11.5286L4.47135 13.4141C4.84622 13.7889 5.35514 14 5.88542 14H12.6667C13.3954 14 14 13.3954 14 12.6667V5.88542C14 5.35514 13.7889 4.84622 13.4141 4.47135L11.5286 2.58594C11.1538 2.21107 10.6449 2 10.1146 2H3.33333ZM4.27604 3.33333H10.1146C10.291 3.33333 10.4608 3.40352 10.5859 3.52865L11.724 4.66667H5.60938L4.27604 3.33333ZM3.33333 4.27604L4.66667 5.60938V11.724L3.52865 10.5859C3.40352 10.4608 3.33333 10.291 3.33333 10.1146V4.27604ZM6 6H12.6667V12.6667H6V6Z"
                fill="currentColor"
              />
            </svg>
            <a
              href={`${EXPLORER_LINK}/block/${withdrawal.blockNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-colors duration-150 hover:text-[#01B26E]"
            >
              {withdrawal.blockNumber}
            </a>
          </div>
          <div className="flex items-center gap-[4px]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 5.5H6C4.89543 5.5 4 6.39543 4 7.5V11.5C4 12.6046 4.89543 13.5 6 13.5H13C13.7571 13.5 14.4159 13.0793 14.7555 12.459C15.0207 11.9745 15.4477 11.5 16 11.5C16.5523 11.5 17.0128 11.9547 16.8766 12.4899C16.4361 14.2202 14.8675 15.5 13 15.5H6C3.79086 15.5 2 13.7091 2 11.5V7.5C2 5.29086 3.79086 3.5 6 3.5H13C14.8675 3.5 16.4361 4.77976 16.8766 6.51012C17.0128 7.04533 16.5523 7.5 16 7.5C15.4477 7.5 15.0207 7.02548 14.7555 6.54103C14.4159 5.92067 13.7571 5.5 13 5.5ZM18 10.5H11C10.2429 10.5 9.58407 10.9207 9.24447 11.541C8.97928 12.0255 8.55228 12.5 8 12.5C7.44772 12.5 6.98717 12.0453 7.12343 11.5101C7.56394 9.77976 9.13252 8.5 11 8.5H18C20.2091 8.5 22 10.2909 22 12.5V16.5C22 18.7091 20.2091 20.5 18 20.5H11C9.13252 20.5 7.56394 19.2202 7.12343 17.4899C6.98717 16.9547 7.44772 16.5 8 16.5C8.55228 16.5 8.97928 16.9745 9.24447 17.459C9.58406 18.0793 10.2429 18.5 11 18.5H18C19.1046 18.5 20 17.6046 20 16.5V12.5C20 11.3954 19.1046 10.5 18 10.5Z"
                fill="#2F2F2F"
              />
            </svg>
            <a
              href={`${EXPLORER_LINK}/tx/${withdrawal.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-colors duration-150 hover:text-[#01B26E]"
            >
              {getFormattedAddress(withdrawal.transactionHash)}
            </a>
          </div>
        </div>

        {withdrawal.type === 'withdraw' && (
          <div className="text-[14px] font-[700] uppercase leading-[18px]">
            {`${Number.parseInt(
              formatEther(BigInt(withdrawal.parsedLog.args['sumInWei'])),
              10,
            ).toLocaleString()}`}{' '}
            {symbol.toLocaleUpperCase()}
          </div>
        )}
        {withdrawal.type === 'deposit' && (
          <div className="text-[14px] font-[700] uppercase leading-[18px]">
            {`${Number.parseInt(
              formatEther(
                BigInt(withdrawal.parsedLog.args['sumInWeiDeposited']),
              ),
              10,
            ).toLocaleString()}`}{' '}
            {symbol.toLocaleUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
