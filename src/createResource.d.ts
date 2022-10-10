import { type ResourceQuery, type ResourceMutator } from "./useResource";
export interface EndpointConfig {
    query: (...args: any[]) => string | Record<string, any>;
}
declare type Definitions<T> = () => ResourceQuery<T> | ResourceMutator<T>;
export interface ResourceOptions<T> {
    baseUrl: string;
    endpoints(builder: EndpointBuilder): Record<string, () => ResourceQuery<T> | ResourceMutator<T>>;
}
declare type EndpointBuilder = {
    query<ResultType>(definition: EndpointConfig): Definitions<ResultType>;
    mutation<T>(definition: EndpointConfig): () => ResourceMutator<T>;
};
declare type EndpointCollection<T> = Record<string, () => ResourceQuery<T> | ResourceMutator<T>>;
export declare type ContextType<T> = keyof EndpointCollection<T>;
export declare type ResourceReturn<T> = {
    [key in ContextType<T>]: () => ResourceQuery<T> | ResourceMutator<T>;
};
export declare function createResource<T>({ baseUrl, endpoints, }: ResourceOptions<T>): Record<string, () => ResourceQuery<T> | ResourceMutator<T>>;
export {};
