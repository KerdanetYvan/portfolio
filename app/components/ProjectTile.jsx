import Link from 'next/link';
import React from 'react';
import { RiReactjsFill, RiNextjsFill, RiAngularjsFill, RiNodejsFill, RiHtml5Fill, RiCss3Fill, RiJavascriptFill } from "react-icons/ri";
import { FaFolder } from "react-icons/fa6";

export default function ProjectTile({ name, url, description, tech}) {
  return (
    <div className='shadow-lg rounded-md overflow-hidden relative'>
      <div className='bg-blue-300 absolute top-0 left-0 h-full w-full overflow-hidden'>
        {Array.from({ length: 3 }).map((_, index) => (
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
        <div className='flex items-center gap-2 text-2xl pb-2 text-violet-900 z-50'>
            {tech === "react" && <RiReactjsFill size={40} />}
            {tech === "react-native" && <RiReactjsFill size={40} />}
            {tech === "next" && <RiNextjsFill size={40} />}
            {tech === "angular" && <RiAngularjsFill size={40} />}
            {tech === "node" && <RiNodejsFill size={40} />}
            {tech === "html" && <RiHtml5Fill size={40} />}
            {tech === "css" && <RiCss3Fill size={40} />}
            {tech === "js" && <RiJavascriptFill size={40} />}
            {!tech && <FaFolder size={40} />}
            <div>
                <h2 className='font-bold'>{name}</h2>
                {tech && <p className='text-sky-200 text-sm italic'>({tech})</p>}
            </div>
        </div>
        <p className='text-justify font-semibold italic pb-7 text-purple-950'>{description}</p>
        <Link href={`/portfolio/${url}`} className='text-white absolute bottom-4 right-4'>En savoir plus...</Link>
      </div>
    </div>
  )
}
