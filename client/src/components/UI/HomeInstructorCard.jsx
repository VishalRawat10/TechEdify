export function HoomeInstructorCard() {
  return (
    <div>
      <div className="w-full md:w-[20rem] flex items-center md:flex-col gap-4">
        <img
          src="/images/teacher2.jpg"
          alt=""
          className="object-cover aspect-square w-24 md:w-[14rem] rounded-full"
        />
        <div className="">
          <p className="mt-4 md:text-lg font-semibold">Vishal Rawat</p>
          <p className="italic text-[12px] md:text-sm opacity-85">
            "Learning is a continuous journey—let's make it meaningful together.
            I'm here to guide you every step of the way!"
          </p>
        </div>
      </div>
    </div>
  );
}
