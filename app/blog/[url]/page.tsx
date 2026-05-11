'use client';
import { use } from 'react';
import articles from '../../../public/articles.json';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';

interface Article {
  id: number;
  titre: string;
  url: string;
  metadescription: string;
  content: string;
}

export default function ArticlePage({ params }: { params: Promise<{ url: string }> }) {
  const { url } = use(params);
  const article = (articles as Article[]).find((a) => a.url === url);

  if (!article) return <div className='bg-stone-700 min-h-screen text-white p-4'>Article introuvable.</div>;

  const components: Components = {
    h1: ({ children }) => <h1 className="text-3xl font-bold text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-medium text-white">{children}</h3>,
    p:  ({ children }) => <p className="text-white text-lg px-4">{children}</p>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600">{children}</blockquote>,
    a: ({ children, href }) => <a href={href} className="text-blue-600 underline hover:text-blue-800">{children}</a>,
    img: ({ src, alt }) => (
      <img
        src={`/articles/${article.url}/${src}`}
        alt={alt ?? ''}
        className="max-w-1/3 max-h-1/3 shadow-sm hover:shadow-lg hover:scale-125 mx-auto transition-all duration-300 ease-in-out"
      />
    ),
  };

  return (
    <div className='bg-stone-700 min-h-screen text-white pb-4'>
      <div className="text-white h-12 md:h-25 lg:h-50 justify-between items-center flex flex-col m-0 p-0 bg-[url(../public/ac-herobanner.webp)] bg-cover bg-center shadow-md">
        <div className="h-25 md:h-50 lg:h-100 w-full bg-black/30 backdrop-blur-[5px] flex flex-col justify-center items-center relative">
          <h1 className='md:text-[64px] lg:text-[96px] font-serif'>{article.titre}</h1>
        </div>
      </div>
      <div className='my-4 p-4 md:mx-16 lg:mx-32 rounded-md shadow-lg bg-stone-600'>
        <p>{article.metadescription}</p>
        <br />
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
