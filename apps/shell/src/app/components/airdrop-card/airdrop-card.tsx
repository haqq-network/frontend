import { getFormattedAddress, useClipboard } from "@haqq/shared";
import { Button, CopyIcon, Tooltip } from "@haqq/shell-ui-kit";
import { useCallback, useState } from "react";

interface IProps {
    address: string;
    icon: string;
}

export const AirdropCard = ({address, icon}: IProps ) => {
    const [isAddressCopied, setAddressCopy] = useState(false);

    const { copyText } = useClipboard();

    const handleAddressCopy = useCallback(async () => {
        if (address) {
        await copyText(address);
        setAddressCopy(true);

        setTimeout(() => {
            setAddressCopy(false);
        }, 2500);
        }
    }, [copyText, address]);
    
    return <div className="flex flex-col gap-[28px] items-start">
        <img src={icon} alt="icon" className="mb-[4px] h-[48px]" />

        <div>
            <div className="font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">Address</div>
            <div className="font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            <Tooltip
                  text={
                    isAddressCopied
                      ? 'Copied!'
                      : `Click to copy ${address}`
                  }
                >
                  <div
                    className="flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden font-sans text-[18px] font-[500] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                    onClick={handleAddressCopy}
                  >
                    <div>{getFormattedAddress(address, 9, 9, '...')}</div>

                    <CopyIcon className="mb-[-2px]" />
                  </div>
                </Tooltip>
            </div>
        </div>

        <div>
            <div className="font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">It is possible to get an airdrop</div>
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
            <div className="font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">Amount airdrop</div>
            <div className="font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
                10000 aISLM
            </div>
        </div>

        <Button className="mt-[4px]">Airdrop Request</Button>

    </div>
}