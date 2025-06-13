import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.main_banner_bg} alt='banner' className='w-full hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt='banner' className='w-full md:hidden' />

      {/* Background overlay for contrast */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Quote and Buttons */}
      <div className='absolute inset-0 z-20 flex flex-col items-center justify-center px-4 md:px-12 text-center md:text-left'>
        <h1 className="text-3xl md:text-5xl font-bold text-white max-w-xl leading-tight mb-6">
          Eat Fresh. Save More. Feel Great!
        </h1>

        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <Link
            to="/products"
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white"
          >
            Shop now
            <img className="transition group-hover:translate-x-1" src={assets.white_arrow_icon} alt="" />
          </Link>

          <Link
            to="/products"
            className="group flex items-center gap-2 px-9 py-3 text-white hover:underline"
          >
            Explore deals
            <img className="transition group-hover:translate-x-1" src={assets.black_arrow_icon} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
