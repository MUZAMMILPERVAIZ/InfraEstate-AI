// import "./Hero.css";
// import CountUp from "react-countup";
// import { motion } from "framer-motion";
// import SearchBar from "../SearchBar/SearchBar";
// const Hero = () => {
//   return (
//     <section className="hero-wrapper">
//       <div className="paddings innerWidth flexCenter hero-container">
//         {/* left side */}
//         <div className="flexColStart hero-left">
//           <div className="hero-title">
//             <div className="orange-circle" />
//             <motion.h1
//             initial={{ y: "2rem", opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{
//               duration: 2,
//               type: "ease-in",
//             }}
//             >
//               Discover <br />
//               Most Suitable
//               <br /> Property
//             </motion.h1>
//           </div>
//           <div className="flexColStart secondaryText flexhero-des">
//             <span>Find a variety of properties that suit you very easily</span>
//             <span>Forget all difficulties in finding a residence for you</span>
//           </div>
//
//           <SearchBar/>
//
//           <div className="flexCenter stats">
//             <div className="flexColCenter stat">
//               <span>
//                 <CountUp start={8800} end={9000} duration={4} /> <span>+</span>
//               </span>
//               <span className="secondaryText">Premium Product</span>
//             </div>
//
//             <div className="flexColCenter stat">
//               <span>
//                 <CountUp start={1950} end={2000} duration={4} /> <span>+</span>
//               </span>
//               <span className="secondaryText">Happy Customer</span>
//             </div>
//
//             <div className="flexColCenter stat">
//               <span>
//                 <CountUp end={28} /> <span>+</span>
//               </span>
//               <span className="secondaryText">Awards Winning</span>
//             </div>
//           </div>
//         </div>
//
//         {/* right side */}
//         <div className="flexCenter hero-right">
//           <motion.div
//             initial={{ x: "7rem", opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{
//               duration: 2,
//               type: "ease-in",
//             }}
//             className="image-container"
//           >
//             <img src="./hero-image.png" alt="houses" />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };
//
// export default Hero;
import React from "react"; // Add this import
import "./Hero.css";
import CountUp from "react-countup";
import {motion} from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="hero-container innerWidth flexCenter">
                {/* Left Content */}
                <div className="hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{opacity: 0, y: 50}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 1.5}}
                    >

                        <h1>
                            Find Your <br/>
                            <span className="highlight-text">Perfect Property</span>
                        </h1>
                        {/*<span className="highlight-circle"/>*/}
                        <p className="hero-subtext">
                            Discover premium real estate listings tailored to your needs with AI-powered
                            recommendations.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        className="hero-search"
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.5, duration: 1}}
                    >
                        <SearchBar/>
                    </motion.div>

                    {/* Stats Section */}
                    <div className="hero-stats">
                        <div className="stat">
                            <CountUp start={8800} end={9000} duration={4}/> <span>+</span>
                            <p>Luxury Listings</p>
                        </div>
                        <div className="stat">
                            <CountUp start={1950} end={2000} duration={4}/> <span>+</span>
                            <p>Happy Clients</p>
                        </div>
                        <div className="stat">
                            <CountUp end={28}/> <span>+</span>
                            <p>Awards Won</p>
                        </div>
                    </div>
                </div>


                {/* Right Side - Hero Image */}
                <motion.div
                    className="hero-image"
                    initial={{x: 50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{duration: 1.5}}
                >
                    <div className="image-glass">
                        <img src="./hero-image.png" alt="Luxury Apartments"/>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

