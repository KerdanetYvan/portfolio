import React, { use } from 'react';
import articles from '../../../public/articles.json';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function page({ params }) {
    const urlParams = use(params);
    const { url } = urlParams;

    const article = articles.find((article) => article.url === url);
    console.log(article);

    return (
        <div className='bg-stone-700 min-h-screen text-white pb-4 transition-all duration-500 ease-in-out'>
            <div className="text-white h-12 md:h-25 lg:h-50 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/ac-herobanner.webp)] bg-cover bg-center shadow-md transition-all duration-500 ease-in-out">
                <div className="h-25 md:h-50 lg:h-100 w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-center relative transition-all duration-500 ease-in-out">
                    <h1 className='md:text-[64px] lg:text-[96px] font-serif transition-all duration-500 ease-in-out'>{article.titre}</h1>
                </div>
            </div>
            <div className='my-4 p-4 md:mx-16 lg:mx-32 rounded-md shadow-lg bg-stone-600 transition-all duration-500 ease-in-out'>
                <p>{article.metadescription}</p>
                <br />
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-white transition-all duration-500 ease-in-out">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-semibold text-white transition-all duration-500 ease-in-out">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-medium text-white transition-all duration-500 ease-in-out">{children}</h3>,
                        p: ({ children }) => <p className="text-white text-lg px-4 transition-all duration-500 ease-in-out">{children}</p>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600 transition-all duration-500 ease-in-out">{children}</blockquote>,
                        a: ({ children, href }) => (
                            <a href={href} className="text-blue-600 underline hover:text-blue-800 transition-all duration-500 ease-in-out">
                            {children}
                            </a>
                        ),
                        img: ({ src, alt }) => <img src={`/articles/${article.url}/${src}`} alt={alt} className="max-w-1/3 max-h-1/3 shadow-sm hover:shadow-lg hover:scale-125 mx-auto transition-all duration-300 ease-in-out" />,
                    }}
                >{article.content}</ReactMarkdown>
            </div>
        </div>
    )
}
