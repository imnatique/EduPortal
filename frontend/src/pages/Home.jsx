import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import edugif from "/edugif.gif";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="w-full flex flex-col md:flex-row gap-5 items-center lg:px-[10%] px-[5%] my-10">
      {/* Left Section Image */}
      <div className="w-full md:w-1/2 flex justify-start mt-10">
        <img
          src={edugif}
          alt="Gif"
          className="w-100% h-auto sm:w-250 sm:h-auto md:w-350 md:h-auto lg:w-[450px] lg:h-auto xl:w-[500px] xl:h-auto rounded-lg"
        />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 md:text-left flex flex-col items-center md:items-start mt-10">
        <h1 className="lora-font text-justify text-3xl sm:text-5xl md:text-6xl text-black">
          Welcome to <span className="text-red">Edu</span>Portal!
        </h1>

        <h3 className="sedan-regular text-black text-xl text-justify sm:text-2xl mt-3">
          Your School's Ultimate Management Solution.
        </h3>

        <h5 className="text-lg sm:text-xl mt-6 sedan-regular md:text-justify text-black">
          Empowering schools with smart digital tools for seamless management
          and better learning experiences.
        </h5>

        <h5 className="text-lg sm:text-xl text-black sedan-regular mt-2">
          Say goodbye to paperwork and hello to efficient, automated workflows.
        </h5>

        {currentUser ? (
          <p className="mt-8 text-lg sedan-regular text-black">
            Welcome{" "}
            <Link to="/profile">
              <span className="cursor-pointer underline text-red">
                {currentUser.username}
              </span>
            </Link>
            , how can we assist you today?
          </p>
        ) : (
          <h6 className="text-lg sm:text-xl mt-5 sedan-regular px-2">
            Sign up now and experience the future of school management.
          </h6>
        )}

        {!currentUser && (
          <Link
            to="/sign-in"
            className="bg-red text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80 mt-5 w-40 text-center font-semibold"
          >
            Sign In
          </Link>
        )}

        {!currentUser && (
          <div className="flex gap-2 mt-4 mb-5 text-sm sm:text-base">
            <p>Don't have an account?</p>
            <Link to="/sign-up" className="text-red hover:underline">
              Sign up
            </Link>
          </div>
        )}
        {!currentUser && (
          <div className="flex gap-2 mt-4 mb-5 text-sm sm:text-base font-bold">
            <p>Demo Login to see the full dashboard <br />
             <span className="text-red">Email</span>: admin@gmail.com, <span className="text-red">Password</span>: @admin001</p>
          </div>
        )}
      </div>
    </div>
  );
}
