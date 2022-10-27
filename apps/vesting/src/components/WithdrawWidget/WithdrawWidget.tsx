import { useCallback, useState } from 'react';
import { Card } from '../Card/Card';
import { WithdrawMarkup } from '../WithdrawMarkup/WithdrawMarkup';

export function WithdrawWidget() {
  const [isWithdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [isTransferPending, setTransferPending] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  const handleSuccessState = useCallback(() => {
    setTransferPending(true);
    setTimeout(() => {
      setTransferPending(false);
    }, 5000);
    setWithdrawSuccess(true);
  }, []);

  const handleErrorState = useCallback(() => {
    setTransferPending(true);
    setTimeout(() => {
      setTransferPending(false);
    }, 5000);
    setWithdrawSuccess(false);
    setError(true);
  }, []);

  return (
    <Card className="overflow-hidden max-w-lg mx-auto w-full">
      <div className="p-6 flex flex-col space-y-4">
        {isTransferPending ? (
          <WithdrawMarkup
            mainText="Please wait while your request is being processed..."
            headingText="2nd state pending"
            isTransferPending={true}
            onClick={handleErrorState}
            fill
            disabled
          />
        ) : isWithdrawSuccess ? (
          <WithdrawMarkup
            mainText="Funds received successfully!"
            headingText="3rd state success"
            isWithdrawSuccess={true}
            onClick={handleErrorState}
            fill
          />
        ) : isError ? (
          <WithdrawMarkup
            mainText="Something went wrong..."
            headingText="4th state error"
            isError={true}
            onClick={handleSuccessState}
            fill
          />
        ) : (
          <WithdrawMarkup
            mainText="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestias adipisci commodi"
            headingText="1st state default"
            onClick={handleSuccessState}
            fill
          />
        )}
      </div>
    </Card>
  );
}
