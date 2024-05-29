import { Button } from '../../Button/Button';
import { Heading, Text } from '../../typography';
import { Modal, ModalCloseButton } from '../Modal/Modal';

export interface NoMetamaskAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnboarding: () => void;
}

export function NoMetamaskAlert({
  isOpen,
  onClose,
  onStartOnboarding,
}: NoMetamaskAlertProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto max-w-[640px] rounded-[24px] bg-white p-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={3}>Install MetaMask</Heading>
            <ModalCloseButton onClick={onClose} />
          </div>

          <div className="flex flex-col items-center space-y-6 space-y-reverse md:flex-row md:space-x-8 md:space-y-0">
            <div>
              <Text className="mb-2 block">
                It seems like you do not have the MetaMask wallet.
              </Text>
              <Text className="block">
                Don’t worry, we will redirect you to the MetaMask official
                website where you can install it. It’s absolutely secure. Then
                come back to proceed with the connection.
              </Text>

              <div className="mt-6">
                <Button onClick={onStartOnboarding}>Go to download page</Button>
              </div>
            </div>
            <div className="order-first md:order-last">
              <svg
                viewBox="0 0 187 175"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[120px] md:w-[180px]"
              >
                <path
                  d="M182.666 0L102.426 59.2662L117.347 24.3387L182.666 0Z"
                  fill="#E17726"
                />
                <path
                  d="M4.52148 0.0697021L69.6654 24.343L83.8338 59.7285L4.52148 0.0697021Z"
                  fill="#E27625"
                />
                <path
                  d="M150.374 126.042L185.839 126.716L173.445 168.747L130.17 156.853L150.374 126.042Z"
                  fill="#E27625"
                />
                <path
                  d="M36.6241 126.042L56.7539 156.853L13.5515 168.748L1.23242 126.716L36.6241 126.042Z"
                  fill="#E27625"
                />
                <path
                  d="M81.9072 50.7147L83.357 97.4422L39.9883 95.4726L52.3242 76.8953L52.4803 76.7161L81.9072 50.7147Z"
                  fill="#E27625"
                />
                <path
                  d="M104.642 50.1936L134.518 76.7181L134.673 76.8959L147.009 95.4732L103.65 97.4424L104.642 50.1936Z"
                  fill="#E27625"
                />
                <path
                  d="M58.0247 126.178L81.7053 144.596L54.1973 157.853L58.0247 126.178Z"
                  fill="#E27625"
                />
                <path
                  d="M128.98 126.175L132.728 157.853L105.297 144.595L128.98 126.175Z"
                  fill="#E27625"
                />
                <path
                  d="M105.902 142.859L133.738 156.314L107.845 168.598L108.114 160.479L105.902 142.859Z"
                  fill="#D5BFB2"
                />
                <path
                  d="M81.09 142.866L78.9649 160.346L79.1393 168.589L53.1855 156.314L81.09 142.866Z"
                  fill="#D5BFB2"
                />
                <path
                  d="M73.052 103.541L80.3261 118.801L55.5605 111.559L73.052 103.541Z"
                  fill="#233447"
                />
                <path
                  d="M113.948 103.542L131.522 111.559L106.676 118.798L113.948 103.542Z"
                  fill="#233447"
                />
                <path
                  d="M59.9182 126.022L55.9149 158.864L34.459 126.74L59.9182 126.022Z"
                  fill="#CC6228"
                />
                <path
                  d="M127.084 126.022L152.544 126.74L131.007 158.865L127.084 126.022Z"
                  fill="#CC6228"
                />
                <path
                  d="M147.638 93.6157L129.109 112.465L114.824 105.949L107.984 120.302L103.5 95.6203L147.638 93.6157Z"
                  fill="#CC6228"
                />
                <path
                  d="M39.3535 93.6155L83.4988 95.6204L79.015 120.302L72.174 105.951L57.9638 112.466L39.3535 93.6155Z"
                  fill="#CC6228"
                />
                <path
                  d="M38.1055 89.7477L59.0687 110.982L59.7952 131.944L38.1055 89.7477Z"
                  fill="#E27525"
                />
                <path
                  d="M148.916 89.7092L127.188 131.981L128.006 110.981L148.916 89.7092Z"
                  fill="#E27525"
                />
                <path
                  d="M82.4754 91.0406L83.3191 96.3417L85.4039 109.547L84.0636 150.108L77.7267 117.525L77.7246 117.188L82.4754 91.0406Z"
                  fill="#E27525"
                />
                <path
                  d="M104.514 90.9675L109.277 117.188L109.275 117.525L102.922 150.189L102.671 142.019L101.68 109.307L104.514 90.9675Z"
                  fill="#E27525"
                />
                <path
                  d="M129.868 110.138L129.159 128.351L107.045 145.55L102.574 142.397L107.585 116.631L129.868 110.138Z"
                  fill="#F5841F"
                />
                <path
                  d="M57.207 110.138L79.4131 116.632L84.4241 142.397L79.9536 145.55L57.8382 128.349L57.207 110.138Z"
                  fill="#F5841F"
                />
                <path
                  d="M48.9551 152.292L77.2476 165.674L77.1279 159.959L79.4951 157.885H107.497L109.95 159.952L109.769 165.663L137.882 152.326L124.202 163.61L107.66 174.951H79.2684L62.7372 163.564L48.9551 152.292Z"
                  fill="#C0AC9D"
                />
                <path
                  d="M103.876 141.079L107.876 143.899L110.22 162.57L106.828 159.71H80.1834L76.8555 162.627L79.1227 143.901L83.1243 141.079H103.876Z"
                  fill="#161616"
                />
                <path
                  d="M177.368 1.6405L187 30.4845L180.985 59.6486L185.268 62.9471L179.472 67.3613L183.828 70.7194L178.06 75.9633L181.601 78.5232L172.203 89.4796L133.657 78.2763L133.323 78.0976L105.545 54.707L177.368 1.6405Z"
                  fill="#763E1A"
                />
                <path
                  d="M9.63197 1.6405L81.4557 54.707L53.6781 78.0976L53.344 78.2763L14.7969 89.4796L5.39905 78.5232L8.93748 75.9652L3.17207 70.7194L7.51985 67.365L1.63723 62.9381L6.0821 59.6376L0 30.4856L9.63197 1.6405Z"
                  fill="#763E1A"
                />
                <path
                  d="M131.771 75.8263L172.614 87.6963L185.883 128.519L150.877 128.519L126.756 128.823L144.297 94.692L131.771 75.8263Z"
                  fill="#F5841F"
                />
                <path
                  d="M55.2297 75.8263L42.7012 94.6919L60.2452 128.823L36.1362 128.519H1.19141L14.3861 87.6965L55.2297 75.8263Z"
                  fill="#F5841F"
                />
                <path
                  d="M119.347 24.1439L107.923 54.943L105.498 96.5499L104.571 109.591L104.497 142.905H82.5018L82.4305 109.653L81.4999 96.5384L79.0745 54.943L67.6523 24.1439H119.347Z"
                  fill="#F5841F"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
