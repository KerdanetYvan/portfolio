import React from 'react';
import Link from 'next/link';

export default function Blog() {
  return (
    <div className='min-h-screen bg-stone-700'>
      <div className="text-white h-25 md:h-50 lg:h-100 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/ac-herobanner.webp)] bg-cover bg-center shadow-md">
        <div className="h-25 md:h-50 lg:h-100 w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-center relative">
          <h1 className='md:text-[64px] lg:text-[96px] font-serif'>Mon Actualité</h1>
          <p className='hidden md:block lg:block italic text-stone-200'>Toutes les news en temps réel ? c'est ici !</p>
        </div>
      </div>
    </div>
  )
}
