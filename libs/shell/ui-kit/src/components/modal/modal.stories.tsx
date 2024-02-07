import { Fragment, useState } from 'react';
import { Meta } from '@storybook/react';
import {
  Modal as ModalComponent,
  ModalCloseButton,
  MobileHeading,
} from './modal';
import { Button } from '../button/button';

const meta: Meta<typeof ModalComponent> = {
  component: ModalComponent,
  title: 'shell/ui-kit',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Modal = () => {
  const [opened, setOpened] = useState(true);

  return (
    <Fragment>
      <Button
        onClick={() => {
          setOpened(true);
        }}
      >
        Open Modal
      </Button>
      <ModalComponent
        onClose={() => {
          setOpened(!opened);
        }}
        isOpen={opened}
      >
        <div className="text-haqq-black mx-auto h-screen w-screen bg-white p-[16px] sm:mx-auto sm:h-auto sm:w-auto sm:max-w-[430px] sm:rounded-[12px] sm:p-[36px]">
          <ModalCloseButton
            className="absolute right-[16px] top-[16px]"
            onClick={() => {
              setOpened(false);
            }}
          />

          <div className="font-guise flex flex-col gap-[24px]">
            <MobileHeading className="mt-[24px] sm:mt-[4px]">
              Modal
            </MobileHeading>

            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat
              error, qui odit adipisci quibusdam vero quam repellendus maiores
            </p>
            <p>
              Eveniet optio nesciunt veritatis deleniti aliquam quo! Ut nulla
              asperiores officia ducimus?
            </p>
          </div>
        </div>
      </ModalComponent>
    </Fragment>
  );
};
