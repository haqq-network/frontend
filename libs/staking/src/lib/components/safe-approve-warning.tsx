import { T } from '@tolgee/react';

export function SafeApproveWarning() {
  return (
    <div className="text-haqq-orange text-[12px] leading-[16px]">
      <T
        ns="staking"
        keyName="safe-approve-warning"
        defaultValue="Warning: In SAFE, the sender of the transaction (executing the
      transaction) must necessarily do <b>Approve</b> before proceeding."
        params={{
          b: <b />,
        }}
      />
    </div>
  );
}
