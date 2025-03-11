import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-stone-800 shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white"><Link href='/'>Kerdanet Yvan</Link></h1>
      <nav className="space-x-6">
        <a href="#projects" className="text-white hover:text-blue-500 transition">Projets</a>
        <a href="#contact" className="text-white hover:text-blue-500 transition">Contact</a>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Me Contacter</button>
      </nav>
    </header>
  )
}
