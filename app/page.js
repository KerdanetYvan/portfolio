import Link from "next/link";
import { AiFillCaretDown } from "react-icons/ai";
import ProjectTile from "./components/ProjectTile";

export default function Home() {
  return (
    <div className="bg-stone-700 min-h-screen p-0 m-0">
      {/* Hero Banner */}
      <div className="text-white h-200 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/bg-herobanner.webp)] bg-cover bg-center shadow-md">
        <div className="h-full w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-end p-64 relative">
          <h1 className="text-[96px] font-serif">Je suis Yvan Kerdanet</h1>
          <h2 className="text-4xl font-semibold mt-2">Concepteur développeur de solutions digitales</h2>
          <h3 className="text-base italic mt-1">Actuellement en recherche d'alternance pour l'année scolaire prochaine</h3>
          <Link href="/about" className="absolute bottom-8"><button className="bg-blue-500 text-white px-4 py-2 rounded-md">En savoir plus...</button></Link>
        </div>
      </div>
      <div className="flex justify-center p-6">
        <AiFillCaretDown className="text-2xl text-white animate-bounce" />
      </div>

      {/* Mes derniers projet */}
      <div className="px-8 text-white relative">
        <h1 className="font-bold text-[48px] text-linear-65 from-fuchsia-400 to-sky-300">Mes derniers projets</h1>
        <p className="pl-2 italic text-stone-500">Voici un aperçu de mes derniers projets réalisés. Cette section se base sur des projets complets réalisés pour des clients fictifs ou non.</p>
        <div className="py-4 px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <ProjectTile name="Portfolio" url="portfolio" description="Mon portfolio personnel" tech="next" />
          <ProjectTile name="CoffeeX" url="coffeex" description="Application React ayant pour but de copier le fonctionnement de X (anciennement Twitter) avec un style unique inspiré du café" tech="react" />
          <ProjectTile name="CoffeeX" url="coffeex" description="Application React ayant pour but de copier le fonctionnement de X (anciennement Twitter) avec un style unique inspiré du café" />
        </div>
        <Link href="/project" className="absolute right-8"><button className="bg-blue-500 text-white px-4 py-2 rounded-md">Voir tous</button></Link>
      </div>

      {/* Mes derniers articles */}
      <div className="px-8 text-white relative">
        <h1 className="font-bold text-[48px] text-linear-65 from-fuchsia-400 to-sky-300">Mes derniers articles</h1>
        <p className="pl-2 italic text-stone-500">Voici un aperçu de mes derniers articles rédigés par mes soins ou des Challenges réalisés qui ne constituent pas un projet complet.</p>
        <div className="py-4 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        </div>
        <Link href="/blog" className="absolute right-8"><button className="bg-blue-500 text-white px-4 py-2 rounded-md">Voir tous</button></Link>
      </div>

      <h2 className="text-2xl font-semibold mt-8">Other pages :</h2>
      <ul className="list-disc list-inside mt-4">
        <li>
          <Link href="/about">
            <p className="text-lg text-blue-400 hover:underline">About</p>
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <p className="text-lg text-blue-400 hover:underline">Contact</p>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <p className="text-lg text-blue-400 hover:underline">Blog</p>
          </Link>
        </li>
        <li>
          <Link href="/portfolio">
            <p className="text-lg text-blue-400 hover:underline">Portfolio</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
