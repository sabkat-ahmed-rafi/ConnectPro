import React from 'react';
import Lottie from "lottie-react";
import SignIn from "../../../public/signIn.json"
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../Hooks/useAuth';
import toast from 'react-hot-toast';
import { ImSpinner3 } from 'react-icons/im';

const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm()

      const navigate = useNavigate()
      const {googleLogin, login, setLoading, loading} = useAuth()
    
    
      const onSubmit = async (data) => {
        const { email, password } = data;

        try {
          await login(email, password);
          toast.success("Login successfully!");
          navigate("/");
        } catch (error) {
          console.log(error.message);
          setLoading(false);
          toast.error("Invalid Credentials");
    
        }
      }


      const handleGoogleLogIn = async () => {
        try{
          const {user} = await googleLogin()
          navigate("/");
          console.log(user);
        }catch(error){
          console.log(error.message);
          setLoading(false);
          toast.error(error.message);
        }
      };

    return (
        <>
            <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content">
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
          <button className="font-semibold rounded px-5 py-1.5 overflow-hidden group bg-sky-500 relative hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-400 text-white hover:ring-indigo-600 transition-all ease-out duration-300">{loading ? (
                    <ImSpinner3 className="animate-spin mx-auto text-white size-6" />
                  ) : (
                    "Login"
                  )}</button>
        </div>
      </form>
      <div className="text-center">
              <button
                onClick={handleGoogleLogIn}
                className="btn lg:w-[320px] w-[250px] font-bold"
              >
                <FcGoogle className="text-2xl" />
                Google
              </button>
            </div>
                <p className="text-sm italic text-slate-500 text-center py-3">
                  Haven't any account? <Link className='text-blue-600' to='/register'>Create</Link>
                </p>
    </div>
  </div>
          </div>
        </>
    );
};

export default Login;