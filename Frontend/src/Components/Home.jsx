import {Link} from 'react-router-dom'
import { Typewriter } from 'react-simple-typewriter'
import * as motion from "framer-motion/client"
import Lottie from "lottie-react";
import home from "../../public/home.json"

const Home = () => {



  return (
    <>
    
    <div className="hero lg:pt-16 lg:px-8 text-center lg:text-left overflow-hidden">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <motion.div initial={{ x: 250 }} animate={{ x: 0 }}>
    <Lottie
              className="lg:flex md:flex hidden"
              animationData={home}
              loop={true}
            />
    </motion.div>
    <div className='lg:flex flex-col md:hidden'>
      <h1 className="lg:text-5xl text-[25px] font-thin lg:min-w-[650px]  whitespace-nowrap italic relative"><Typewriter words={["Conversations made simple", "Connections made meaningful"]} loop={true} /></h1>
      <motion.p initial={{ x: -250 }} animate={{ x: -0 }} className="py-6 lg:w-[400px] font-thin lg:text-lg text-md italic ">
        At ConnectPro, we believe communication should be simple and powerful. Join today and experience a new way of staying in touch.
      </motion.p>
      <motion.p initial={{ x: -250 }} animate={{ x: -0 }} ><Link to={'/inbox'} class="relative items-center justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all bg-[#3B82F6] rounded-full hover:bg-white group">
        <span class="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
        <span class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600 italic">Get Started</span>
      </Link></motion.p>
    </div>
  </div>
</div>
    
    </>
    );
};

export default Home;
