import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import logo from "/eduportallogo.png";

export default function Header() {
  const { currentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white w-full">
      <div className="flex justify-between items-center lg:px-[10%] px-[5%] py-3">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="ml-3 text-3xl md:text-4xl font-bold lora-font flex items-center gap-1">
            <span className="text-red">Edu</span>
            <span className="text-black">Portal</span>
          </h1>
        </Link>

        {/* DESKTOP MENU */}
        {!isMobile ? (
          <ul className="flex gap-7 items-center sedan-regular text-lg relative">
            <Link to="/">
              <li className="text-black hover:underline cursor-pointer">
                Home
              </li>
            </Link>

            <li
              className="text-black hover:underline cursor-pointer relative"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Dashboard
              {dropdownOpen && (
                <ul
                  className="absolute bg-white border border-black mt-3 w-40 rounded-md shadow-xl"
                  style={{ zIndex: 9999 }}
                >
                  <Link to="/student">
                    <li className="px-4 py-2 hover:bg-red hover:text-white cursor-pointer">
                      Students
                    </li>
                  </Link>
                  <Link to="/teacher">
                    <li className="px-4 py-2 hover:bg-red hover:text-white cursor-pointer">
                      Teachers
                    </li>
                  </Link>
                  <Link to="/class">
                    <li className="px-4 py-2 hover:bg-red hover:text-white cursor-pointer">
                      Classes
                    </li>
                  </Link>
                  <Link to="/profit-analysis">
                    <li className="px-4 py-2 hover:bg-red hover:text-white cursor-pointer">
                      Profit Analysis
                    </li>
                  </Link>
                </ul>
              )}
            </li>

            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-9 w-9 object-cover border-2 border-black"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <li className="text-black hover:underline cursor-pointer">
                  Sign in
                </li>
              )}
            </Link>
          </ul>
        ) : (
          /* MOBILE MENU */
          <div className="flex items-center gap-4">
            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-9 w-9 object-cover border-2 border-black"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className="text-black text-lg">Sign In</span>
              )}
            </Link>

            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaBars className="text-2xl text-black" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-20 right-3 bg-white border border-black w-50 rounded-md shadow-2xl p-3"
                style={{ zIndex: 9999 }}
              >
                <ul className="flex flex-col text-black text-lg">
                  <Link to="/">
                    <li className="hover:bg-red hover:text-white px-3 py-2 rounded-md">
                      Home
                    </li>
                  </Link>
                  <Link to="/student">
                    <li className="hover:bg-red hover:text-white px-3 py-2 rounded-md">
                      Students
                    </li>
                  </Link>
                  <Link to="/teacher">
                    <li className="hover:bg-red hover:text-white px-3 py-2 rounded-md">
                      Teachers
                    </li>
                  </Link>
                  <Link to="/class">
                    <li className="hover:bg-red hover:text-white px-3 py-2 rounded-md">
                      Classes
                    </li>
                  </Link>
                  <Link to="/profit-analysis">
                    <li className="hover:bg-red hover:text-white px-3 py-2 rounded-md">
                      Profit Analysis
                    </li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
