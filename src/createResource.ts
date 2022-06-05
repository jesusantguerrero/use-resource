import { capitalize } from "vue";
import {
  createBuilder,
  queryBuilder,
  useResource,
  type ResourceHookCaller,
  type ResourceResult,
} from ".";
import generateStores from "./generateStores";

export interface EndpointConfig {
  query: (...args: any[]) => string;
}
export interface CreateResourceProps {
  piniaPath: string;
  baseUrl: string;
  endpoints: (builder: any) => Record<string, EndpointConfig>;
}

export interface ResourceReturn {
  piniaPath: string;
  getStores: <T>() => ResourceResult<T>;
  [key: string]: <T>() => ResourceResult<T>;
}
export function createResource({
  piniaPath,
  baseUrl,
  endpoints,
}: CreateResourceProps) {
  const context: Record<string, ResourceHookCaller> = {};

  Object.entries(endpoints(createBuilder(baseUrl))).forEach(
    ([hookName, endpointConfig]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - this is a hack to get the type of the function
      const builtEndpointName = `use${capitalize(hookName)}Resource`;
      const functionDefinition = function <T>() {
        return useResource<T>(baseUrl, endpointConfig, queryBuilder);
      };
      Object.assign(context || {}, { [builtEndpointName]: functionDefinition });
    },
    {}
  );

  return {
    piniaPath,
    getStores: <T>() => generateStores<T>(context),
    ...context,
  };
}
