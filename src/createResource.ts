/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from "vue";
import {
  queryBuilder,
  useResource,
  type ResourceQuery,
  type ResourceMutator,
  QueryType,
} from "./useResource";

export interface EndpointConfig {
  query: (...args: any[]) => string | Record<string, any>;
}

type Definitions<T> = () => ResourceQuery<T> | ResourceMutator<T>;
export interface ResourceOptions<T> {
  baseUrl: string;
  endpoints(
    builder: EndpointBuilder
  ): Record<string, () => ResourceQuery<T> | ResourceMutator<T>>;
}

type EndpointBuilder = {
  query<ResultType>(definition: EndpointConfig): Definitions<ResultType>;
  mutation<T>(definition: EndpointConfig): () => ResourceMutator<T>;
};

type EndpointCollection<T> = Record<
  string,
  () => ResourceQuery<T> | ResourceMutator<T>
>;
export type ContextType<T> = keyof EndpointCollection<T>;

export type ResourceReturn<T> = {
  [key in ContextType<T>]: () => ResourceQuery<T> | ResourceMutator<T>;
};

export function createResource<T>({
  baseUrl,
  endpoints,
}: ResourceOptions<T>): Record<
  string,
  () => ResourceQuery<T> | ResourceMutator<T>
> {
  const context: Record<string, () => ResourceQuery<T> | ResourceMutator<T>> =
    {};

  const evaluated: Record<string, () => ResourceQuery<T> | ResourceMutator<T>> =
    endpoints({
      query:
        <T>(config: EndpointConfig) =>
        (): ResourceQuery<T> =>
          useResource<T>(baseUrl, config, QueryType.query, queryBuilder),
      mutation:
        <T>(config: EndpointConfig) =>
        (): ResourceMutator<T> =>
          useResource<T>(baseUrl, config, QueryType.mutator, queryBuilder),
    });

  for (const [actionName, functionDefinition] of Object.entries(evaluated)) {
    const endpointName = `use${capitalize(actionName)}Resource`;
    context[endpointName] = functionDefinition;
  }
  return context;
}
