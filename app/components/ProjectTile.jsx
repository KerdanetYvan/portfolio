import Link from 'next/link';
import React from 'react';
import { RiReactjsFill, RiNextjsFill, RiAngularjsFill, RiNodejsFill, RiHtml5Fill, RiCss3Fill, RiJavascriptFill } from "react-icons/ri";
import { FaFolder } from "react-icons/fa6";

export default function ProjectTile({ name, url, description, tech}) {
  return (
    <div className='bg-linear-65 from-fuchsia-400 to-sky-300 shadow-lg p-4 rounded-md relative'>
        <div className='flex items-center gap-2 text-2xl pb-2 text-violet-900'>
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
                <h2>{name}</h2>
                {tech && <p className='text-fuchsia-200 text-sm italic'>({tech})</p>}
            </div>
        </div>
        <p className='text-end italic pb-7 text-purple-950'>{description}</p>
        <Link href={`/project/${url}`} className='text-sky-100 absolute bottom-4 right-4'>En savoir plus...</Link>
    </div>
  )
}
