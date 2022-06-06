/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from "vue";
import {
  queryBuilder,
  useResource,
  type ResourceHookCaller,
  type ResourceQueryResult,
  type ResourceMutatorResult,
} from ".";
import generateStores, { type ResourceStore } from "./generateStores";

export interface EndpointConfig {
  mutation?: boolean;
  query: (...args: any[]) => string | Record<string, any>;
}
export interface CreateResourceProps {
  piniaPath?: string;
  baseUrl: string;
  endpoints: Record<string, EndpointConfig>;
}

const CustomContext: Record<string, ResourceHookCaller> = {};

type EndpointCollection = Record<string, ResourceHookCaller>;
export type ContextType = keyof EndpointCollection;

export type ResourceReturn = {
  piniaPath?: string;
  getStores: <T>() => () => ResourceStore<T>;
} & {
  [key in ContextType]: <T>() =>
    | ResourceQueryResult<T>
    | ResourceMutatorResult<T>;
};

export function createResource({
  piniaPath,
  baseUrl,
  endpoints,
}: CreateResourceProps): ResourceReturn {
  buildEndpoints(baseUrl, endpoints, CustomContext);

  return {
    piniaPath,
    // @ts-expect-error : we are sure of the type of data
    getStores: <T>() => generateStores<T>(context),
    ...CustomContext,
  };
}

export function buildEndpoints(
  baseUrl: string,
  endpoints: Record<string, EndpointConfig>,
  context: Record<string, ResourceHookCaller>
) {
  for (const [hookName, endpointConfig] of Object.entries(endpoints)) {
    const builtEndpointName = `use${capitalize(hookName)}Resource`;
    const functionDefinition: ResourceHookCaller = function <T>() {
      return useResource<T>(baseUrl, endpointConfig, queryBuilder);
    };
    context[builtEndpointName] = functionDefinition;
  }
  return context;
}
