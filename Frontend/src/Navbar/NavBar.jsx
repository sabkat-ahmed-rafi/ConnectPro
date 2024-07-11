import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const NavBar = () => {
  const li = (
    <>
      <NavLink to={"/"}>Home</NavLink>
      <NavLink to={"/massages"}>Massages</NavLink>
      <NavLink to={"/about"}>about</NavLink>
      <NavLink to={"/contacts"}>contact</NavLink>
    </>
  );

  
  const {user, logout} = useAuth()


  const handleLogOut = () => {
    logout();
  }

  return (
    <>
      <section className="pt-[20px] text-black">
        <div className="navbar bg-base-100 shadow-lg shadow-sky-400  mx-auto rounded-lg border lg:w-[85%] w-[90%] border-sky-400">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu font-semibold space-y-2 menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                {li}
              </ul>
            </div>
            <Link
              to={"/"}
              className="btn btn-ghost hover:bg-white text-3xl gap-0"
            >
              <span className="font-bold text-blue-500">Connect</span>
              <span className="text-lg">Pro</span>
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu font-semibold menu-horizontal space-x-8">
              {li}
            </ul>
          </div>
          <div className="navbar-end">
            {
              user ?  <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-12 rounded-full">
                  <img
                    alt="Profile Picture"
                    src={user.photoURL ? user.photoURL : "noPhoto.jpg"} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-md">
                <li><Link to={'/profile'}>Profile</Link></li>
                <li><Link to={'/settings'}>Settings</Link></li>
                <li><Link onClick={handleLogOut} >Logout</Link></li>
              </ul>
            </div>
           : <div className="space-x-5 ">
              <Link
              to={"/login"}
              href="#_"
              className="rounded px-5 py-1.5 overflow-hidden group bg-sky-500 relative hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-400 text-white hover:ring-indigo-600 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative">Login</span>
            </Link>
            <Link
              to={"/register"}
              href="#_"
              className="rounded px-5 py-1.5 overflow-hidden group bg-sky-500 relative hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-400 text-white hover:ring-indigo-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative">Sign in</span>
            </Link>
              </div>
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default NavBar;
