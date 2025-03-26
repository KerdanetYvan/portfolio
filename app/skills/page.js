"use client";
import React, { useState, useEffect } from 'react';
import { RiArrowDropRightFill, RiArrowDropDownFill, RiMailFill, RiGithubFill, RiLinkedinFill } from "react-icons/ri";
import { DiAngularSimple, DiCode, DiCss3, DiDjango, DiGit, DiGithubBadge, DiGoogleDrive, DiHtml5, DiJava, DiJavascript, DiMarkdown, DiMongodb, DiMysql, DiNodejsSmall, DiPhotoshop, DiPhp, DiPython, DiReact, DiTrello } from "react-icons/di";
import { SiGoogle } from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa6";

const skills = [
    {
        "id": 1,
        "name": "HTML",
        "level": "Avancé",
        "category": ["Frontend"],
        "logo": <DiHtml5 size={50} />,
        "desc": "HTML est un langage de balisage qui permet de structurer le contenu des pages web."
    },
    {
        "id": 2,
        "name": "CSS",
        "level": "Avancé",
        "category": ["Frontend"],
        "logo": <DiCss3 size={50} />,
        "desc": "CSS est un langage de style qui permet de mettre en forme les éléments HTML d'une page web."
    },
    {
        "id": 3,
        "name": "JavaScript",
        "level": "Intermédiaire",
        "category": ["Frontend", "Backend", "Fullstack", "Mobile"],
        "logo": <DiJavascript size={50} />,
        "desc": "JavaScript est un langage de programmation qui permet de rendre les pages web dynamiques et interactives."
    },
    {
        "id": 11,
        "name": "TypeScript",
        "level": "Débutant",
        "category": ["Frontend", "Backend", "Fullstack", "Mobile"],
        "logo": <DiJavascript size={50} />,
        "desc": "TypeScript est un sur-ensemble de JavaScript qui ajoute des fonctionnalités de typage statique au langage."
    },
    {
        "id": 4,
        "name": "React",
        "level": "Intermédiaire",
        "category": ["Frontend"],
        "logo": <DiReact size={50} />,
        "desc": "React est une bibliothèque JavaScript qui permet de créer des interfaces utilisateur interactives."
    },
    {
        "id": 5,
        "name": "Node.js",
        "level": "Débutant",
        "category": ["Backend"],
        "logo": <DiNodejsSmall size={50} />,
        "desc": "Node.js est un environnement d'exécution JavaScript côté serveur qui permet de créer des applications web."
    },
    {
        "id": 6,
        "name": "Express",
        "level": "Débutant",
        "category": ["Backend"],
        "logo": <DiCode size={50} />,
        "desc": "Express est un framework Node.js qui permet de créer des applications web et des API REST."
    },
    {
        "id": 7,
        "name": "MongoDB",
        "level": "Intermédiaire",
        "category": ["Backend", "Database"],
        "logo": <DiMongodb size={50} />,
        "desc": "MongoDB est une base de données NoSQL qui permet de stocker des données sous forme de documents JSON."
    },
    {
        "id": 8,
        "name": "Python",
        "level": "Intermédiaire",
        "category": ["Backend"],
        "logo": <DiPython size={50} />,
        "desc": "Python est un langage de programmation qui permet de créer des applications web, des scripts et des outils d'automatisation"
    },
    {
        "id": 9,
        "name": "Angular",
        "level": "Débutant",
        "category": ["Fullstack", "Frontend"],
        "logo": <DiAngularSimple size={50} />,
        "desc": "Angular est un framework JavaScript qui permet de créer des applications web et mobiles avec TypeScript."
    },
    {
        "id": 10,
        "name": "C",
        "level": "Intermédiaire",
        "category": ["Autres"],
        "logo": <DiCode size={50} />,
        "desc": "C est un langage de programmation qui permet de créer des applications système et des logiciels embarqués."
    },
    {
        "id": 12,
        "name": "R. Native",
        "level": "Débutant",
        "category": ["Mobile"],
        "logo": <DiReact size={50} />,
        "desc": "React Native est un framework JavaScript qui permet de créer des applications mobiles pour Android et iOS."
    },
    {
        "id": 13,
        "name": "PHP",
        "level": "Débutant",
        "category": ["Frontend", "Backend"],
        "logo": <DiPhp size={50} />,
        "desc": "PHP est un langage de programmation qui permet de créer des applications web dynamiques et des sites web."
    },
    {
        "id": 14,
        "name": "Java",
        "level": "Débutant",
        "category": ["Frontend", "Backend", "Autres"],
        "logo": <DiJava size={50} />,
        "desc": "Java est un langage de programmation qui permet de créer des applications web, des applications mobiles et des logiciels."
    },
    {
        "id": 15,
        "name": "Figma",
        "level": "Intermédiaire",
        "category": ["UI", "UX", "Graphic"],
        "logo": <DiCode size={50} />,
        "desc": "Figma est un outil de design qui permet de créer des maquettes, des prototypes et des designs d'interfaces utilisateur."
    },
    {
        "id": 16,
        "name": "Photoshop",
        "level": "Débutant",
        "category": ["Graphic"],
        "logo": <DiPhotoshop size={50} />,
        "desc": "Photoshop est un logiciel de retouche d'image qui permet de créer des designs graphiques et des illustrations."
    },
    {
        "id": 17,
        "name": "Canva",
        "level": "Intermédiaire",
        "category": ["Graphic", "Logo"],
        "logo": <DiCode size={50} />,
        "desc": "Canva est un outil de design graphique qui permet de créer des designs, des illustrations et des documents."
    },
    {
        "id": 18,
        "name": "MySQL",
        "level": "Intermédiaire",
        "category": ["Database"],
        "logo": <DiMysql size={50} />,
        "desc": "SQL est un langage de requête structurée qui permet de manipuler des bases de données relationnelles."
    },
    {
        "id": 19,
        "name": "Word",
        "level": "Avancé",
        "category": ["Microsoft"],
        "logo": <FaMicrosoft size={50} />,
        "desc": "Microsoft Word est un logiciel de traitement de texte qui permet de créer des documents, des rapports et des lettres."
    },
    {
        "id": 20,
        "name": "Excel",
        "level": "Avancé",
        "category": ["Microsoft"],
        "logo": <FaMicrosoft size={50} />,
        "desc": "Microsoft Excel est un logiciel de tableur qui permet de créer des feuilles de calcul, des graphiques et des tableaux de bord."
    },
    {
        "id": 21,
        "name": "PowerPoint",
        "level": "Avancé",
        "category": ["Microsoft"],
        "logo": <FaMicrosoft size={50} />,
        "desc": "Microsoft PowerPoint est un logiciel de présentation qui permet de créer des diapositives, des présentations et des supports visuels."
    },
    {
        "id": 22,
        "name": "Docs",
        "level": "Avancé",
        "category": ["Google"],
        "logo": <SiGoogle size={50} />,
        "desc": "Google Docs est un logiciel de traitement de texte en ligne qui permet de créer, modifier et partager des documents."
    },
    {
        "id": 23,
        "name": "Sheets",
        "level": "Avancé",
        "category": ["Google"],
        "logo": <SiGoogle size={50} />,
        "desc": "Google Sheets est un logiciel de tableur en ligne qui permet de créer, modifier et partager des feuilles de calcul."
    },
    {
        "id": 24,
        "name": "Slides",
        "level": "Avancé",
        "category": ["Google"],
        "logo": <SiGoogle size={50} />,
        "desc": "Google Slides est un logiciel de présentation en ligne qui permet de créer, modifier et partager des diapositives."
    },
    {
        "id": 25,
        "name": "Drive",
        "level": "Avancé",
        "category": ["Google"],
        "logo": <DiGoogleDrive size={50} />,
        "desc": "Google Drive est un service de stockage en ligne qui permet de stocker, synchroniser et partager des fichiers."
    },
    {
        "id": 26,
        "name": "Trello",
        "level": "Avancé",
        "category": ["Autres"],
        "logo": <DiTrello size={50} />,
        "desc": "Trello est un outil de gestion de projet qui permet de créer des tableaux, des listes et des cartes pour organiser les tâches."
    },
    {
        "id": 27,
        "name": "Git",
        "level": "Intermédiaire",
        "category": ["Autres"],
        "logo": <DiGit size={50} />,
        "desc": "Git est un système de contrôle de version qui permet de suivre les modifications du code source et de collaborer sur des projets."
    },
    {
        "id": 31,
        "name": "GitHub",
        "level": "Intermédiaire",
        "category": ["Autres"],
        "logo": <DiGithubBadge size={50} />,
        "desc": "GitHub est une plateforme de développement collaboratif qui permet d'héberger, de partager et de collaborer sur des projets."
    },
    {
        "id": 32,
        "name": "Marckdown",
        "level": "Intermédiaire",
        "category": ["Autres"],
        "logo": <DiMarkdown size={50} />,
        "desc": "Markdown est un langage de balisage léger qui permet de formater du texte en HTML de manière simple et lisible."
    }
];

export default function page() {
    const [checkedItems, setCheckedItems] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const [renderSkills, setRenderSkills] = useState(skills);

    useEffect(() => {
        setRenderSkills(skillsToDisplay());
    }, [checkedItems]);

    const categories = {
        Developpement: [
            "Frontend",
            "Backend",
            "Fullstack",
            "Mobile",
            "Database",
        ],
        Design: [
            "UI",
            "UX",
            "Graphic",
            "Logo",
        ],
        Bureautique: [
            "Microsoft",
            "Google",
            "Autres",
        ]
    }

    const toggleCheckbox = (category, subcategory = null) => {
        setCheckedItems((prev) => {
            const newCheckedItems = { ...prev };

            if(!subcategory) {
                const newState = !newCheckedItems[category];
                newCheckedItems[category] = newState;

                Object.keys(categories[category]).forEach((sub) => {
                    newCheckedItems[`${sub}`] = newState;
                    categories[category][sub].forEach((el) => {
                        newCheckedItems[`${el}`] = newState;
                    });
                });
            } else {
                newCheckedItems[subcategory] = !newCheckedItems[subcategory];

                const allChecked = categories[category].every(
                    (subcategory) => newCheckedItems[subcategory]
                );
                newCheckedItems[category] = allChecked;
            }

            return newCheckedItems;
        })
    }

    const toggleExpand = (category) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const skillsToDisplay = () => {
        if(Object.keys(checkedItems).length === 0) {
            return skills;
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
                return skills;
            }
        
            let renderTemp = [];
            for (let elmt of tabTemp) {
                for (let skill of skills) {
                    if (skill.category.includes(elmt)) {
                        renderTemp.push(skill);
                    }
                }
            }
            // console.log("renderTemp", renderTemp);
        
            let renderSkill = [];
            for (let elmt of renderTemp) {
                if (!renderSkill.some(skill => skill.id === elmt.id)) {
                    renderSkill.push(elmt);
                }
            }
            // console.log("renderProj", renderProj);
        
            return renderSkill;
        }
    };

    return (
        <div className='bg-stone-700 min-h-screen text-white pb-4 transition-all duration-500 ease-in-out'>
            <div className="text-white h-12 md:h-25 lg:h-50 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/ac-herobanner.webp)] bg-cover bg-center shadow-md transition-all duration-500 ease-in-out">
                <div className="h-25 md:h-50 lg:h-100 w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-center relative transition-all duration-500 ease-in-out">
                    <h1 className='md:text-[64px] lg:text-[96px] font-serif transition-all duration-500 ease-in-out'>Mes Compétences</h1>
                </div>
            </div>

            <div className='w-full grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-4 max-w-[1024px] m-auto'>
                <div className='hidden md:block border-r-1 border-amber-100 text-amber-100'>
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
                        {subCategories.map((subcategory) => (
                        <div key={subcategory} className="ml-4 mt-2">
                            <label className="font-semibold">
                            <input
                                type="checkbox"
                                checked={checkedItems[subcategory] || false}
                                onChange={() => toggleCheckbox(category, subcategory)}
                                className="mr-2"
                            />
                            {subcategory}
                            </label>
                        </div>
                        ))}
                    </div>
                    )}
                    </div>
                ))}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {renderSkills.map((skill) => (
                        <div key={skill.name} className='relative group flex items-center justify-center h-[150px] w-[150px] m-auto p-4 border-2 border-white shadow-md hover:bg-white transition-all duration-500 ease-in-out'>
                            <div className='flex flex-col items-center justify-center'>
                                {skill.logo}
                                <h2 className='text-2xl text-center font-bold'>{skill.name}</h2>
                            </div>
                            <p className='absolute opacity-25 text-sm bottom-[4px] right-[4px]'>{skill.level}</p>
                            <div className='absolute top-0 left-0 p-2 h-full w-full hidden group-hover:block text-stone-800 text-xs text-justify overflow-auto overflow-x-hidden transition-all delay-300 duration-500 ease-in-out z-10'>{skill.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
