import AuthInput from "../components/UI/AuthInput";

export default function Signup() {
  return (
    <main className="bg-[var(--bg-primary)] dark:bg-[var(--dark-bg)] w-full h-[calc(100vh-var(--header-h))] flex items-center justify-center">
      <div className="flex items-center justify-center  w-[40rem] h-[27rem] shadow-2xl dark:shadow-white/10">
        <div className="w-1/2 bg-[var(--primary)] h-full flex items-center justify-center">
          <img src="/images/signup.png" alt="" className="w-2/3" />
        </div>
        <div className="bg-[var(--card)] h-full dark:bg-[var(--dark-card)] w-1/2 flex flex-col justify-center gap-4 px-4 ">
          <h1 className="text-2xl">Create Account</h1>
          <form className=" text-sm">
            <AuthInput
              label="fullname"
              type="text"
              placeholder="eg. Jane Doe"
            />
          </form>
        </div>
      </div>
    </main>
  );
}
