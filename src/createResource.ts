/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from "vue";
import {
  queryBuilder,
  useResource,
  type ResourceQuery,
  type ResourceMutator,
} from "./useResource";

export interface EndpointQueryConfig {
  method: "GET";
  query: (...args: any[]) => string | Record<string, any>;
}

export interface EndpointMutatorConfig {
  method: "POST" | "PATCH" | "DELETE";
  query: (...args: any[]) => string | Record<string, any>;
  mutator: boolean;
}

export type EndpointConfig = EndpointMutatorConfig | EndpointQueryConfig;
export interface ResourceOptions {
  baseUrl: string;
  endpoints: Record<string, EndpointConfig>;
}

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
}: ResourceOptions): ResourceReturn<T> {
  const context = buildEndpoints<T>(baseUrl, endpoints);

  return {
    ...context,
  };
}

export function buildEndpoints<T>(
  baseUrl: string,
  endpoints: Record<string, EndpointConfig>
): Record<string, () => ResourceQuery<T> | ResourceMutator<T>> {
  const context: Record<string, () => ResourceQuery<T> | ResourceMutator<T>> =
    {};

  for (const [hookName, endpointConfig] of Object.entries(endpoints)) {
    const builtEndpointName = `use${capitalize(hookName)}Resource`;
    const functionDefinition = function () {
      const result = useResource<T>(baseUrl, endpointConfig, queryBuilder);
      return result;
    };
    context[builtEndpointName] = functionDefinition;
  }
  return context;
}
