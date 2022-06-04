import { capitalize } from "vue";
import { createBuilder, queryBuilder, useResource, type ResourceHookCaller } from ".";
import generateStores from "./generateStores";

export interface CreateResourceProps {
  piniaPath: string;
  baseUrl: string;
  endpoints: (builder: any) => Record<string, any>;
}

export interface ResourceReturn {
    piniaPath: string;
    getStores: () =>     
}
export function createResource({
  piniaPath,
  baseUrl,
  endpoints,
}: CreateResourceProps) {
  const context: Record<string, ResourceHookCaller> = {};

  Object.entries(endpoints(createBuilder(baseUrl))).forEach(
    ([hookName, config]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - this is a hack to get the type of the function
      const builtEndpointName = `use${capitalize(hookName)}Resource`;
      const functionDefinition = function <T>() {
        return useResource<T>(baseUrl, config, queryBuilder);
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
