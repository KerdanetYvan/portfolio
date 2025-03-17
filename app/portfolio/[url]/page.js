"use client";
import React, { use } from 'react';
import projects from '../../../public/projets.json';

import { AiOutlinePaperClip, AiFillCalendar, AiFillGithub, AiOutlineGlobal, AiFillExperiment, AiFillSetting, AiFillRocket, AiFillSignature, AiFillProduct } from "react-icons/ai";

export default function page({ params }) {
    const urlParams = use(params);
    const { url } = urlParams;

    const project = projects.find((project) => project.url === url);
    console.log(project);

    function getDate(projet) {
        const date = projet.date;
        const tabDate = date.split('T');
        const annéeMoisJour = tabDate[0].split('-');
        const annee = annéeMoisJour[0];
        let mois = annéeMoisJour[1];
        switch(mois){
            case '01':
                mois = 'Janvier';
                break;
            case '02':
                mois = 'Février';
                break;
            case '03':
                mois = 'Mars';
                break;
            case '04':
                mois = 'Avril';
                break;
            case '05':
                mois = 'Mai';
                break;
            case '06':
                mois = 'Juin';
                break;
            case '07':
                mois = 'Juillet';
                break;
            case '08':
                mois = 'Août';
                break;
            case '09':
                mois = 'Septembre';
                break;
            case '10':
                mois = 'Octobre';
                break;
            case '11':
                mois = 'Novembre';
                break;
            case '12':
                mois = 'Décembre';
                break;
        }

        return `${mois} ${annee}`;
    }

    return (
        <div className='h-screen bg-stone-700 text-white p-4'>
            <div className='relative container rounded-lg bg-stone-600 box-shadow shadow-xl p-4 mx-auto'>
                <h1 className='font-bold md:text-2xl lg:text-4xl flex items-center gap-2 md:gap-4'><AiOutlinePaperClip />{project.name}</h1>
                <p className='flex items-center gap-2 md:justify-end'><AiFillCalendar /> {getDate(project)}</p>
                <LienProj site={project.site} github={project.github} />
                <h2 className='flex items-center gap-2 font-semibold md:pl-4'><AiFillExperiment />Objectif :</h2>
                <p className='text-xs md:text-sm'>{project.description}</p>
                <h2 className='flex items-center gap-2 font-semibold md:hidden'><AiFillSetting />Technos :</h2>
                <h2 className='hidden md:block md:flex md:items-center md:gap-2 font-semibold pl-4 pt-4'><AiFillSetting />Technologies utilisées :</h2>
                <p className='text-xs md:text-sm'>{project.tech.join(", ")}</p>
                {project.fonctionnalites && <h2 className='hidden md:block md:flex md:items-center md:gap-2 font-semibold pl-4 pt-4'><AiFillRocket />Fonctionnalités :</h2>}
                {project.fonctionnalites && <ul>
                    {project.fonctionnalites.map((fonctionnalite, i) => (
                        <li key={i+fonctionnalite} className='text-xs md:text-sm'>{fonctionnalite}</li>
                    ))}
                </ul>}
                {project.defis && <h2 className='flex items-center gap-2 font-semibold md:pl-4'><AiFillSignature />Défis :</h2>}
                {project.defis && <ul>
                    {project.defis.map((defi, i) => (
                        <li key={i+defi} className='text-xs md:text-sm'>{defi}</li>
                    ))}
                </ul>}
                {project.images && <h2 className='flex items-center gap-2 font-semibold md:pl-4'><AiFillSetting />Images :</h2>}
                {project.images && <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {project.images.map((image, i) => (
                        <img src={`../../../public/${image}`} alt={`image${i}_${project.name}`} key={i+image} className='rounded-md' />
                    ))}
                </div>}
                {project.evolution && <h2 className='flex items-center gap-2 font-semibold md:pl-4'><AiFillProduct />Axes d'amélioration :</h2>}
                {project.evolution && <ul>
                    {project.evolution.map((axe, i) => (
                        <li key={i+axe} className='text-xs md:text-sm'>{axe}</li>
                    ))}
                </ul>}
                {project.status && <Status status={project.status} />}
            </div>
        </div>
    )
}

function LienProj({ site, github}) {
    if(site && github) {
        return (
            <div className='flex items-center gap-2 md:gap-4'>
                <AiOutlineGlobal />
                <a href={site} target='_blank' className='bg-blue-500 text-white px-4 py-2 rounded-md'>Voir le site</a>
                <p>|</p>
                <AiFillGithub />
                <a href={github} target='_blank' className='bg-blue-500 text-white px-4 py-2 rounded-md'>Voir le code</a>
            </div>
        );
    } else if(!site && github) {
        return (
            <div className='flex items-center gap-2 md:gap-4'>
                <AiFillGithub />
                <a href={github} target='_blank' className='bg-blue-500 text-white px-4 py-2 rounded-md'>Voir le code</a>
            </div>
        );
    } else if(site && !github) {
        return (
            <div className='flex items-center gap-2 md:gap-4'>
                <AiOutlineGlobal />
                <a href={site} target='_blank' className='bg-blue-500 text-white px-4 py-2 rounded-md'>Voir le site</a>
            </div>
        );
    } else {
        return;
    }
}

function Status({ status }) {
    console.log(status);
    switch(status){
        case("En cours"):
            return (
                <div className='group absolute top-4 right-0 flex items-center gap-2 rounded-l-lg border-1 border-stone-700 bg-stone-700 p-2'>
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                    </span>
                    <p className='text-[14px]/0 hidden group-hover:block'>{status}</p>
                </div>
            );
            break;
        case("Terminé"):
            return (
                <div className="group absolute top-4 right-0 flex items-center gap-2 rounded-l-lg border-1 border-stone-700 bg-stone-700 p-2">
                    <span className="relative inline-flex size-3 rounded-full bg-stone-500"></span>
                    <p className='text-[14px]/0 hidden group-hover:block'>{status}</p>
                </div>
            );
            break;
        case("En pause"):
            return (
                <div className="group absolute top-4 right-0 flex items-center gap-2 rounded-l-lg border-1 border-stone-700 bg-stone-700 p-2">
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-yellow-500"></span>
                    </span>
                    <p className='text-[14px]/0 hidden group-hover:block'>{status}</p>
                </div>
            );
            break;
        case("Erreur"):
            return (
                <div className="group absolute top-4 right-0 flex items-center gap-2 rounded-l-lg border-1 border-stone-700 bg-stone-700 p-2">
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                    </span>
                    <p className='text-[14px]/0 hidden group-hover:block'>{status}</p>
                </div>
            );
            break;
    }
}