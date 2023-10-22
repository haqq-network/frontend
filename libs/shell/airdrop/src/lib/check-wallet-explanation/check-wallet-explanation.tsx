export const CheckWalletExplanation = () => {
  return (
    <div className="m-auto rounded-[8px] bg-[#212122] pb-[32px] pl-[28px] pr-[28px] pt-[32px] text-[16px] font-[400] text-white">
      <div className="font-guise">
        This page is specially designed for users who participated in the 3rd
        Wave of the HAQQ Expedition on Galxe, but whose responses to the "MAIN
        HAQQ Wallet" prompt weren't saved in Galxe. To change the address, you
        must log in under the same wallet address as you passed the 3rd Wave of
        the HAQQ Expedition on Galxe.
      </div>

      <div className="font-clash mt-[24px] text-[20px]">
        Eligibility for Address Update
      </div>

      <div className="font-guise mt-[12px]">
        Participants whose main wallet address responses went missing during the
        3rd Wave. Participants who didn’t specify their wallet address during
        the 3rd Wave.
      </div>
    </div>
  );
};
