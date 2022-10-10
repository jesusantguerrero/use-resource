import { type Ref } from "vue";
import type { EndpointConfig } from "./createResource";
export interface ResourceProperties<T> {
    refresh: () => Promise<void>;
    execute: () => Promise<void>;
    mutate: (data: T) => void;
    isLoading: Ref<boolean>;
    type: string;
}
export declare type ResourceQuery<T> = [Ref<T | null>, ResourceProperties<T>];
export declare type ResourceMutator<T> = [
    <T>(...args: any[]) => Promise<void | T>,
    ResourceProperties<T>
];
export declare function queryBuilder(baseUrl: string, config?: EndpointConfig): (args: any) => any;
export declare type ResourceFetcher = typeof queryBuilder;
export interface useResourceArgs {
    baseUrl: string;
    endpointConfig?: EndpointConfig;
    fetcher: ResourceFetcher;
}
export declare enum QueryType {
    query = 0,
    mutator = 1
}
export interface useResourceArgs {
    baseUrl: string;
    endpointConfig?: EndpointConfig;
    type: QueryType;
    fetcher: ResourceFetcher;
}
export declare function useResource<T>(baseUrl: string, endpointConfig: EndpointConfig, type: QueryType.query, fetcher?: ResourceFetcher): ResourceQuery<T>;
export declare function useResource<T>(baseUrl: string, endpointConfig: EndpointConfig, type: QueryType.mutator, fetcher?: ResourceFetcher): ResourceMutator<T>;
export declare type ResourceHook = typeof useResource;
