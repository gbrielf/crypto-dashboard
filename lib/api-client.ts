type ApiRequestInit = RequestInit & {
    next?: {
        revalidate?: number;
    };
};

//cliente HTTP reutilizável
// função de cliente HTTP genérico que recebe um endpoint e retorna o resultado tipado (no caso da getMarketData, o tipo é CryptoAsset[])
export async function apiFetch<T>(
    endpoint: string,
    // RequestInit é um tipo nativo TypeScript que descreve opções do fetch, como método, cabeçalho e corpo
    init?: ApiRequestInit
): Promise<T> {
    const response = await fetch(endpoint, init);

    // centralização de erros
    if(!response.ok){
        let message = `Erro HTTP: ${response.status}`;

        try{
            const body = await response.json();

            if(body.error){
                message = body.error;
            }
        } catch (error) {
            console.error("Erro ao processar a resposta da API:", error, `Status: ${response.status}`);
        }

        throw new Error(message);
    }

    // retorna o objeto de sucesso
    return (await response.json()) as T;
}