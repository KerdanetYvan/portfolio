import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="bg-stone-700 min-h-screen text-white">
      <div className='bg-[url(../public/ab-herobanner.webp)] bg-cover bg-center h-[600px] flex items-center justify-center'>

      </div>
      <h1 className="text-4xl font-bold mb-4">About Me</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
        <p>Hello! I'm Yvank, a passionate developer with a love for creating beautiful and functional web applications.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Personal Background</h2>
        <p>I am an individual who enjoys learning new technologies and applying them to solve real-world problems. I believe in continuous improvement and always strive to enhance my skills.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Education & Professional Experience</h2>
        <p>I have a degree in Computer Science and have worked on various projects, ranging from small personal websites to large-scale applications. My professional experience includes working with JavaScript, React, Next.js, and Tailwind CSS.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Hobbies</h2>
        <p>In my free time, I enjoy hiking, reading books, and playing video games. I also love exploring new places and experiencing different cultures.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
        <p>If you'd like to get in touch, feel free to <Link href="/contact" className="text-blue-400 underline">contact me</Link>.</p>
      </section>
    </div>
  )
}
