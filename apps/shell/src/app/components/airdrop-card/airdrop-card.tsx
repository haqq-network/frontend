import { Address, Button, Heading, Modal, ModalCloseButton } from "@haqq/shell-ui-kit";
import { useState } from "react";

interface IProps {
    address: string;
    icon: string;
}

export const AirdropCard = ({address, icon}: IProps ) => {
    
    const [isRequestModalOpened, setRequestModalOpened] = useState<boolean>(false);
    
    return <div className="flex flex-col gap-[28px] items-start md:w-[410px]">
        <img src={icon} alt="icon" className="mb-[4px] h-[48px]" />

        <div>
            <div className="font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px] uppercase">Address</div>
            <div className="font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
                <Address address={address} />
            </div>
        </div>

        <div>
            <div className="font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px] uppercase">It is possible to get an airdrop</div>
            <div className="flex items-center font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
                <div className="text-[#01B26E]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
                        fill="currentColor"
                        />
                    </svg>
                </div>
                <div className="ml-[8px]">Yes</div>
            </div>
        </div>

        <div>
            <div className="font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px] uppercase">Amount airdrop</div>
            <div className="font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
                10000 aISLM
            </div>
        </div>

        <Button className="mt-[4px]" onClick={()=> {
            setRequestModalOpened(true);
        }}>Airdrop Request</Button>




        <Modal
            isOpen={isRequestModalOpened}
            onClose={() => {
                setRequestModalOpened(false);
            }}
        >
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-md w-[420px]">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <Heading className="text-black" level={3}>&nbsp;</Heading>
                        <ModalCloseButton
                            className="text-black"
                            onClick={() => {
                                setRequestModalOpened(false);
                            }}
                        />
                    </div>

                    <div className="flex flex-col break-words mt-0">
                        <div className="text-black text-[24px] font-[500]">Request was not completed</div>
                    </div>

                    <div className="flex flex-col space-y-2 break-words text-[12px] mt-[20px]">
                        <div className="text-black">Please retry the request later</div>
                    </div>

                    <div className="text-right mt-[24px]">
                        <Button
                            onClick={() => {
                                setRequestModalOpened(false);
                            }}
                            variant={3}
                            className="w-full"
                        >
                            Ok
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
}