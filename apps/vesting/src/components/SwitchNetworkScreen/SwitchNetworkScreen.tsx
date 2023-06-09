import { ReactElement } from 'react';
import { useNetwork } from 'wagmi';
import { useOnboarding } from '../../OnboardingContainer';
import { Button } from '../Button/Button';
import { AlertWithDetails } from '../modals/AlertWithDetails/AlertWithDetails';
import { Heading, Text } from '../Typography/Typography';
import { toHex } from 'viem';

function SwitchNetworkNetworkContainer({
  networkName,
}: {
  networkName?: string;
}) {
  return (
    <div className="z-10 flex w-full flex-1 flex-col items-center justify-center space-y-3 rounded-md bg-white px-6 py-8 shadow-lg md:max-w-[200px] md:py-6">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary h-8 w-8"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 0C15.3135 0 18.3137 1.34323 20.4852 3.51475C22.6311 5.6606 23.9679 8.61549 23.9992 11.8822V11.889L23.9996 11.9336L24 11.9996L23.9992 12.1102V12.1174C23.9679 15.3841 22.6311 18.3386 20.4852 20.4845C18.3137 22.656 15.3139 23.9992 12 23.9992C8.68646 23.9992 5.68628 22.656 3.51475 20.4845C1.34323 18.313 0 15.3128 0 11.9992C0 8.68571 1.34323 5.6859 3.51475 3.51438C5.68628 1.34286 8.68646 0 12 0ZM18.897 6.89662C19.3519 6.89662 19.7932 6.95665 20.2134 7.06802C18.9759 5.86711 17.2884 5.12754 15.4275 5.12754C13.5297 5.12754 11.8116 5.89656 10.5684 7.14012C9.32486 8.38369 8.55584 10.1018 8.55584 11.9996C8.55584 13.8974 9.32486 15.6156 10.5684 16.8587C11.812 18.1023 13.5301 18.8713 15.4275 18.8713C17.2884 18.8713 18.9763 18.1318 20.2134 16.9308C19.7936 17.0426 19.3523 17.1022 18.8974 17.1022C17.4885 17.1022 16.2124 16.531 15.2894 15.6076C14.3659 14.6842 13.7948 13.4082 13.7948 11.9992C13.7948 10.5903 14.3659 9.31429 15.2894 8.39086C16.212 7.46819 17.4877 6.89662 18.897 6.89662ZM21.3026 9.59403C20.6868 8.97867 19.8363 8.59775 18.8966 8.59775C17.957 8.59775 17.1064 8.97867 16.4907 9.59403C15.8749 10.2098 15.4944 11.0603 15.4944 12C15.4944 12.9397 15.8753 13.7902 16.4907 14.406C17.1064 15.0213 17.957 15.4023 18.8966 15.4023C19.8363 15.4023 20.6868 15.0213 21.3026 14.406C21.9179 13.7902 22.2989 12.9397 22.2989 12L22.2985 11.9562C22.2872 11.0335 21.9085 10.2 21.3026 9.59403ZM15.4272 3.42679C16.4959 3.42679 17.5187 3.62235 18.4625 3.97986C16.6953 2.55433 14.4471 1.70075 12 1.70075C9.15611 1.70075 6.58101 2.85371 4.71717 4.71717C2.85371 6.58063 1.70075 9.15573 1.70075 11.9996C1.70075 14.8439 2.85333 17.4186 4.71717 19.2824C6.58101 21.1459 9.15573 22.2989 12 22.2989C14.4475 22.2989 16.6953 21.4453 18.4625 20.0194C17.5187 20.3769 16.4959 20.5725 15.4272 20.5725C13.0601 20.5725 10.9165 19.6128 9.36563 18.0615C7.81438 16.5103 6.85472 14.3671 6.85472 12C6.85472 9.63292 7.81438 7.48933 9.36563 5.93809C10.9165 4.38646 13.0601 3.42679 15.4272 3.42679Z"
          fill="currentColor"
        />
      </svg>

      <Text color="light" className="text-center">
        {networkName ?? 'unknown'}
      </Text>
    </div>
  );
}

export function SwitchNetworkScreen(): ReactElement {
  const {
    errors: { switchNetworkError },
    clearError,
    switchNetwork,
  } = useOnboarding();
  const { chain: currentChain, chains } = useNetwork();
  console.log({ currentChain, chains });

  return (
    <div className="flex flex-col space-y-8">
      <Heading level={2}>Switch network</Heading>

      <div>
        <Text color="light">
          To continue you should switch to our network. Use button bellow to do
          that.
        </Text>
      </div>

      <div className="mt-[24px] flex flex-col items-center justify-between md:flex-row">
        <SwitchNetworkNetworkContainer
          networkName={currentChain ? toHex(currentChain.id) : 'unknown'}
        />
        <div className="flex-1">
          <svg
            className="z-10 my-5 ml-[-10%] w-[120%] origin-center rotate-[90deg] text-gray-400 md:my-0 md:rotate-[0deg]"
            width="191"
            height="32"
            viewBox="0 0 191 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="hidden md:block"></g>
            <g className="">
              <path
                d="M190.75 16.75H111.5V16.74H190.75V16.75Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="6 6"
              />
              <path
                d="M80.5 16.75H0.25V16.74H80.5V16.75Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="6 6"
              />
              <path
                d="M96 31.5C104.56 31.5 111.5 24.5604 111.5 16C111.5 7.43959 104.56 0.5 96 0.5C87.4396 0.5 80.5 7.43959 80.5 16C80.5 24.5604 87.4396 31.5 96 31.5Z"
                stroke="currentColor"
              />
              <path
                d="M93.5 22L99.5 16L93.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        </div>
        <SwitchNetworkNetworkContainer
          networkName={chains.length > 0 ? toHex(chains[0].id) : 'unknown'}
        />
      </div>

      <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        <div className="flex flex-row space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="text-primary mt-[2px] h-[20px] w-[20px] flex-none"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
          </svg>
          <div>
            <Text color="light">
              Switching networks will cancel all pending confirmation
            </Text>
          </div>
        </div>
        <div className="flex-none">
          <Button onClick={switchNetwork} className="min-w-[180px]">
            Switch network
          </Button>
        </div>
      </div>

      <AlertWithDetails
        isOpen={switchNetworkError !== undefined}
        title="Switch network error"
        message="Something went wrong and we can't switch network"
        details={switchNetworkError?.message}
        onClose={() => {
          clearError('switchNetworkError');
        }}
      />
    </div>
  );
}
