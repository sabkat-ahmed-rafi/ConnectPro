import React from 'react';
import Lottie from "lottie-react";
import SignIn from "../../../public/signIn.json"
import { Link } from 'react-router-dom';


const Register = () => {
    return (
        <>
          <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
    <Lottie animationData={SignIn} loop={true} />
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <form className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Name</span>
          </label>
          <input type="text" placeholder="Name" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Email</span>
          </label>
          <input type="email" placeholder="Email" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Password</span>
          </label>
          <input type="password" placeholder="Password" className="input input-bordered" required />
        </div>
        <div className="form-control mt-6">
          <button className="font-semibold rounded px-5 py-1.5 overflow-hidden group bg-blue-500 relative hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-400 text-white hover:ring-indigo-600 transition-all ease-out duration-300">Sign up</button>
        </div>
        <label className="label">
            <p className="text-sm italic">Already have an account? <Link className='text-blue-600' to='/login'>Login</Link></p>
          </label>
      </form>
      
    </div>
  </div>
</div>  
        </>
    );
};

export default Register;