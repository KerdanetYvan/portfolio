import React from 'react';
import Link from 'next/link';

export default function Blog() {
  return (
    <div className='relative min-h-screen'>
      <div>
        <h1>Blog</h1>
        <Link href='/'>Return to main menu</Link>
      </div>

      <div id='Background' className='absolute top-0 left-0 bg-orange-300 h-screen w-screen -z-10'>
        <span></span>
      </div>
    </div>
  )
}
