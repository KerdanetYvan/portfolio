import Link from "next/link";
import { AiFillCaretDown } from "react-icons/ai";

export default function Home() {
  return (
    <div className="bg-stone-700 min-h-screen p-0 m-0">
      {/* Hero Banner */}
      <div className="text-white h-200 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/bg-herobanner.webp)] bg-cover bg-center shadow-md">
        <div className="h-full w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-end p-64 relative">
          <h1 className="text-[96px] font-serif">Je suis Yvan Kerdanet</h1>
          <h2 className="text-4xl font-semibold mt-2">Concepteur développeur de solutions digitales</h2>
          <h3 className="text-base italic mt-1">Actuellement en recherche d'alternance pour l'année scolaire prochaine</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md absolute bottom-8">En savoir plus...</button>
        </div>
      </div>
      <div className="flex justify-center p-4">
        <AiFillCaretDown className="text-2xl text-white animate-bounce" />
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
