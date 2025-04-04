"use client";
import { motion } from 'framer-motion';
import React from 'react';
import Link from 'next/link';
import { RiGithubFill, RiLinkedinFill, RiMailFill } from 'react-icons/ri';

const timelineData = [
  { year: "Juillet 2018", title: "BAC STI2D option SIN", description: "Obtention du baccalaureat avec mention bien", color: "blue" },
  { year: "Juillet>Août 2018", title: "Job saisonier", description: "Travail dans un élevage porcin, responsable général", color: "red" },
  { year: "2018>2021", title: "CPGE TSI", description: "Suite de mes études en prépa TSI (Techniques et Sciences de l'Ingénieur)", color: "blue" },
  { year: "Juillet>Août 2019, 2020, 2021", title: "Job saisonier", description: "Travail dans un élevage porcin, responsable général", color: "red" },
  { year: "2021>2024", title: "Études Ingénieur informatique", description: "J'ai réalisé 3 ans d'étude à L'EILCO Calais pour obtenir un diplôme d'ingénieur informatique", color: "blue" },
  { year: "Juin>Août 2022", title: "Job saisonier", description: "Serveur débarrasseur dans un bar de plage", color: "red" },
  { year: "Août 2023", title: "Interim", description: "Ouvrier à LivBag puis à Cronolac", color: "red" },
  { year: "Depuis septembre 2024", title: "Étude de concepteur développeur de soliton digitale", description: "Je suis depuis la rentrée 2024 des études à Digital Campus afin de devenir concepteur et développeur de solution digitale", color: "blue" },
];

export default function About() {
  const calcAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
  const birthDate = '2000-04-09'; // Replace with your actual birth date
  const age = calcAge(birthDate);

  return (
    <div className="bg-stone-700 min-h-screen text-white p-0 m-0">
      <div className='bg-[url(../public/ab-herobanner.webp)] bg-cover bg-center h-[200px] md:h-[400px] lg:h-[600px] shadow-md'>
        <div className='h-[200px] md:h-[400px] lg:h-[600px] w-full bg-black/50 backdrop-blur-[5px] flex flex-col items-end justify-around px-2 md:px-10 lg:px-20'>
          <h1 className='self-start font-bold text-xl md:text-4xl lg:text-[60px]'>Vous voulez en savoir plus sur moi ?</h1>
          <h2 className='text-end font-semibold text-xl md:text-4xl lg:text-[80px]'>Je suis Yvan Kerdanet</h2>
          <p className='text-end text-xs md:text-base lg:text-2xl'>Concepteur Développeur Web à la recherche d'une alternance</p>
        </div>
      </div>

      <main className='p-4 md:p-10 lg:p-20'>
        <section className='container mx-auto flex flex-col md:flex-row gap-4 md:gap-10 items-center justify-center bg-stone-600 rounded-lg p-4 md:p-10 shadow-md'>
          <div className='h-[100px] md:h-[200px] w-[100px] md:w-[150px] bg-[url(../public/Yvan_portrait.webp)] bg-cover bg-start rounded-lg'></div>
          <div className='md:flex md:flex-col md:gap-2'>
            <h1 className='font-bold text-sm md:text-2xl'>Courte introduction sur ma personne</h1>
            <div className='md:flex lg:items-center md:gap-4'>
              <h2 className='font-semibold text-sm md:text-base lg:text-xl px-2 md:px-0 md:pl-4'>Âge :</h2>
              <p className='text-center text-xs md:text-base md:text-start'>{age} ans - 04 septembre 2000</p>
            </div>
            <div className='md:flex lg:items-center md:gap-4'>
              <h2 className='font-semibold text-sm md:text-base lg:text-xl px-2 md:px-0 md:pl-4'>Nationalité :</h2>
              <p className='text-center text-xs md:text-base md:text-start'>Française</p>
            </div>
            <h2 className='font-semibold text-sm md:text-base lg:text-xl px-2 md:px-0 md:pl-4'>Études suivies :</h2>
            <p className='text-center text-xs md:text-base md:text-start'>Bachelor Concepteur Développeur de solution digital à <a href='https://www.digital-campus.fr/ecole/paris' target='_blank' className='font-semibold text-cyan-300 hover:text-cyan-400 hover:underline'>Digital Campus</a></p>
            <h2 className='font-semibold text-sm md:text-base lg:text-xl px-2 md:px-0 md:pl-4'>Job acutellement occupé :</h2>
            <p className='text-center text-xs md:text-base md:text-start'>En recherche d'alternance pour l'année 2025/2026</p>
          </div>
        </section>

        <div className='container mx-auto md:grid md:grid-cols-[2fr_1fr] md:gap-10 mt-10'>
          <section className='w-full mx-auto mt-10'>
            <h1 className='font-bold text-center mb-4 text-xl md:text-2xl'>Mon parcours</h1>
            <div className="relative border-l-4 border-stone-400 ml-4">
              {timelineData.map((item, index) => (
                <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="mb-8 pl-6 relative"
                >
                  <span className={`absolute top-2 left-[-12px] w-5 h-5 bg-${item.color}-500 rounded-full`}></span>
                  <h3 className={`text-lg font-semibold text-${item.color}-300`}>{item.year} - {item.title}</h3>
                  <p className="text-stone-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className='container mx-auto flex flex-col items-start justify-start bg-stone-600 rounded-lg p-4 md:p-10 shadow-md'>
            <h1 className='font-bold text-center mb-4 text-2xl'>Autres informations :</h1>
            <h2 className='font-semibold text-xl pl-2 md:pl-4'>Mon credo :</h2>
            <p className='w-full italic text-center text-stone-200 pb-4'>"A tout problème, sa solution ! Et si il n'y en a pas, on en trouvera une !"</p>
            <h2 className='font-semibold text-xl pl-2 md:pl-4'>Maitrise des langues :</h2>
            <div className='flex items-end gap-1'>
              <p>Français</p>
            </div>
            <div className='grid grid-cols-3 items-center gap-1 p-2 pb-4 md:px-4 w-full'>
              <div className='block w-full h-full rounded-full bg-amber-200'></div>
              <div className='block w-full h-full rounded-full bg-amber-200'></div>
              <div className='block w-full h-full rounded-full bg-amber-200 text-sm text-stone-700 font-bold text-center'>Natif</div>
            </div>

            <div className='flex items-end gap-1'>
              <p>Anglais</p>
              <p className='text-xs md:text-sm italic text-stone-400'>TOEIC : 845pts</p>
            </div>
            <div className='grid grid-cols-3 items-center gap-1 p-2 pb-4 md:px-4 w-full'>
              <div className='block w-full h-full rounded-full bg-white'></div>
              <div className='block w-full h-full rounded-full bg-white'></div>
              <div className='block w-full h-full rounded-full bg-white text-sm  text-stone-700 font-bold text-center'>Avancé</div>
            </div>

            <div className='flex items-end gap-1'>
              <p>Espagnol</p>
            </div>
            <div className='grid grid-cols-3 items-center gap-1 p-2 pb-4 md:px-4 w-full'>
              <div className='block w-full h-full rounded-full bg-white text-sm  text-stone-700 font-bold text-center'>Débutant</div>
              <div className='block w-full h-full rounded-full bg-stone-500'></div>
              <div className='block w-full h-full rounded-full bg-stone-500'></div>
            </div>

            <div className='pb-4'>
              <h2 className='font-semibold text-xl pl-2 md:pl-4 pb-2'>Mes softs skills :</h2>
              <ul className='list-disc list-inside md:pl-2 gap-1'>
                <li className='w-full italic'>Patient</li>
                <li className='w-full italic'>Travail en équipte</li>
                <li className='w-full italic'>Adaptabilité</li>
                <li className='w-full italic'>La communication</li>
              </ul>
            </div>

            <div>
              <h2 className='font-semibold text-xl pl-2 md:pl-4 pb-2'>Mes loisirs :</h2>
              <ul className='list-disc list-inside pl-2 gap-2'>
                <li className='w-full italic'>Jeux Vidéos (FPS, MMORPG...)</li>
                <li className='w-full italic'>Sport (Escalade, Haltérophilie, Gouren)</li>
                <li className='w-full italic'>Art (Graphisme, Couture, Dessin)</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <section className='p-8 md:p-16'>
        <h1 className='self-start font-bold text-xl md:text-4xl md:pl-8 pb-8'>Mon profil vous intéresse ?</h1>
        <h2 className='text-center font-semibold text-xl md:text-2xl pb-4'>Contactez-moi via ces plateformes :</h2>
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
