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
      <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <Heading level={3}>{title}</Heading>
            {onClose && <ModalCloseButton onClick={onClose} />}
          </div>

          <div>
            <Text>{message}</Text>
          </div>

          {details && isDetailsOpen && (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <code className="overflow-auto max-w-full block text-xs text-gray-500">
                {details}
              </code>
            </div>
          )}

          {(onClose || details) && (
            <div className="flex flex-row items-center justify-between">
              {details && (
                <div>
                  <button
                    onClick={toggleDetailsOpen}
                    className="text-sm leading-6 text-gray-700 underline hover:text-primary transition-colors duration-150 underline-offset-2"
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
