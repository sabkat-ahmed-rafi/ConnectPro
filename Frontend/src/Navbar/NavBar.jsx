import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import * as motion from "framer-motion/client"

const NavBar = () => {
  const li = (
    <>
      <NavLink to={"/"}> <motion.p whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Home</motion.p> </NavLink>
      <NavLink to={"/inbox"}> <motion.p whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Messages</motion.p> </NavLink>
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
      <motion.section initial={{ y: -250 }} animate={{ y: -0 }} className="pt-[20px] text-black">
        <div className="navbar bg-base-100 shadow-lg shadow-sky-400 mx-auto  rounded-lg border lg:w-[85%] w-[90%] md:w-[80%] border-sky-400 ">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className={`btn btn-ghost lg:hidden ${!user && "hidden"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                className={`menu font-semibold space-y-2 menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-3 shadow ${!user && "hidden"}`}
              >
                {li}
              </ul>
            </div>
            <Link
              to={"/"}
              className={`btn btn-ghost pl-0 lg:pl-4  hover:bg-white lg:text-3xl text-[22px] gap-0 ${!user && "pl-3 text-[28px]"}`}
            >
              <div >
              <span className="font-bold text-blue-500">Connect</span>
              <sup className="text-lg">Pro</sup>
              </div>
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className={`menu font-semibold menu-horizontal space-x-8 ${!user && "hidden"}`}>
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
                    src={user?.photoURL || "noPhoto.jpg"} />
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
           : <div className="space-x-3 lg:space-x-5 ">
              <Link
              to={"/login"}
              href="#_"
              className="rounded lg:px-5 px-3 lg:py-1.5 py-1 overflow-hidden group bg-sky-500 relative hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-400 text-white hover:ring-indigo-600 transition-all ease-out duration-300"
            >
              <span className="absolute right-0  transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">Login</span>
            </Link>
            <Link
              to={"/register"}
              href="#_"
              className="rounded  lg:px-5 px-3 lg:py-1.5 py-1 overflow-hidden group bg-sky-500 relative hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-400 text-white hover:ring-indigo-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0  transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative">Sign in</span>
            </Link>
              </div>
            }
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default NavBar;
