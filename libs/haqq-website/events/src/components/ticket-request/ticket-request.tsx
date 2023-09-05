import { Heading } from "@haqq/haqq-website-ui-kit";
import { QRCodeSVG } from "qrcode.react";
interface ITicketRequest {
     meetup_id: string,
     fullname: string,
     company?: string,
     job_title?: string,
     email: string,
     ip: string,
     captcha_token: string,
     signature: string,
}

export const TickerRequest = ({qrData}: {qrData: string}) => {
    return  <div>
        <Heading level={3} className="mb-[16px] sm:mb-[24px]">
            Your ticket
        </Heading>
        <div className="relative aspect-square w-fit p-4 bg-white">
            <QRCodeSVG
            value={qrData}
            size={200}
            bgColor="#ffffff"
            fgColor="#0D0D0E"
            markerEnd="round"
            markerHeight={100}
            />
        </div>
  </div>
    
}