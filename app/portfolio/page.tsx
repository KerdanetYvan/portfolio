'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiArrowDropRightFill, RiArrowDropDownFill } from 'react-icons/ri';
import projects from '../../public/projets.json';

interface Project {
  id: number;
  name: string;
  url: string;
  description: string;
  tech: string[];
  status: string;
  date: string;
  site?: string;
  github?: string;
}

type SubCategories = Record<string, string[]>;
type Categories = Record<string, SubCategories>;

const categories: Categories = {
  Developpement: {
    Frontend: ['React', 'Vue', 'Angular'],
    Backend:  ['Node', 'Express', 'Django', 'Flask'],
    Mobile:   ['React Native', 'Flutter'],
    BDD:      ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
    CMS:      ['WordPress', 'Drupal', 'Joomla'],
  },
  Design: {
    UI:        ['Figma', 'Adobe XD'],
    UX:        ['Adobe XD', 'Sketch'],
    Graphisme: ['Photoshop', 'Illustrator', 'InDesign'],
  },
  Bureautique: {
    Office:      ['Word', 'Excel', 'PowerPoint', 'Outlook', 'Access', 'Teams'],
    Google:      ['Docs', 'Sheets', 'Slides', 'Gmail'],
    LibreOffice: ['Writer', 'Calc', 'Impress', 'Mail'],
    Autres:      ['Notion', 'Trello', 'Slack', 'Zoom', 'Canva'],
  },
};

function getTimeOrDate(date: string): string {
  const now = new Date();
  const art = new Date(date);
  const diffMs = now.getTime() - art.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) return `${Math.floor(diffMs / (1000 * 60))} min`;
    return `${diffHours} h`;
  }
  if (diffDays < 90) return `${diffDays} j`;
  const d = art.getDate().toString().padStart(2, '0');
  const m = (art.getMonth() + 1).toString().padStart(2, '0');
  return `${d}/${m}/${art.getFullYear()}`;
}

export default function Portfolio() {
  const [checkedItems, setCheckedItems]           = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [renderProjects, setRenderProjects]       = useState<Project[]>(projects as Project[]);

  useEffect(() => {
    setRenderProjects(projectsToDisplay());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems]);

  const toggleCheckbox = (category: string, subCategory?: string, item?: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev };
      if (!subCategory) {
        const newState = !next[category];
        next[category] = newState;
        Object.keys(categories[category]).forEach((sub) => {
          next[sub] = newState;
          categories[category][sub].forEach((el) => { next[el] = newState; });
        });
      } else if (!item) {
        const newState = !next[subCategory];
        next[subCategory] = newState;
        categories[category][subCategory].forEach((el) => { next[el] = newState; });
        next[category] = Object.keys(categories[category]).every((sub) => next[sub]);
      } else {
        next[item] = !next[item];
        next[subCategory] = categories[category][subCategory].every((el) => next[el]);
        next[category] = Object.keys(categories[category]).every((sub) => next[sub]);
      }
      return next;
    });
  };

  const toggleExpand = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const projectsToDisplay = (): Project[] => {
    const active = Object.keys(checkedItems).filter((k) => checkedItems[k]);
    if (active.length === 0) return projects as Project[];
    const seen = new Set<number>();
    const result: Project[] = [];
    for (const tag of active) {
      for (const p of projects as Project[]) {
        if (p.tech.includes(tag) && !seen.has(p.id)) {
          seen.add(p.id);
          result.push(p);
        }
      }
    }
    return result.length === 0 ? projects as Project[] : result;
  };

  return (
    <div className="bg-stone-700 min-h-screen p-0 m-0">
      <div className="text-white h-25 md:h-50 lg:h-100 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/pt-herobanner.webp)] bg-cover bg-center shadow-md">
        <div className="h-25 md:h-50 lg:h-100 w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-center relative">
          <h1 className='md:text-[64px] lg:text-[96px] font-serif'>Portfolio</h1>
          <p className='hidden md:block lg:block italic text-stone-200'>Voici un aperçu de mes derniers projets réalisés</p>
        </div>
      </div>
      <div className='flex justify-end p-6'>
        <Link href="/skills" className='bg-blue-500 text-white px-4 py-2 rounded-md'>Toutes mes Compétences</Link>
      </div>

      <div className='w-full grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 p-4 md:px-16 lg:px-32'>
        <div className='hidden lg:block border-r-1 border-amber-100 text-amber-100'>
          {Object.entries(categories).map(([category, subCategories]) => (
            <div key={category} className="mb-2">
              <div className="flex items-center">
                <button onClick={() => toggleExpand(category)} className="mr-2 text-lg font-bold">
                  {expandedCategories[category] ? <RiArrowDropDownFill size={40} /> : <RiArrowDropRightFill size={40} />}
                </button>
                <label className="font-bold">
                  <input
                    type="checkbox"
                    checked={checkedItems[category] || false}
                    onChange={() => toggleCheckbox(category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              </div>
              {expandedCategories[category] && (
                <div className="ml-4">
                  {Object.entries(subCategories).map(([subCategory, items]) => (
                    <div key={subCategory} className="ml-4 mt-2">
                      <label className="font-semibold">
                        <input
                          type="checkbox"
                          checked={checkedItems[subCategory] || false}
                          onChange={() => toggleCheckbox(category, subCategory)}
                          className="mr-2"
                        />
                        {subCategory}
                      </label>
                      <div className="ml-4">
                        {items.map((item) => (
                          <label key={item} className="block">
                            <input
                              type="checkbox"
                              checked={checkedItems[item] || false}
                              onChange={() => toggleCheckbox(category, subCategory, item)}
                              className="mr-2"
                            />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {renderProjects.map((project) => (
            <div key={project.id} className="relative rounded-md overflow-hidden shadow-md min-h-60 lg:max-h-100">
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
                <h2 className="text-xl font-bold text-purple-900">{project.name}</h2>
                <p className="text-sky-100 italic pl-4">{project.tech.join(', ')}</p>
                <p className="text-black text-justify pb-8">{project.description}</p>
                <p className="absolute bottom-2 left-2 text-black text-xs">{getTimeOrDate(project.date)}</p>
                <Link href={`/portfolio/${project.url}`} className='text-white absolute bottom-4 right-4'>En savoir plus...</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
