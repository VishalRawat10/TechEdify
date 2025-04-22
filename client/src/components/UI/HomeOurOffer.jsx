export function HomeOurOffer({ img, heading, description }) {
  return (
    <div className="rounded-lg bg-white dark:bg-[var(--dark-bg-2)] w-full md:w-[calc(50%-16px)] flex justify-center items-center gap-2 p-4 shadow hover:shadow-md transition-shadow duration-300">
      <img src={img} alt={heading} className="h-12" />
      <div>
        <p className="font-semibold text-sm mb-1">{heading}</p>
        <p className="text-[12px] opacity-80 text-justify">{description}</p>
      </div>
    </div>
  );
}
