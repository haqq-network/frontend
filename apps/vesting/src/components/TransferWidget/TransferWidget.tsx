import { Fragment, useCallback, useState } from 'react';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Heading, Text } from '../Typography/Typography';
import { Alert } from '../modals/Alert/Alert';
import { Confirm } from '../modals/Confirm/Confirm';
import { Input } from '../Input/Input';
import { TransferOwnershipConfirmation } from '../modals/TransferOwnershipConfirmation/TransferOwnershipConfirmation';

export function TransferWidget() {
  const [isWarningModalOpen, setWarningModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [isWarned, setWarned] = useState<boolean>(false);
  const [isTranferPending, setTranferPending] = useState<boolean>(false);

  const handleResetState = useCallback(() => {
    setWarningModalOpen(false);
    setConfirmModalOpen(false);
    setWarned(false);
  }, []);

  const handleDepositTransfer = useCallback(() => {
    setConfirmModalOpen(false);
    setTranferPending(true);
  }, []);

  const handleWarning = useCallback(() => {
    setWarningModalOpen(false);
    setWarned(true);
  }, []);

  return (
    <Card className="overflow-hidden max-w-lg mx-auto w-full">
      <div className="p-6 flex flex-col space-y-4">
        {!isWarned ? (
          <Fragment>
            <Heading level={3} className="uppercase">
              Transfer Start
            </Heading>
            <div>Here you can transfer the deposit rights to another user</div>
            <div>
              <Button
                fill
                onClick={() => {
                  setWarningModalOpen(true);
                }}
              >
                Transfer ownership
              </Button>
            </div>
          </Fragment>
        ) : (
          <>
            <Heading level={3} className="uppercase">
              New deposit owner
            </Heading>
            <div>Please insert new deposit owner ETH wallet</div>
            <Input
              required
              type="text"
              label="address required"
              placeholder="Insert your metamask wallet address..."
              state="normal"
              disabled={isTranferPending}
            />
            <Button
              fill
              onClick={() => {
                setConfirmModalOpen(true);
              }}
              disabled={isTranferPending}
            >
              Transfer ownership
            </Button>
          </>
        )}
        <Alert
          isOpen={isWarningModalOpen}
          title={'Message'}
          onClose={() => {
            setWarningModalOpen(false);
          }}
          onClick={handleWarning}
        >
          You are about to transfer deposit rights to another account. Are you
          sure you want to do this? Once it&apos;s done wallet&nbsp;
          <Text bold>0xe40be11F5e7C6bC390bC4caf0138229a82eF6664</Text>
          &nbsp;won&apos;t be able to withdraw ISLM from the deposit.
          <Text bold>
            You will also transfer the rights to all already made deposits.
          </Text>
        </Alert>
        <Confirm
          isOpen={isConfirmModalOpen}
          title={'WARNING'}
          onClose={handleResetState}
          buttonTitle={'Proceed'}
          onConfirm={handleDepositTransfer}
        >
          <TransferOwnershipConfirmation
            currentOwnerAddress={'0xe40be11F5e7C6bC390bC4caf0138229a82eF6664'}
            newOwnerAddress={'0x9a1FAb7FEd0b06045aAbEA2D1da73611F6DA2B07'}
          />
        </Confirm>
      </div>
    </Card>
  );
}
