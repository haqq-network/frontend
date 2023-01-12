import { useCallback, useEffect } from 'react';
import {
  hexZeroPad,
  Interface,
  LogDescription,
  formatEther,
} from 'ethers/lib/utils';
import { useState } from 'react';
import { Card } from '../Card/Card';
import { Heading } from '../Typography/Typography';
import { useTransaction } from 'wagmi';
import { getFormattedAddress } from '@haqq/shared';

const abi = [
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
const iface = new Interface(abi);

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

async function fetchLogs({
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
        parsedLog: iface.parseLog(logEntry),
      };
    });
}

export function DepositWithdrawalList({
  contractAddress,
  address,
}: {
  contractAddress: string;
  address: string;
}) {
  const [withdrawalLogsList, setWithdrawalLogsList] = useState<
    WithdrawalLogEntry[]
  >([]);
  const [isFetching, setFetching] = useState(false);

  const handleGetWithdrawalList = useCallback(
    async (contractAddress: string, address: string) => {
      setFetching(true);
      const logs = await fetchLogs({ contractAddress, address });
      console.log({ logs });
      setWithdrawalLogsList(logs);
      setFetching(false);
    },
    [],
  );

  useEffect(() => {
    handleGetWithdrawalList(contractAddress, address);
  }, [address]);

  return (
    <Card className="overflow-hidden max-w-lg mx-auto w-full">
      <div className="flex flex-col space-y-4">
        <div className="px-6 pt-6">
          <Heading level={3} className="uppercase">
            Withdrawals
          </Heading>
        </div>

        {/* <div>isFetching: {isFetching ? 'yes' : 'no'}</div> */}

        <div>
          {withdrawalLogsList.map((withdrawal, index) => {
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
  );
}

function DepositWithdrawalListItem({ withdrawal }: any) {
  console.log({ withdrawal });
  const tx = useTransaction({
    hash: withdrawal.transactionHash,
  });

  console.log({ tx });
  return (
    <div className="border-t px-6 py-2">
      <div className="text-sm text-gray-600">
        {getFormattedAddress(withdrawal.transactionHash, 12, 12)}
      </div>
      <div className="font-bold text-base">
        {`${Number.parseInt(
          formatEther(withdrawal.parsedLog.args.sumInWei),
          10,
        ).toLocaleString()}`}{' '}
        ISLM
      </div>
    </div>
  );
}
