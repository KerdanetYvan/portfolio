interface StackItem {
  label: string;
}

const STACK: StackItem[] = [
  { label: 'Next.js'        },
  { label: 'React'          },
  { label: 'TypeScript'     },
  { label: 'Tailwind CSS'   },
  { label: 'Node.js'        },
  { label: 'MongoDB'        },
  { label: 'PostgreSQL'     },
  { label: 'Three.js'       },
  { label: 'n8n'            },
  { label: 'Blender'        },
  { label: 'Figma'          },
  { label: 'Docker'         },
  { label: 'Git'            },
  { label: 'GitHub Actions' },
];

export default function TechStack() {
  return (
    <section aria-labelledby="stack-title" className="mx-auto max-w-[1200px] px-4 py-20 border-t">
      <p className="font-mono text-xs text-accent-bg mb-1">// stack</p>
      <h2 id="stack-title" className="text-2xl font-bold text-on-surface mb-8">
        Technologies
      </h2>
      <div className="flex flex-wrap gap-2" role="list">
        {STACK.map(({ label }) => (
          <span
            key={label}
            role="listitem"
            className="font-mono text-xs px-3 py-1.5 rounded-md border border-border text-muted bg-surface-raised hover:border-accent-bg hover:text-on-surface transition-colors"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
