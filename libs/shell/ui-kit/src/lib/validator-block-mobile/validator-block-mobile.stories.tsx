import { ValidatorBlockMobile as ValidatorBlockMobileComponent } from './validator-block-mobile';

export default {
  title: 'shell/ui-kit/validator-block-mobile',
};

export const Default = () => {
  return (
    <ValidatorBlockMobileComponent
      delegation="11100"
      undelegate="100"
      isDelegateDisabled={false}
      isGetRewardDisabled={false}
      isUndelegateDisabled={false}
      onDelegateClick={() => {
        console.log('delegate');
      }}
      onGetRewardClick={() => {
        console.log('get reward');
      }}
      onUndelegateClick={() => {
        console.log('undelegate');
      }}
      rewards="100"
    />
  );
};
