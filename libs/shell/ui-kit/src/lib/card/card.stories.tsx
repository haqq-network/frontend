import {
  Card,
  CardHeading,
  CardSubText,
  CardText,
  ProposalNumber,
  TimerText,
} from './card';

export default {
  title: 'shell/ui-kit/card',
  parameters: {
    layout: 'centered',
  },
};

export const Default = () => {
  return (
    <Card>
      <CardHeading>Card Heading</CardHeading>
      <CardSubText>Card Sub Text</CardSubText>
      <CardText>
        CARD TEXT.
        <br /> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure
        sunt, impedit distinctio, architecto quidem quo provident sapiente
        itaque, optio labore fugiat officia unde. Iusto voluptatibus vero,
        accusantium odit in esse.
      </CardText>
      <ProposalNumber>1234567890</ProposalNumber>
      <div className="inline-flex space-x-[4px]">
        <div className="inline-flex space-x-[4px]">
          <TimerText>999</TimerText>
          <TimerText>Gray</TimerText>
        </div>
        <div className="inline-flex space-x-[4px]">
          <TimerText color="white">999</TimerText>
          <TimerText color="white">White</TimerText>
        </div>
      </div>
    </Card>
  );
};
