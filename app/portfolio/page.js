"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiArrowDropRightFill, RiArrowDropDownFill, RiMailFill, RiGithubFill, RiLinkedinFill } from "react-icons/ri";
import projects from '../../public/projets.json';

export default function Portfolio() {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [renderProjects, setRenderProjects] = useState(projects);

  useEffect(() => {
    setRenderProjects(projectsToDisplay());
    // console.log("render projets :", renderProjects);
    // console.log(new Date());
    getTimeOrDate(new Date());
  }, [checkedItems]);

  const categories = {
    Developpement: {
      Frontend: ["React", "Vue", "Angular"],
      Backend: ["Node", "Express", "Django", "Flask"],
      Mobile: ["React Native", "Flutter"],
      BDD: ["MongoDB", "PostgreSQL", "MySQL", "SQLite"],
      CMS: ["WordPress", "Drupal", "Joomla"],
    },
    Design: {
      UI: ["Figma", "Adobe XD"],
      UX: ["Adobe XD", "Sketch"],
      Graphisme: ["Photoshop", "Illustrator", "InDesign"],
    },
    Bureautique: {
      Office: ["Word", "Excel", "PowerPoint", "Outlook", "Access", "Teams"],
      Google: ["Docs", "Sheets", "Slides", "Gmail"],
      LibreOffice: ["Writer", "Calc", "Impress", "Mail"],
      Autres: ["Notion", "Trello", "Slack", "Zoom", "Canva"],
    }
  }

  const toggleCheckbox = (category, subCategory = null, item = null) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev };

      if (!subCategory) {
        // Coche/décoche une catégorie principale
        const newState = !newCheckedItems[category];
        newCheckedItems[category] = newState;

        // Met à jour les sous-catégories et éléments
        Object.keys(categories[category]).forEach((sub) => {
          newCheckedItems[`${sub}`] = newState;
          categories[category][sub].forEach((el) => {
            newCheckedItems[`${el}`] = newState;
          });
        });

      } else if (!item) {
        // Coche/décoche une sous-catégorie
        const newState = !newCheckedItems[`${subCategory}`];
        newCheckedItems[`${subCategory}`] = newState;

        categories[category][subCategory].forEach((el) => {
          newCheckedItems[`${el}`] = newState;
        });

        // Vérifier si toute la catégorie principale doit être cochée
        const allChecked = Object.keys(categories[category]).every(
          (sub) => newCheckedItems[`${sub}`]
        );
        newCheckedItems[category] = allChecked;

      } else {
        // Coche/décoche un élément
        newCheckedItems[`${item}`] =
          !newCheckedItems[`${item}`];

        // Vérifie si toute la sous-catégorie est cochée
        const allChecked = categories[category][subCategory].every(
          (el) => newCheckedItems[`${el}`]
        );
        newCheckedItems[`${subCategory}`] = allChecked;

        // Vérifie si toute la catégorie principale est cochée
        const allSubChecked = Object.keys(categories[category]).every(
          (sub) => newCheckedItems[`${sub}`]
        );
        newCheckedItems[category] = allSubChecked;
      }

      // console.log(newCheckedItems);
      return newCheckedItems;
    });
  };

  const toggleExpand = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const projectsToDisplay = () => {
    if(Object.keys(checkedItems).length === 0) {
      return projects;
    } else {
      let tabTemp = [];
      for (let elmt of Object.keys(checkedItems)) {
        // console.log(elmt);
        if(checkedItems[elmt] == true) {
          tabTemp.push(elmt);
        }
      }
      // console.log("tabTemp", tabTemp);
      if(tabTemp.length === 0) {
        return projects;
      }

      let renderTemp = [];
      for (let elmt of tabTemp) {
        for (let project of projects) {
          if (project.tech.includes(elmt)) {
            renderTemp.push(project);
          }
        }
      }
      // console.log("renderTemp", renderTemp);

      let renderProj = [];
      for (let elmt of renderTemp) {
        if (!(elmt in renderProj)) {
          renderProj.push(elmt);
        }
      }
      // console.log("renderProj", renderProj);

      return renderProj;
    }
  };

  const getTimeOrDate = (date) => {
    const today = new Date();
    const todayString = today.toISOString();
    const tabToday = todayString.split("T");
    const dateToday = tabToday[0];
    const heureToday = tabToday[1];

    // Ensure 'date' is a string
    const dateString = String(date);
    // console.log("todayString", todayString);
    // console.log("dateString", dateString);
    
    // Split based on space or another delimiter if needed
    const tabArt = dateString.split("T"); // ISO format uses "T" to separate date and time
    const dateArt = tabArt[0];
    const heureArt = tabArt[1];

    // Compare the two dates
    // console.log('tabArt', tabArt);
    // console.log('dateArt', dateArt, "et dateToday", dateToday);
    if (dateArt == dateToday) {
      // Compare the two times
      if (heureArt == heureToday) {
        return "à l'instant";
      } else {
        // Get the time difference
        const [hours, minutes] = heureArt.split(":");
        const [hoursToday, minutesToday] = heureToday.split(":");
        const diffHours = Number(hoursToday) - Number(hours);
        const diffMinutes = Number(minutesToday) - Number(minutes);
        if (diffHours >= 12) {
          return `12h`;
        } else if (diffHours !== 0) {
          return `${diffHours} h`;
        } else {
          return `${diffMinutes} min`;
        }
      }
    } else {
      // Get the date difference
      const [year, month, day] = dateArt.split("-");
      const [yearToday, monthToday, dayToday] = dateToday.split("-");
      const diffYears = Number(yearToday) - Number(year);
      const diffMonths = Number(monthToday) - Number(month);
      const diffDays = Number(dayToday) - Number(day);
      if(diffYears === 0 && diffMonths === 0) {
        return `${diffDays} j`;
      } else if(diffYears === 0 && diffMonths <= 3) {
        return `${diffMonths} mois`;
      } else {
        return (`${day}/${month}/${year}`);
      }
    }
  }

  return (
    <div className="bg-stone-700 min-h-screen p-0 m-0">
      <div className="text-white h-25 md:h-50 lg:h-100 justify-between items-center flex flex-col m-0 p-0  bg-cover bg-center shadow-md">
        <div className="h-25 md:h-50 lg:h-100 w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-center relative">
          <h1 className='md:text-[64px] lg:text-[96px] font-serif'>Portfolio</h1>
          <p className='hidden md:block lg:block italic text-stone-200'>Voici un aperçu de mes derniers projets réalisés</p>
        </div>
      </div>
      <div className='flex justify-end p-6'>
        <Link href="/skills" className='bg-blue-500 text-white px-4 py-2 rounded-md'>Toutes mes Compétences</Link>
      </div>

      {/* tout mes projets */}
      <div className='w-full grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 p-4 md:px-16 lg:px-32'>
        <div className='hidden lg:block border-r-1 border-amber-100 text-amber-100'>
          {Object.entries(categories).map(([category, subCategories]) => (
          <div key={category} className="mb-2">
            <div className="flex items-center">
              <button
                onClick={() => toggleExpand(category)}
                className="mr-2 text-lg font-bold"
              >
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
                <p className="text-sky-100 italic pl-4">{project.tech.join(", ")}</p>
                <p className="text-black text-jsutify pb-8">{project.description}</p>
                <p className="absolute bottom-2 left-2 text-black text-xs">{getTimeOrDate(project.date)}</p>
                <Link href={`/portfolio/${project.url}`} className='text-pink-950/30 absolute bottom-4 right-4'>En savoir plus...</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6">
        <h3 className="text-3xl font-semibold text-center text-white mb-8">Contactez-moi</h3>
        <div className="flex justify-center gap-6">
          <a href="mailto:kerdanety@gmail.com" className="text-pink-300">
            <RiMailFill size={32} />
          </a>
          <a href="https://github.com/KerdanetYvan" target="_blank" className="text-green-400">
            <RiGithubFill size={32} />
          </a>
          <a href="https://linkedin.com/in/yvankerdanet" target="_blank" className="text-sky-500">
            <RiLinkedinFill size={32} />
          </a>
        </div>
      </section>
    </div>
  )
}