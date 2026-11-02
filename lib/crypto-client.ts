// api client sabe fazer requisições 
// e crypto client sabe qual endpoint fornece os dados do mercado
import { apiFetch } from "@/lib/api-client";
import type { CryptoAsset } from "@/lib/coingecko";

// consulta o endpoint /api/crypto e retorna a lista de ativos digitais
export function getCryptoMarket(): Promise<CryptoAsset[]> {
    return apiFetch<CryptoAsset[]>("/api/crypto");
}
