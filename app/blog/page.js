import React from 'react';
import Link from 'next/link';
import articles from '../../public/articles.json';

// Ensure Articles is defined and is an array
const articlesData = Array.isArray(articles) ? articles : [];

export default function Blog() {
  return (
    <div className='min-h-screen bg-stone-700'>
      <div className="text-white h-25 md:h-50 lg:h-100 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/ac-herobanner.webp)] bg-cover bg-center shadow-md">
        <div className="h-25 md:h-50 lg:h-100 w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-center relative">
          <h1 className='md:text-[64px] lg:text-[96px] font-serif'>Mon Actualité</h1>
          <p className='hidden md:block lg:block italic text-stone-200'>Toutes les news en temps réel ? c'est ici !</p>
        </div>
      </div>
        {articlesData.length !== 0 ? 
        (<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:mx-16 lg:mx-32'>
          {articlesData.map((article) => (
          <div key={article.id} className='shadow-lg rounded-md overflow-hidden relative'>
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
              <h2 className="text-base md:text-xl lg:text-2xl font-bold text-purple-900">{article.titre}</h2>
              <p className="text-sm md:text-base text-black md:font-semibold text-justify pb-8">{article.metadescription}</p>
              <Link href={`/blog/${article.url}`} className='text-white absolute bottom-4 right-4'>En savoir plus...</Link>
            </div>
          </div>
          ))}
        </div>) : <p className="text-center text-stone-500 text-2xl font-bold py-16">Aucun article disponible pour l'instant</p>}
    </div>
  )
}
