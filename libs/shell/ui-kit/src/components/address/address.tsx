import {useState,useCallback} from 'react'
import { Tooltip } from "../tooltip/tooltip"
import { getFormattedAddress, useClipboard } from '@haqq/shared';
import { CopyIcon } from '../icons/icons';

export const Address = ({address}: {address: string}) => {
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

    return <Tooltip
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
}