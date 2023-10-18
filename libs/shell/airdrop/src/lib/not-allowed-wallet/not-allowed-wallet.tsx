export const NotAllowedWallet = () => {
  return (
    <div className="m-auto flex flex-col items-center gap-[48px]">
      <div className="font-clash text-center text-[24px] leading-[30px] text-[#E3A13F]">
        Unfortunately your address is not in the list of recovered addresses
        from Galxe
      </div>
      <div className="m-auto max-w-[800px] rounded-[8px] bg-[#212122] pb-[32px] pl-[28px] pr-[28px] pt-[32px] text-[16px] font-[400] text-white">
        <div className="font-guise">
          Your address is not part of the retrieved from Galxe's list during the
          3rd wave or if you've already specified a HAQQ wallet previously, you
          are not eligible for an address update through this portal. We
          appreciate your understanding and cooperation
        </div>

        <div className="font-guise mt-[24px]">
          If you've already specified a HAQQ wallet address, this decision is
          final. We've clearly instructed to provide the primary HAQQ wallet
          address
        </div>
      </div>
    </div>
  );
};
