import React from 'react'

export default function CardReseau({ title, pseudo, link, icon, description }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="grid grid-cols-[1fr_4fr] items-center bg-stone-800 rounded-lg p-4 gap-4 w-fit mx-auto shadow-md">
        <div className='flex justify-center items-center'>
          {icon}
        </div>
        <div>
            <h1 className='font-bold text-xl'>{title}</h1>
            <h2 className='italic text-stone-400 pb-2'>{pseudo}</h2>
            <p className=''>{description}</p>
        </div>
    </a>
  )
}
