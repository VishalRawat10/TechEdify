export default function HomeTutorCard({ tutor }) {
  return (
    <div>
      <div className="w-full md:w-[20rem] flex items-center md:flex-col gap-4">
        <img
          src={tutor?.thumbnail?.url || "/images/User.png"}
          alt=""
          loading="lazy"
          className="object-cover aspect-square w-24 md:w-[10rem] rounded-full"
        />
        <div className="">
          <p className="mt-4 text-center md:text-lg font-semibold">
            {tutor?.fullname}
          </p>
          <p className="italic text-[12px] md:text-sm opacity-85">
            {'"' + tutor?.message + '"'}
          </p>
        </div>
      </div>
    </div>
  );
}
