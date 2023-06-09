import { useCallback, useEffect, useMemo } from 'react';
import {
  formatEther,
  hexZeroPad,
  Interface,
  LogDescription,
} from 'ethers/lib/utils';
import { useState } from 'react';
import { Card } from '../Card/Card';
import { Heading } from '../Typography/Typography';
import { formatDate } from '../../utils/format-date';

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
const withdrawIface = new Interface(withdrawABI);
const depositIface = new Interface(depositABI);

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
  parsedLog: LogDescription;
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
    hexZeroPad(address, 32).toLowerCase(),
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
    hexZeroPad(address, 32).toLowerCase(),
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
}) {
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
      return {
        ...logEntry,
        parsedLog: withdrawIface.parseLog(logEntry),
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
}) {
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
        parsedLog: depositIface.parseLog(logEntry),
        type: 'deposit',
      };
    });
}

function sortTxByBlock(array: any[]) {
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
  // const [isFetching, setFetching] = useState(false);

  const handleGetTransactionList = useCallback(
    async (contractAddress: string, address: string) => {
      // setFetching(true);
      const [withdrawLogs, depositLogs] = await Promise.all([
        fetchWithdrawLogs({ contractAddress, address }),
        fetchDepositLogs({ contractAddress, address }),
      ]);

      const sortedTransactions = sortTxByBlock([
        ...withdrawLogs,
        ...depositLogs,
      ]);

      console.log({ withdrawLogs, depositLogs, sortedTransactions });
      setWithdrawLogsList(sortedTransactions);
      // setFetching(false);
    },
    [],
  );

  useEffect(() => {
    handleGetTransactionList(contractAddress, address);
  }, [address, contractAddress, handleGetTransactionList]);

  return withdrawLogsList.length > 0 ? (
    <Card className="mx-auto w-full max-w-lg overflow-hidden">
      <div className="flex flex-col space-y-4">
        <div className="px-6 pt-6">
          <Heading level={3} className="uppercase">
            Transactions
          </Heading>
        </div>

        {/* <div>isFetching: {isFetching ? 'yes' : 'no'}</div> */}

        <div>
          {withdrawLogsList.map((withdrawal, index) => {
            return (
              <DepositWithdrawalListItem
                key={`w_${index}`}
                withdrawal={withdrawal}
              />
            );
          })}
        </div>
      </div>
    </Card>
  ) : null;
}

const EXPLORER_LINK = 'https://explorer.haqq.network';

function DepositWithdrawalListItem({ withdrawal }: any) {
  const transactionTimestamp = useMemo(() => {
    return formatDate(new Date(Number(withdrawal.timeStamp) * 1000));
  }, [withdrawal.timeStamp]);

  return (
    <div className="relative flex h-[110px] flex-col justify-between space-y-1.5 border-t border-gray-100 px-6 py-2 transition-colors duration-100 ease-linear hover:bg-gray-100/40">
      <div className="flex flex-row items-center justify-between">
        <div>
          {withdrawal.type === 'withdraw' && (
            <div className="select-none rounded-[2px] bg-[#04d484cc] px-[6px] py-[4px] text-xs text-white">
              Withdraw
            </div>
          )}
          {withdrawal.type === 'deposit' && (
            <div className="select-none rounded-[2px] bg-yellow-400/90 px-[6px] py-[4px] text-xs text-white">
              Deposit created
            </div>
          )}
        </div>
        <div>
          <div className="text-sm">{transactionTimestamp}</div>
        </div>
      </div>

      <div>
        <a
          href={`${EXPLORER_LINK}/tx/${withdrawal.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="hover:text-primary overflow-hidden text-ellipsis text-base leading-normal text-gray-600">
            {withdrawal.transactionHash}
          </div>
        </a>
      </div>

      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="text-sm">
            Block:{' '}
            <a
              href={`${EXPLORER_LINK}/block/${Number(withdrawal.blockNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              {Number(withdrawal.blockNumber)}
            </a>
          </div>
        </div>

        {withdrawal.type === 'withdraw' && (
          <div>
            <div className="text-lg font-medium">
              {`${Number.parseInt(
                formatEther(withdrawal.parsedLog.args.sumInWei),
                10,
              ).toLocaleString()}`}{' '}
              ISLM
            </div>
          </div>
        )}
        {withdrawal.type === 'deposit' && (
          <div>
            <div className="text-lg font-medium">
              {`${Number.parseInt(
                formatEther(withdrawal.parsedLog.args.sumInWeiDeposited),
                10,
              ).toLocaleString()}`}{' '}
              ISLM
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
