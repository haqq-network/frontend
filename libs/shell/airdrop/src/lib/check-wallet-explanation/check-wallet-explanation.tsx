export const CheckWalletExplanation = () => {
  return (
    <div className="m-auto rounded-[8px] bg-[#212122] pb-[32px] pl-[28px] pr-[28px] pt-[32px] text-[16px] font-[400] text-white">
      <div className="font-guise">
        This page is specially designed for users who participated in the 3rd
        wave on Axle but whose responses to the "Center HAQQ wallet" prompt
        weren't saved in Galxe. To change the address, you must log in under the
        same wallet address as you passed the 3rd wave on Galxe
      </div>

      <div className="font-clash mt-[24px] text-[20px]">Who Can Update</div>

      <div className="font-guise mt-[12px]">
        Users whose answers to the question of the main wallet address were lost
        on 3rd wave and users who didn't specify their wallet during the 3rd
        wave are eligible to update their address her
      </div>
    </div>
  );
};
