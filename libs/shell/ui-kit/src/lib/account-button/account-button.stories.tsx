import { AccountButton as AccountButtonComponent } from './account-button';

export default {
  title: 'shell/ui-kit/account-button',
  layout: 'centered',
};

export const Default = () => {
  return (
    <AccountButtonComponent
      address="0x6D29Ed7cd2875507AA10bD20EECfb64Dc856532E"
      balance={{
        symbol: 'ISLM',
        value: 1000,
      }}
    />
  );
};
