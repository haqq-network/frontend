import { ReactElement } from 'react';
import { Text } from '../../Typography/Typography';

interface TransferOwnershipConfirmationProps {
  currentOwnerAddress: string;
  newOwnerAddress: string;
}

export function TransferOwnershipConfirmation({
  currentOwnerAddress,
  newOwnerAddress,
}: TransferOwnershipConfirmationProps): ReactElement {
  return (
    <div className="flex flex-col break-normal">
      <div>
        <Text>
          Are you sure you want to transfer deposit ownership from address&nbsp;
        </Text>
        <Text bold>&apos;{currentOwnerAddress}&apos;</Text>
        &nbsp;to&nbsp;
        <Text bold>&apos;{newOwnerAddress}&apos;</Text>
        &nbsp;?
        <div>
          <Text bold>THIS OPERATION IS IRREVERSIBLE</Text>
        </div>
      </div>
    </div>
  );
}
