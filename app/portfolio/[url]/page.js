"use client";
import React, { use } from 'react';
import projects from '../../../public/projets.json';

import { AiOutlinePaperClip, AiFillCalendar, AiFillGithub, AiOutlineGlobal, AiFillExperiment, AiFillSetting, AiFillRocket, AiFillSignature, AiFillProduct } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";

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
        <div className='min-h-screen bg-stone-700 text-white p-4'>
            <div className='relative container rounded-lg bg-stone-600 box-shadow shadow-xl p-8 mx-auto'>
                <h1 className='font-bold md:text-2xl lg:text-4xl flex items-center gap-2 md:gap-4'><AiOutlinePaperClip />{project.name}</h1>
                <p className='flex items-center gap-2 md:justify-end'><AiFillCalendar /> {getDate(project)}</p>
                <LienProj site={project.site} github={project.github} />
                <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4'><AiFillExperiment />Objectif :</h2>
                <p className='text-xs md:text-base lg:text-xl'>{project.description}</p>
                <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:hidden pt-2'><AiFillSetting />Technos :</h2>
                <h2 className='md:text-xl lg:text-2xl hidden md:block md:flex md:items-center md:gap-2 font-semibold pl-4 pt-4'><AiFillSetting />Technologies utilisées :</h2>
                <p className='text-xs md:text-base lg:text-xl'>{project.tech.join(", ")}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        {project.fonctionnalites && <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4 pt-4'><AiFillRocket />Fonctionnalités :</h2>}
                        {project.fonctionnalites && <ul className='list-inside list-disc pl-4 md:pl-8 lg:pl-12'>
                            {project.fonctionnalites.map((fonctionnalite, i) => (
                                <li key={i+fonctionnalite} className='text-xs md:text-base lg:text-xl'>{fonctionnalite}</li>
                            ))}
                        </ul>}
                    </div>
                    <div>
                        {project.defis && <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4 pt-4'><AiFillSignature />Défis :</h2>}
                        {project.defis && <ul className='list-inside list-disc pl-4 md:pl-8 lg:pl-12'>
                            {project.defis.map((defi, i) => (
                                <li key={i+defi} className='text-xs md:text-base lg:text-xl'>{defi}</li>
                            ))}
                        </ul>}
                    </div>
                </div>
                {project.images && <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4 pt-4'><AiFillSetting />Images :</h2>}
                {project.images && <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4'>
                    {project.images.map((image, i) => (
                        <div className='flex justify-center items-center max-h-[400px]' key={i+image}>
                            <img src={`/projects/${project.url}/${image}`} alt={`image${i}_${project.name}`} className='rounded-md max-h-full max-w-full' />
                        </div>
                    ))}
                </div>}
                {project.evolution && <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4 pt-4'><AiFillProduct />Axes d'amélioration :</h2>}
                {project.evolution && <ul className='list-inside list-disc pl-4 md:pl-8 lg:pl-12'>
                    {project.evolution.map((axe, i) => (
                        <li key={i+axe} className='text-xs md:text-base lg:text-xl'>{axe}</li>
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
            <div className='w-full flex justify-center items-center gap-2 md:gap-4 m-2'>
                <a href={site} target='_blank' className='flex items-center gap-2 text-white p-1 px-2 rounded-md hover:bg-stone-700'><AiOutlineGlobal /> <p className="hidden md:block">Voir le site</p></a>
                <p>|</p>
                <a href={github} target='_blank' className='flex items-center gap-2 text-white p-1 px-2 rounded-md hover:bg-stone-700'><AiFillGithub /> <p className="hidden md:block">Repo Github</p></a>
            </div>
        );
    } else if(!site && github) {
        return (
            <div className='w-full flex justify-center items-center gap-2 md:gap-4 m-2'>
                <a href={github} target='_blank' className='flex items-center gap-2 text-white p-1 px-2 rounded-md hover:bg-stone-700'><AiFillGithub /> Repo Github</a>
            </div>
        );
    } else if(site && !github) {
        return (
            <div className='w-full flex justify-center items-center gap-2 md:gap-4 m-2'>
                <a href={site} target='_blank' className='flex items-center gap-2 text-white p-1 px-2 rounded-md hover:bg-stone-700'><AiOutlineGlobal /> Voir le site</a>
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
                    <div className='text-[14px]/0 max-w-0 transition-all duration-300 ease-in-out  group-hover:max-w-50 '><p className='scale-x-0 origin-right transition-transform duration-300 ease-linear group-hover:scale-x-100'>{status}</p></div>
                </div>
            );
            break;
        case("Terminé"):
            return (
                <div className="group absolute top-4 right-0 flex items-center gap-2 rounded-l-lg border-1 border-stone-700 bg-stone-700 p-2 animate-deroulement">
                    <span className="relative inline-flex size-3 rounded-full bg-stone-500"></span>
                    <p className='text-[14px]/0 hidden group-hover:block'>{status}</p>
                </div>
            );
            break;
        case("En pause"):
            return (
                <div className="group absolute top-4 right-0 flex items-center gap-2 rounded-l-lg border-1 border-stone-700 bg-stone-700 p-2 animate-deroulement">
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
                <div className="group absolute top-4 right-0 flex items-center gap-2 rounded-l-lg border-1 border-stone-700 bg-stone-700 p-2 animate-deroulement">
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