import { WarningMessage as WarningMessageComponent } from './warning-message';

export default {
  title: 'shell/ui-kit/warning-message',
  parameters: {
    layout: 'centered',
  },
};

export const FirstVariant = () => {
  return (
    <WarningMessageComponent>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi magnam
      aliquam repudiandae in optio et voluptas explicabo magni? Labore,
      distinctio quo repellat ipsum amet iure neque natus et fuga rerum.
    </WarningMessageComponent>
  );
};
