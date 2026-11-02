"use client";
import MarketCard from "@/components/market-card";
import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { CryptoAsset } from "@/lib/coingecko";
import { SearchBar } from "@/components/search-bar";

export default function Home(){
  // useState é um hook que permite armazenar e atualizar o estado de carregamento de um componente funcional e possíveis erros
  const [market, setMarket] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ search, setSearch] = useState(""); // estado de armazenamento do texto digitado

  // executa a consulta quando o compornente é montado, ou seja, quando a página é carregada
  useEffect(() => {
    const controller = new AbortController();

    async function loadMarket() {
      try {
        // controller signal é usado para cancelar a requisição caso o componente seja desmontado antes da conclusão da consulta
        const data = await apiFetch<CryptoAsset[]>("/api/crypto", {
          signal: controller.signal,
        });
        // atualiza o estado com os dados recebidos da API
        setMarket(data);
      }catch (error) {
        // se ela for cancelada, não atualiza o estado nem exibe erros desnecessários
        if(controller.signal.aborted){
          return;
        }

        console.error(error);
        // atualiza o estado com a mensagem de erro
        setError("Não foi possível carregar os dados do mercado.");
      // atualiza o estado de carregamento para falso, indicando que a consulta (carregamento) terminou
      }finally{
        // se ela não foi cancelada, atualiza o estado de carregamento para falso, indicando que a consulta (carregamento) terminou
        if(!controller.signal.aborted){
          setLoading(false);
        }
      }
    }

    loadMarket();

    return () => controller.abort(); // cancela a requisição caso o componente seja desmontado antes da conclusão da consulta
  }, []);

  useEffect(() => {
    // remove espaços desnecessários
    const query = search.trim();

    if(query.length < 2){
      // retorna ao top 10 se a barra de pesquisa for apagada
      if(query.length === 0){
        const controller = new AbortController();

        async function loadTopMarket(){
          try{
            setLoading(true);
            setError(null);

            const data = await apiFetch<CryptoAsset[]>("/api/crypto", {
              signal: controller.signal,
            });

            setMarket(data);
          } catch (error) {
            if(controller.signal.aborted){
              return;
            }

            console.error(error);
            setError("Não foi possível carregar os dados do mercado.");
          } finally {
            if(!controller.signal.aborted){
              setLoading(false);
            }
          }
        }

        loadTopMarket();
        return () => controller.abort();
      }
      return;
    }

    const controller = new AbortController();

    // aguarda 500ms antes de executar a pesquisa, para evitar muitas requisições à API enquanto o usuário digita
    const timeout = setTimeout(async () => {
      try{
        setLoading(true);
        setError(null);

        const data = await apiFetch<CryptoAsset[]>(
          `/api/crypto/search?query=${encodeURIComponent(query)}`,
          {signal: controller.signal}
        );

        setMarket(data);
      }catch (error) {
        // se a requisição foi cancelada, não atualiza o estado nem exibe erros desnecessários
        if(controller.signal.aborted){
          return;
        }

        console.error(error);
        setError("Não foi possível pesquisar as criptomoedas.");
      }finally{
        if(!controller.signal.aborted){
          setLoading(false);
        }
      }
    }, 500);
    // cancela a consulta agendada caso o usuário continue digitando
    return () => {
      clearTimeout(timeout);
      controller.abort();
    }; 
  }, [search]);


  return(
    <main className="min-h-screen bg-slate px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className=" mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
            Crypto Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Mercado atualizado de criptomoedas
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Acompanhe preços e variações dos principais ativos digitais.
          </p>        
        </header>

        <div className="flex mx-auto items-center mb-8 max-w-xl">
          <SearchBar 
            value={search}
            onChange={setSearch}
          />
        </div>

        
        <section
          aria-label="Resumo do mercado"
          className="border border-slate-700 bg-black/50 p-4 overflow-y-auto rounded-2xl [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.600)_transparent]"
          style={{ maxHeight: "570px" }}
        >
          {loading ? (
            <p className="py-6 text-center text-slate-400">
              Carregando dados do mercado...
            </p>
          ) : error ? (
            <p className="py-6 text-center text-rose-400">
              {error}
            </p>
          ) : market.length === 0 ? (
            <p className="py-6 text-center text-slate-400">
              Nenhuma criptomoeda encontrada.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {market.map((coin, index) => (
                <div
                  key={coin.id}
                  className={index < 10 ? "relative" : ""}
                >
                  <MarketCard
                    name={coin.name}
                    symbol={coin.symbol}
                    price={coin.current_price}
                    change={coin.price_change_percentage_24h ?? 0}
                    image={coin.image}
                  />
                </div>
              ))}
            </div>
          )}
        </section>


        <footer className="mt-10 border-t border-slate-800 pt-5 text-sm text-slate-400">
          Projeto para portfólio desenvolvido com Next.js 16 e TypeScript.
        <p className="mt-1">
          Os valores são fictícios e servem apenas para demonstração.
        </p>
        </footer>
        
      </div>
    </main>
  )
}