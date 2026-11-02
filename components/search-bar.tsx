"use client";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Pesquisar criptomoeda..."
            aria-label="Pesquisar criptomoeda"
            className="w-full rounded-xl border border-slate-700 bg-black px-4 py-3 text-white outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-400 placeholder:text-white/60 placeholder:font-medium"
        />
    );
}