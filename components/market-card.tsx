
import Image from "next/image";

type MarketCardProps = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  image: string;
};

export default function MarketCard({
  name,
  symbol,
  price,
  change,
  image,
}: MarketCardProps) {
  const positive = change >= 0;

  const formattedPrice = price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_minmax(130px,auto)_48px] items-center gap-4 rounded-xl border border-slate-700 bg-black/50 px-4 py-3 transition hover:border-slate-500 hover:bg-slate-900">
      
      {/* Identificação */}
      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-white">
          {name}
        </h2>
        <p className="text-sm uppercase text-slate-400">
          {symbol}
        </p>
      </div>

      {/* Preço e variação */}
      <div className="border-x border-slate-700 px-4 text-right">
        <p className="whitespace-nowrap text-base font-bold tabular-nums text-white">
          {formattedPrice}
        </p>

        <p
          className={`mt-1 text-xs font-medium tabular-nums ${
            positive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {positive ? "+" : ""}
          {change.toFixed(2)}% (24h)
        </p>
      </div>

      {/* Logo */}
      <div className="flex h-11 w-11 items-center justify-center">
        {image && (
          <Image
            src={image}
            alt={`Logo da ${name}`}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        )}
      </div>
    </article>
  );
}
