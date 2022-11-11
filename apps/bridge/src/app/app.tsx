import { ThemeButton, ThemeProvider } from '@haqq/theme';
import { Header, Page } from '@haqq/ui-kit';
import {
  BridgeWidget,
  SupportedChain,
} from '../components/bridge-widget/bridge-widget';
import { BrowserRouter } from 'react-router-dom';

const networks: SupportedChain[] = [
  { id: '1', name: 'Ethereum Mainnet', icon: '' },
  { id: '56', name: 'Binance Smart Chain Mainnet', icon: '' },
  { id: '137', name: 'Polygon Mainnet', icon: '' },
];

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Page header={<Header rightSlot={<ThemeButton />} />}>
          <BridgeWidget
            isConnected={false}
            supportedChains={networks}
            from={networks[1]}
            to={networks[2]}
            balance={1000}
            sendAmount={10}
            receiveAmount={{ isPending: false, value: 9.9 }}
            fee={{ isPending: false, value: 0.01234 }}
            onDirectionChange={console.log}
            onSendAmountChange={function (amount: number): void {
              console.log('sendAmountChange');
            }}
            onRecipientAddressChange={function (address: string): void {
              console.log('onRecipientAddressChange');
            }}
            onTransferClick={function (): void {
              console.log('transfer click');
            }}
            onConnectClick={function (): void {
              console.log('connect click');
            }}
            onMaxButtonClick={function (): void {
              console.log('on max btn click');
            }}
            symbol="islm"
          />
        </Page>
      </ThemeProvider>
    </BrowserRouter>
  );
}
