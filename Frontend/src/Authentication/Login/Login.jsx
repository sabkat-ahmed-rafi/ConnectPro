import React from 'react';
import Lottie from "lottie-react";
import SignIn from "../../../public/signIn.json"
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form"

const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm()
    
    
      const onSubmit = (data) => console.log(data)

    return (
        <>
            <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content ">
    <div className="text-center lg:text-left">
    <Lottie className='lg:flex hidden' animationData={SignIn} loop={true} />
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="card-body">
        <h1 className='text-3xl  font-bold text-center pb-2'>Log in</h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Email</span>
          </label>
          <input {...register("email", { required: true })} type="email" placeholder="Email" className="input input-bordered" />
          {errors.email && <span className='text-red-600 pt-2'>Email is required</span>}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Password</span>
          </label>
          <input {...register("password", { required: true })} type="password" placeholder="Password" className="input input-bordered" />
          {errors.password && <span className='text-red-600 pt-2'>Password is required</span>}
        </div>
        <div className="form-control mt-6">
          <button className="font-semibold rounded px-5 py-1.5 overflow-hidden group bg-sky-500 relative hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-400 text-white hover:ring-indigo-600 transition-all ease-out duration-300">Sign up</button>
        </div>
        <label className="label">
            <p className="text-sm italic text-slate-500">Haven't any account? <Link className='text-blue-600' to='/register'>Create</Link></p>
          </label>
      </form>
    </div>
  </div>
          </div>
        </>
    );
};

export default Login;