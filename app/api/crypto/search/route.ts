import { NextRequest, NextResponse } from "next/server";
import { searchCoins } from "@/lib/coingecko";

// agora o get recebe parametros diferentemente do endpoint api/crypto/
// e com isso o NextRequest permite acessar os parametros da query string,
//  que é o que o front-end envia para a pesquisa
export async function GET(request: NextRequest){
    try{
        // o front pode chamar /api/crypto/search?query=bitcoin
        // NextRequest.nextUrl.searchParams.get("query")
        //  permite acessar o valor do parametro query
        const query = request.nextUrl.searchParams.get("query");
    
        if(!query || query.trim().length < 2){
            return NextResponse.json(
                { error: "Informe pelo menos 2 caracteres para pesquisar."},
                { status: 400 }
            );
        }

        const data = await searchCoins(query.trim());

        return NextResponse.json(data);
    } catch(error){
        console.error("Erro ao pesquisar criptomoedas", error);
    
        return NextResponse.json(
            { error: "Não foi possível pesquisar as criptomoedas."},
            { status: 502 }
        );
    }
}