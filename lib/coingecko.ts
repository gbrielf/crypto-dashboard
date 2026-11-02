// gera erro de build caso esse módulo seja importado em um ambiente cliente
import "server-only";
// lib é o módulo responsável por conversar com APIs externas, a lógica de integração fica nela e separada da interface
import { apiFetch } from "@/lib/api-client";


// informações de parâmetros tiradas do endpoint GET coins/markets no link: https://docs.coingecko.com/reference/coins-markets
// campos que serão usados como resposta e documentos pela Coingecko API, para que o front-end saiba o que esperar da resposta
// cripto moeda e seus dados de mercado
export type CryptoAsset = {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number | null;
};

// Promisse<CryptoAsset[]> indica que a função retorna uma promessa
//  cujo resultado é uma lista de ativos
// consulta externa com autenticação e o cache necessários
    export async function getMarketData(): Promise<CryptoAsset[]> {
    const apiKey = process.env.COINGECKO_API_KEY;

    if (!apiKey){
        throw new Error("A variável de ambiente COINGECKO_API_KEY não foi configurada.");
    }

    // URLSearchParams constroi os parâmetros da URL sem precisarmos contatenar cada um manualmente
    const params = new URLSearchParams({
        vs_currency: "brl",
        order: "market_cap_desc",
        per_page: "10",
        page: "1",
        price_change_percentage: "24h",
    });

    return apiFetch<CryptoAsset[]>(`https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`, {
        headers: {
            "x-cg-demo-api-key": apiKey,
        },
        next: {
            revalidate: 60, // revalida a cada 60 segundos
        },
    });
}

// criptomoeda encontrada na pesquisa
export type CryptoSearchResult = {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
}

type CoinGeckoSearchResponse = {
    coins: CryptoSearchResult[];
};

export async function searchCoins(
    query: string
): Promise<CryptoAsset[]> {
    const apiKey = process.env.COINGECKO_API_KEY;

    if (!apiKey) {
        throw new Error("Chave da CoinGecko não configurada.");
    }

    const headers = {
        "x-cg-demo-api-key": apiKey,
    };

    const searchParams = new URLSearchParams({ query });

    const searchData = await apiFetch<CoinGeckoSearchResponse>(
        `https://api.coingecko.com/api/v3/search?${searchParams}`, 
        {
            headers,
            next: { revalidate: 900 }
        } 
        // revalida a cada 15 minutos
    );

    // extrai os ids das moedas encontradas na pesquisa, limitando a 8 resultados
    const ids = searchData.coins.slice(0,8).map((coin) => coin.id);
        
    if (ids.length === 0) return []; // caso não encontre nenhuma moeda, retorna uma lista vazia

    const marketParams = new URLSearchParams({
        vs_currency: "brl",
        ids: ids.join(","),
        price_change_percentage: "24h",
    });

    return apiFetch<CryptoAsset[]>(
        `https://api.coingecko.com/api/v3/coins/markets?${marketParams}`, 
        {
            headers, 
            next: { revalidate: 60 }
        } // revalida a cada 60 segundos
    );
}