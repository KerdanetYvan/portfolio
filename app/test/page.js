"use client";
import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
    { year: "2020", title: "Début du développement", description: "J'ai commencé à apprendre le développement web avec HTML, CSS et JavaScript." },
    { year: "2021", title: "Formation en développement", description: "J'ai suivi une formation en développement web pour approfondir mes compétences en React et Node.js." },
    { year: "2022", title: "Premier projet freelance", description: "J'ai réalisé mon premier projet en freelance pour un client dans le domaine du e-commerce." },
    { year: "2023", title: "Poste de développeur web", description: "J'ai décroché un poste de développeur web en startup, travaillant sur des applications modernes." }
];

export default function Page() {
    return (
        <div>
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-2xl font-semibold text-center text-blue-400 mb-6">Mon Parcours</h2>
                <div className="relative border-l-4 border-blue-500 ml-4">
                {timelineData.map((item, index) => (
                    <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="mb-8 pl-6 relative"
                    >
                        <span className="absolute top-2 left-[-12px] w-5 h-5 bg-blue-500 rounded-full"></span>
                        <h3 className="text-lg font-semibold text-blue-300">{item.year} - {item.title}</h3>
                        <p className="text-gray-300">{item.description}</p>
                    </motion.div>
                ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-2xl font-semibold text-center text-blue-400 mb-10">Mon Parcours</h2>

                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 before:absolute before:top-0 before:bottom-0 before:left-1/2 before:w-1 before:bg-blue-500">
                    {timelineData.map((item, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className={`relative flex items-center ${index % 2 === 0 ? "justify-start md:pr-10" : "justify-end md:pl-10"}`}
                        >
                            {/* Point de la Timeline */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full"></div>

                            <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-72">
                                <h3 className="text-lg font-semibold text-blue-300">{item.year} - {item.title}</h3>
                                <p className="text-gray-300">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
