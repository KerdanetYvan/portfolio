import Link from 'next/link';
import React from 'react';

export default function ArticleTile({title, url, metadescription}) {
  return (
    <div className='bg-linear-65 from-green-300 to-pink-300 shadow-lg p-4 rounded-md relative'>
      <h2 className='text-[32px] font-bold text-purple-950'>{title}</h2>
      <p className='hidden lg:block text-end text-blue-950 pb-8'>{metadescription}</p>
      <p className='hidden md:block lg:hidden text-end text-blue-950 pb-8'>{metadescription.slice(0,600)}...</p>
      <p className='md:hidden text-end text-blue-950 pb-8'>{metadescription.slice(0,300)}...</p>
      <Link href={`/blog/${url}`} className='absolute bottom-4 right-4'>En savoir plus...</Link>
    </div>
  )
}
