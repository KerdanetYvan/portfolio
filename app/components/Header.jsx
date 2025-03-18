"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { TiThMenu } from "react-icons/ti";
import Image from 'next/image';
import Logo from '../../public/favicon.webp';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-stone-800 shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white"><Link href='/' className='flex items-center gap-2'><Image src={Logo} alt='logo du site' width={30} height={30} className='rounded-sm' />Kerdanet Yvan</Link></h1>
      <nav className="space-x-6 hidden lg:block">
        <Link href="/portfolio" className="text-white hover:text-blue-500 transition">Portfolio</Link>
        <Link href="/blog" className="text-white hover:text-blue-500 transition">Mon Actus</Link>
        <Link href="/about" className="text-white hover:text-blue-500 transition">A Propos</Link>
        <Link href='/contact' className="bg-blue-500 text-white px-4 py-2 rounded-md">Me Contacter</Link>
      </nav>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="block lg:hidden">
        <TiThMenu className="text-white text-2xl" />
      </button>
      {isSidebarOpen && <Sidebar />}
    </header>
  )
}

function Sidebar() {
  return (
    <div className="absolute top-16 right-0 bg-stone-800 shadow-md p-4 space-y-4 flex flex-col items-end z-10">
      <Link href="/portfolio" className="text-white hover:text-blue-500 transition">Portfolio</Link>
      <Link href="/about" className="text-white hover:text-blue-500 transition">A Propos</Link>
      <Link href="/blog" className="text-white hover:text-blue-500 transition">Mon Actus</Link>
      <Link href='/contact' className="bg-blue-500 text-white px-4 py-2 rounded-md">Me Contacter</Link>
    </div>
  )
}