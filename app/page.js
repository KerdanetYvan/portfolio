import Link from "next/link";
import { AiFillCaretDown } from "react-icons/ai";
import { RiGithubFill, RiLinkedinFill, RiMailFill } from "react-icons/ri";
import ProjectTile from "./components/ProjectTile";
import ArticleTile from "./components/ArticleTile";

import Projets from "../public/projets.json";
import Articles from "../public/articles.json";

// Ensure Articles is defined and is an array
const articlesData = Array.isArray(Articles) ? Articles : [];

export default function Home() {
  return (
    <div className="bg-stone-700 min-h-screen p-0 m-0">
      {/* Hero Banner */}
      <div className="text-white h-100 md:h-200 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/bg-herobanner.webp)] bg-cover bg-center shadow-md">
        <div className="h-full w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-end p-16 md:p-32 relative">
          <h1 className="text-4xl md:text-[48px] lg:text-[96px] text-end font-serif">Yvan Kerdanet</h1>
          <h2 className="text-xl md:text-2xl lg:text-4xl text-end font-semibold mt-2">Concepteur développeur de solutions digitales</h2>
          <h3 className="text-base text-end italic mt-1">Actuellement en recherche d'alternance pour l'année 2025/2026</h3>
          <Link href="/about" className="absolute bottom-8"><button className="bg-blue-500 text-white px-4 py-2 rounded-md">En savoir plus...</button></Link>
        </div>
      </div>
      <div className="flex justify-center p-6">
        <AiFillCaretDown className="text-2xl text-white animate-bounce" />
      </div>

      {/* Mes derniers projet */}
      <div className="px-8 pb-8 text-white relative">
        <h1 className="font-bold text-[48px] text-linear-65 from-fuchsia-400 to-sky-300">Mes derniers projets</h1>
        <p className="pl-2 italic text-stone-500">Voici un aperçu de mes derniers projets réalisés. Cette section se base sur des projets complets réalisés pour des clients fictifs ou non.</p>
        <div className="py-4 md:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Projets.slice(0, 4).map((projet, i) => (
            <ProjectTile key={i+projet.name} name={projet.name} url={projet.url} description={projet.description} tech={projet.tech} />
          ))}
        </div>
        <Link href="/portfolio" className="absolute right-8"><button className="bg-blue-500 text-white px-4 py-2 rounded-md">Voir tous</button></Link>
      </div>

      {/* Mes derniers articles */}
      <div className="px-8 text-white relative">
        <h1 className="font-bold text-[48px] text-linear-65 from-fuchsia-400 to-sky-300">Mes derniers articles</h1>
        <p className="pl-2 italic text-stone-500">Voici un aperçu de mes derniers articles rédigés par mes soins ou des Challenges réalisés qui ne constituent pas un projet complet.</p>
        
        {articlesData.length !== 0 ? (
          <div className="py-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articlesData.slice(0, 3).map((article, i) => (
            <ArticleTile key={i + article.titre} title={article.titre} url={article.url} metadescription={article.metadescription} />
            ))}
          </div>
        ) : <p className="text-center text-stone-500 text-2xl font-bold py-16">Aucun article n'est disponible pour le moment.</p>}
        
        <Link href="/blog" className="absolute right-8"><button className="bg-blue-500 text-white px-4 py-2 rounded-md">Voir tous</button></Link>
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
  );
}
