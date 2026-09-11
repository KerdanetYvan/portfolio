import type { Components } from 'react-markdown';

export const mdComponents: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-on-surface mt-8 mb-3 pb-2 border-b border-border">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold text-on-surface mt-6 mb-2 pb-1 border-b border-border">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold text-on-surface mt-4 mb-1">{children}</h3>,
  p:  ({ children }) => <p className="text-muted leading-relaxed my-3">{children}</p>,
  a:  ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{children}</a>,
  ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-muted">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-muted">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => <blockquote className="border-l-4 border-accent-bg pl-4 my-3 text-muted italic">{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-');
    if (isBlock) {
      return (
        <code className="block bg-surface-elevated rounded-md p-4 my-3 text-xs font-mono text-on-surface overflow-x-auto whitespace-pre">
          {children}
        </code>
      );
    }
    return <code className="bg-surface-elevated rounded px-1.5 py-0.5 text-xs font-mono text-accent">{children}</code>;
  },
  pre: ({ children }) => <>{children}</>,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? ''} className="rounded-md max-w-full my-4 mx-auto" />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="text-left px-3 py-2 border border-border text-on-surface font-semibold bg-surface-elevated">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 border border-border text-muted">{children}</td>,
  hr: () => <hr className="border-border my-6" />,
};
