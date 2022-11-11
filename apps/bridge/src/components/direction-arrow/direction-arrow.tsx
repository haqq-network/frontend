export function DirectionArrow({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="absolute top-[45%] left-[46.5%] flex justify-center items-center
      transition-transform hover:rotate-180 ease-in-out duration-500 cursor-pointer 
      dark:bg-slate-500 bg-slate-500/90 text-white rounded-full w-8 h-8"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
        />
      </svg>
    </div>
  );
}

export default DirectionArrow;
