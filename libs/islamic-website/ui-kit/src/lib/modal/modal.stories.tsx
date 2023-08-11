import { Meta } from '@storybook/react';
import { Modal as ModalComponent, ModalCloseButton } from './modal';
import { Fragment, useState } from 'react';
import { Button } from '../button/button';

const meta: Meta<typeof ModalComponent> = {
  component: ModalComponent,
  title: 'islamic-website/ui-kit',
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
        <div className="flex max-w-[680px] flex-col items-center rounded-[20px] bg-[#15191EF2] px-[20px] py-[32px] pt-[20px] text-white lg:px-[40px] lg:pb-[48px]">
          <ModalCloseButton
            className="absolute right-[16px] top-[16px]"
            onClick={() => {
              setOpened(false);
            }}
          />

          <div className="flex flex-col gap-[24px] font-sans">
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
