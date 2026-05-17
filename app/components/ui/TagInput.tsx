'use client';

import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export default function TagInput({ value, onChange, placeholder = 'Ajouter un tag…' }: Props) {
  const [input, setInput] = useState('');

  const add = (raw: string) => {
    const tags = raw.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean);
    const next = [...value, ...tags.filter((t) => !value.includes(t))];
    onChange(next);
    setInput('');
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) add(input);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) add(input);
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex min-h-[42px] flex-wrap gap-1.5 rounded-md border border-[#262626] bg-[#0a0a0a] p-2 focus-within:border-accent">
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded bg-[#1a1a1a] px-2 py-0.5 font-mono text-[11px] text-on-surface/80"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="text-muted hover:text-on-surface"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => { if (input.trim()) add(input); }}
        placeholder={value.length === 0 ? placeholder : ''}
        className="min-w-[120px] flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-muted"
      />
    </div>
  );
}
