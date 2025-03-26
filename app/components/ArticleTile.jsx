import Link from 'next/link';
import React from 'react';

export default function ArticleTile({title, url, metadescription}) {
  return (
    <div className='shadow-lg rounded-md overflow-hidden relative'>
      <div className='bg-blue-300 absolute top-0 left-0 h-full w-full overflow-hidden'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              width: `${Math.floor(Math.random() * 100) + 50}px`,
              height: `${Math.floor(Math.random() * 100) + 50}px`,
              position: 'absolute',
              top: `${Math.floor(Math.random() * 100)}%`,
              left: `${Math.floor(Math.random() * 100)}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`${Math.random() > 0.5 ? 'bg-blue-200' : 'bg-blue-400'} opacity-50`}
          />
        ))}
      </div>
      <div className='relative z-10 backdrop-blur-[1px] p-4 h-full'>
        <h2 className='text-[32px] font-bold text-purple-950'>{title}</h2>
        <p className='hidden lg:block text-justify text-blue-950 font-semibold pb-8'>{metadescription}</p>
        <p className='hidden md:block lg:hidden text-justify text-blue-950 pb-8'>{metadescription.slice(0,600)}...</p>
        <p className='md:hidden text-justify text-blue-950 pb-8'>{metadescription.slice(0,300)}...</p>
        <Link href={`/blog/${url}`} className='absolute text-white bottom-4 right-4'>En savoir plus...</Link>
      </div>
    </div>
  )
}
