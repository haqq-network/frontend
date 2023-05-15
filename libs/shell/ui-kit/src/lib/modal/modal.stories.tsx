import { Meta } from '@storybook/react';
import {
  Modal as ModalComponent,
  ModalCloseButton,
  MobileHeading,
} from './modal';
import { Fragment, useState } from 'react';
import { Button } from '../button/button';

export default {
  title: 'shell/ui-kit/modal',
  component: ModalComponent,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ModalComponent>;

export const Default = () => {
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
        <div className="h-screen w-screen bg-white p-[36px] sm:mx-auto sm:h-auto sm:w-auto sm:max-w-md sm:rounded-[12px]">
          <ModalCloseButton
            className="absolute right-[16px] top-[16px]"
            onClick={() => {
              setOpened(false);
            }}
          />

          <div className="flex flex-col gap-[24px] font-sans">
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
