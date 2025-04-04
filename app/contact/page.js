import React from 'react';
import Link from 'next/link';
import { RiMailFill, RiPhoneFill } from 'react-icons/ri';
import CardReseau from '../components/CardReseau';
import { SiGithub, SiLinkedin, SiReddit } from 'react-icons/si';

export default function Contact() {
  return (
    <div className="bg-stone-700 min-h-screen text-white p-0 m-0 flex items-center justify-center">
      <div className='container'>
        <h1 className='text-center text-2xl font-bold pb-4'>Me contacter ?</h1>
        <div className='bg-stone-600 rounded-lg p-8 shadow-md mb-4'>
          <p className='md:pl-8 font-semibold text-xl md:text-2xl'>Vous pouvez me contacter via les moyens suivants :</p>
          <div className='flex flex-col md:flex-row md:justify-around items-center gap-2 pt-4'>
            <a href="mailto:kerdanety@gmail.com" className="text-sky-300 md:text-xl lg:text-2xl hover:text-sky-500 transition duration-300 flex gap-2 items-center font-bold"><RiMailFill /> kerdanety@gmail.com</a>
            <a href="tel:0634636918" className="text-sky-300 md:text-xl lg:text-2xl hover:text-sky-500 transition duration-300 flex gap-2 items-center font-bold"><RiPhoneFill /> 06 34 63 69 18</a>
          </div>
        </div>
        <p className='pl-8 font-semibold text-xl'>Mais aussi via mes réseaux :</p>
        <div className='p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <CardReseau title="GitHub" pseudo="KerdanetYvan" icon={<SiGithub size={48} color='white' />} link="https://github.com/KerdanetYvan" description="Bonjour 👋, je suis Yvan KERDANET, Étudiant à Digital Campus à la recherche d'une alternance en développement web..."/>
          <CardReseau title="LinkedIn" pseudo="Yvan KERDANET" icon={<SiLinkedin size={48} color='#0A66C2' />} link="https://www.linkedin.com/in/yvankerdanet/" description="Étudiant B2 cherchant une alternance en développement web..."/>
          <CardReseau title="Reddit" pseudo="KerdanetYvan" icon={<SiReddit size={48} color='#FF4500' />} link="https://www.reddit.com/user/yvankdt/" description="Je suis un passionné de développement web et de nouvelles technologies..."/>
        </div>
      </div>
    </div>
  )
}
