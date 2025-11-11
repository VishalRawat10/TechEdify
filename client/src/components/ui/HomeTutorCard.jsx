export default function HomeTutorCard({ tutor }) {
  return (
    <div className="w-full md:w-[20rem] flex md:items-center md:flex-col gap-4">
      <img
        src={tutor?.profileImage?.url || "/images/User.png"}
        alt="Tutor Image"
        loading="lazy"
        className="object-cover aspect-square w-24 md:w-[10rem] rounded-full"
      />
      <div className="">
        <p className="mt-4 md:text-center md:text-lg font-semibold">
          {tutor?.fullname}
        </p>
        <p className="italic text-[12px] md:text-sm opacity-85">
          {'"' + tutor?.message + '"'}
        </p>
      </div>
    </div>
  );
}
