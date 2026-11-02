// define o endpoint HTTP dentro do App Router
import { NextResponse } from "next/server";
import { getMarketData } from "@/lib/coingecko";

// define o método GET para o endpoint
// disponibiliza a rota /api/crypto para o front-end e captura falhas que seram apresentadas no front-end
export async function GET(){
    try{
        const data = await getMarketData();

        return NextResponse.json(data);
    }
    catch(error){
        console.error("Erro ao consultar o mercado", error);

        return NextResponse.json(
            { error: "Não foi possível carregar os dados do mercado."},
            { status: 502 }
        );
    }
}
