export default function InstructorDashboard() {
  return (
    <section className="w-full flex justify-center items-center mt-10">
      <div className="w-[80%]">
        <h1 className="text-2xl">Instructor Dashboard</h1>
        <div className="grid grid-cols-3 gap-8 mt-4">
          <div className="bg-white shadow-2xl p-4 rounded-sm text-xl text-violet-900">
            <h3>My total courses</h3>
            <p>2</p>
          </div>
          <div className="bg-white shadow-2xl p-4 rounded-sm text-xl text-green-600">
            <h3>Total student enrolled</h3>
            <p>400</p>
          </div>
          <div className="bg-white shadow-2xl p-4 rounded-sm text-xl text-red-600">
            <h3>Completed Courses</h3>
            <p>2</p>
          </div>
        </div>
      </div>
    </section>
  );
}
