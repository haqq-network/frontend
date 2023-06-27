import { Heading, Text } from '../../Typography/Typography';
import { Button } from '../../Button/Button';
import { Modal, ModalCloseButton } from '../Modal/Modal';
import { useToggle } from '../../../hooks/useToggle';

export interface AlertWithDetailsProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: string;
  onClose: () => void;
}

export function AlertWithDetails({
  onClose,
  isOpen,
  title,
  message,
  details,
}: AlertWithDetailsProps) {
  const [isDetailsOpen, toggleDetailsOpen] = useToggle(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-md">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={3}>{title}</Heading>
            {onClose && <ModalCloseButton onClick={onClose} />}
          </div>

          <div>
            <Text>{message}</Text>
          </div>

          {details && isDetailsOpen && (
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <code className="block max-w-full overflow-auto text-xs text-gray-500">
                {details}
              </code>
            </div>
          )}

          {details && (
            <div className="flex flex-row items-center justify-between">
              {details && (
                <div>
                  <button
                    onClick={toggleDetailsOpen}
                    className="hover:text-primary text-sm leading-6 text-gray-700 underline underline-offset-2 transition-colors duration-150"
                  >
                    {isDetailsOpen ? 'Hide details' : 'Show details'}
                  </button>
                </div>
              )}
              {onClose && (
                <div>
                  <Button onClick={onClose} className="min-w-[100px]">
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
