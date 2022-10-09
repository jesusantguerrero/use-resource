import { type ResourceQuery, type ResourceMutator } from "./useResource";
export interface EndpointQueryConfig {
  method: "GET";
  query: (...args: any[]) => string | Record<string, any>;
}
export interface EndpointMutatorConfig {
  method: "POST" | "PATCH" | "DELETE";
  query: (...args: any[]) => string | Record<string, any>;
  mutator: boolean;
}
export declare type EndpointConfig =
  | EndpointMutatorConfig
  | EndpointQueryConfig;
export interface ResourceOptions {
  baseUrl: string;
  endpoints: Record<string, EndpointConfig>;
}
declare type EndpointCollection<T> = Record<
  string,
  () => ResourceQuery<T> | ResourceMutator<T>
>;
export declare type ContextType<T> = keyof EndpointCollection<T>;
export declare type ResourceReturn<T> = {
  [key in ContextType<T>]: () => ResourceQuery<T> | ResourceMutator<T>;
};
export declare function createResource<T>({
  baseUrl,
  endpoints,
}: ResourceOptions): ResourceReturn<T>;
export declare function buildEndpoints<T>(
  baseUrl: string,
  endpoints: Record<string, EndpointConfig>
): Record<string, () => ResourceQuery<T> | ResourceMutator<T>>;
export {};
