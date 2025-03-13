"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiArrowDropRightFill, RiArrowDropDownFill } from "react-icons/ri";
import projects from '../../public/projets.json';

export default function Portfolio() {
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [renderProjects, setRenderProjects] = useState(projects);

  useEffect(() => {
    setRenderProjects(projectsToDisplay());
    // console.log("render projets :", renderProjects);
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

      {/* tout mes projets */}
      <div className='w-full grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-4 px-32'>
        <div className='border-r-1 border-amber-100 text-amber-100'>
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
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {renderProjects.map((project) => (
            <div key={project.id} className="bg-stone-800 p-4 rounded-md shadow-md max-h-80">
              <h2 className="text-xl font-bold">{project.name}</h2>
              <p className="text-stone-200">{project.description}</p>
              <p className="text-stone-200">{project.tech.join(", ")}</p>
              <p className="text-stone-200">{project.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
