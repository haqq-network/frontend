import { InfoBlock as InfoBlockComponent } from './info-block';

export default {
  title: 'shell/ui-kit/info-block',
  parameters: {
    layout: 'centered',
  },
};

export const Default = () => {
  return (
    <InfoBlockComponent title="Reward">
      {`${(123030299).toLocaleString()} ISLM`}
    </InfoBlockComponent>
  );
};
