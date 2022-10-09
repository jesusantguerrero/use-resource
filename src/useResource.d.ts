import { type Ref } from "vue";
import type { EndpointConfig, EndpointMutatorConfig } from "./createResource";
export interface ResourceProperties<T> {
    data?: Ref<T | null>;
    refresh: () => Promise<void>;
    execute: () => Promise<void>;
    mutate: (data: T) => void;
    isLoading: Ref<boolean>;
    type: string;
}
export declare type ResourceQuery<T> = [Ref<T | null>, ResourceProperties<T>];
export declare type ResourceMutator<T> = [Promise<void>, ResourceProperties<T>];
export declare function queryBuilder(baseUrl: string, config?: EndpointConfig): (args: any) => any;
export declare type ResourceFetcher = typeof queryBuilder;
export interface useResourceArgs {
    baseUrl: string;
    endpointConfig?: EndpointConfig;
    fetcher: ResourceFetcher;
}
export declare function useResource<T>(baseUrl: string, endpointConfig: EndpointConfig, fetcher?: ResourceFetcher): EndpointConfig extends EndpointMutatorConfig ? ResourceMutator<T> : ResourceQuery<T>;
export declare type ResourceHook = typeof useResource;
