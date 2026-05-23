import { QueryClient, type QueryKey } from "@tanstack/react-query";

const COMPOSE_MARKER = "__composeKey__"

export const composeKeys = (...keys: QueryKey[]): QueryKey => {
    return [COMPOSE_MARKER, keys]
}


export const extendQueryClient = (client: QueryClient) => {
    client.invalidatePartial = async (...targetKeys: QueryKey[]) => {
        await Promise.all(
            targetKeys.map(key => {
                const targetStr = JSON.stringify(key)

                return client.invalidateQueries({
                    predicate: (query) => {
                        if (query.queryKey[0] !== COMPOSE_MARKER) return false;

                        const subKeys = query.queryKey[1] as QueryKey[]
                        
                        return subKeys.some(subKey => {
                            const subKeyStr = JSON.stringify(subKey)
                            return subKeyStr.startsWith(targetStr.slice(0, -1))
                        })
                    }
                })
            })
        )
    }
}


declare module "@tanstack/react-query" {
    interface QueryClient {
        invalidatePartial: (...targetKeys: QueryKey[]) => Promise<void>
    }
}