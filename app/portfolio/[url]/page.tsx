'use client';
import { use } from 'react';
import projects from '../../../public/projets.json';
import { AiOutlinePaperClip, AiFillCalendar, AiFillGithub, AiOutlineGlobal, AiFillExperiment, AiFillSetting, AiFillRocket, AiFillSignature, AiFillProduct } from 'react-icons/ai';

interface Project {
  id: number;
  name: string;
  url: string;
  description: string;
  tech: string[];
  status: string;
  date: string;
  fonctionnalites?: string[];
  defis?: string[];
  evolution?: string[];
  images?: string[];
  site?: string;
  github?: string;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function getDate(project: Project): string {
  const d = new Date(project.date);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

interface LienProjProps {
  site?: string;
  github?: string;
}

function LienProj({ site, github }: LienProjProps) {
  if (site && github) {
    return (
      <div className='w-full flex justify-center items-center gap-2 md:gap-4 m-2'>
        <a href={site} target='_blank' rel="noopener noreferrer" className='flex items-center gap-2 text-white p-1 px-2 rounded-md hover:bg-stone-700'><AiOutlineGlobal /><p className="hidden md:block">Voir le site</p></a>
        <p>|</p>
        <a href={github} target='_blank' rel="noopener noreferrer" className='flex items-center gap-2 text-white p-1 px-2 rounded-md hover:bg-stone-700'><AiFillGithub /><p className="hidden md:block">Repo Github</p></a>
      </div>
    );
  }
  if (github) {
    return (
      <div className='w-full flex justify-center items-center gap-2 md:gap-4 m-2'>
        <a href={github} target='_blank' rel="noopener noreferrer" className='flex items-center gap-2 text-white p-1 px-2 rounded-md hover:bg-stone-700'><AiFillGithub /> Repo Github</a>
      </div>
    );
  }
  if (site) {
    return (
      <div className='w-full flex justify-center items-center gap-2 md:gap-4 m-2'>
        <a href={site} target='_blank' rel="noopener noreferrer" className='flex items-center gap-2 text-white p-1 px-2 rounded-md hover:bg-stone-700'><AiOutlineGlobal /> Voir le site</a>
      </div>
    );
  }
  return null;
}

function Status({ status }: { status: string }) {
  const dot = {
    'En cours': 'bg-green-500',
    'Terminé':  'bg-stone-500',
    'En pause': 'bg-yellow-500',
    'Erreur':   'bg-red-500',
  }[status];

  const ping = {
    'En cours': 'bg-green-400',
    'En pause': 'bg-yellow-400',
    'Erreur':   'bg-red-400',
  }[status];

  return (
    <div className='group absolute top-4 right-0 flex items-center gap-2 rounded-l-lg border-1 border-stone-700 bg-stone-700 p-2'>
      <span className="relative flex size-3">
        {ping && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${ping} opacity-75`} />}
        <span className={`relative inline-flex size-3 rounded-full ${dot}`} />
      </span>
      <div className='text-[14px]/0 max-w-0 transition-all duration-300 ease-in-out group-hover:max-w-50'>
        <p className='scale-x-0 origin-right transition-transform duration-300 ease-linear group-hover:scale-x-100'>{status}</p>
      </div>
    </div>
  );
}

export default function ProjectPage({ params }: { params: Promise<{ url: string }> }) {
  const { url } = use(params);
  const project = (projects as Project[]).find((p) => p.url === url);

  if (!project) return <div className='min-h-screen bg-stone-700 text-white p-4'>Projet introuvable.</div>;

  return (
    <div className='min-h-screen bg-stone-700 text-white p-4'>
      <div className='relative container rounded-lg bg-stone-600 box-shadow shadow-xl p-8 mx-auto'>
        <h1 className='font-bold md:text-2xl lg:text-4xl flex items-center gap-2 md:gap-4'><AiOutlinePaperClip />{project.name}</h1>
        <p className='flex items-center gap-2 md:justify-end'><AiFillCalendar /> {getDate(project)}</p>
        <LienProj site={project.site} github={project.github} />
        <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4'><AiFillExperiment />Objectif :</h2>
        <p className='text-xs md:text-base lg:text-xl'>{project.description}</p>
        <h2 className='md:text-xl lg:text-2xl hidden md:flex md:items-center md:gap-2 font-semibold pl-4 pt-4'><AiFillSetting />Technologies utilisées :</h2>
        <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:hidden pt-2'><AiFillSetting />Technos :</h2>
        <p className='text-xs md:text-base lg:text-xl'>{project.tech.join(', ')}</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            {project.fonctionnalites && <>
              <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4 pt-4'><AiFillRocket />Fonctionnalités :</h2>
              <ul className='list-inside list-disc pl-4 md:pl-8 lg:pl-12'>
                {project.fonctionnalites.map((f, i) => (
                  <li key={i} className='text-xs md:text-base lg:text-xl'>{f}</li>
                ))}
              </ul>
            </>}
          </div>
          <div>
            {project.defis && <>
              <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4 pt-4'><AiFillSignature />Défis :</h2>
              <ul className='list-inside list-disc pl-4 md:pl-8 lg:pl-12'>
                {project.defis.map((d, i) => (
                  <li key={i} className='text-xs md:text-base lg:text-xl'>{d}</li>
                ))}
              </ul>
            </>}
          </div>
        </div>
        {project.images && <>
          <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4 pt-4'><AiFillSetting />Images :</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4'>
            {project.images.map((image, i) => (
              <div className='flex justify-center items-center max-h-[400px]' key={i}>
                <img src={`/projects/${project.url}/${image}`} alt={`image${i}_${project.name}`} className='rounded-md max-h-full max-w-full' />
              </div>
            ))}
          </div>
        </>}
        {project.evolution && <>
          <h2 className='md:text-xl lg:text-2xl flex items-center gap-2 font-semibold md:pl-4 pt-4'><AiFillProduct />Axes d'amélioration :</h2>
          <ul className='list-inside list-disc pl-4 md:pl-8 lg:pl-12'>
            {project.evolution.map((axe, i) => (
              <li key={i} className='text-xs md:text-base lg:text-xl'>{axe}</li>
            ))}
          </ul>
        </>}
        {project.status && <Status status={project.status} />}
      </div>
    </div>
  );
}
