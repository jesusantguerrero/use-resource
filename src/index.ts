import { ref, type Ref } from "vue";
import type { EndpointConfig } from "./createResource";

export interface ResourceResultProperties<T> {
  data?: Ref<T | null>;
  refresh: () => Promise<void>;
  execute: () => Promise<void>;
  mutate: (data: T) => void;
  isLoading: Ref<boolean>;
  type: string;
}

export type ResourceResult<T> = [
  Ref<T | null> | Promise<void>,
  ResourceResultProperties<T>
];

export function queryBuilder(baseUrl: string, config?: EndpointConfig) {
  return function <T>(args: any): any {
    const fetcherConfig = {
      url: baseUrl,
      method: "get",
      body: null,
    };
    console.log(config, "this is the config");
    if (config) {
      const params = config.query(...args);
      if (typeof params === "string") {
        fetcherConfig.url += params;
      } else {
        fetcherConfig.url += params.url;
        fetcherConfig.method = params.method;
        fetcherConfig.body = params.body;
      }
    }

    return fetch(fetcherConfig?.url, {
      method: fetcherConfig?.method,
      body: !fetcherConfig?.body ? null : JSON.stringify(fetcherConfig?.body),
    }).then((response) => {
      return response.json();
    });
  };
}

export type ResourceFetcher = typeof queryBuilder;

export function useResource<T>(
  baseUrl: string,
  endpointConfig?: string | Record<string, any>,
  fetcher?: ResourceFetcher
): ResourceResult<T>;
export function useResource<T>(
  baseUrl: string,
  endpointConfig?: EndpointConfig,
  fetcher: ResourceFetcher = queryBuilder
): ResourceResult<T> {
  const localFetcher = fetcher || queryBuilder;
  const data = ref<T>();
  const isLoading = ref(false);
  const builder = localFetcher(baseUrl, endpointConfig);

  const fetchRequest = async (...args) => {
    try {
      isLoading.value = true;
      data.value = undefined;
      const result = await builder(args);
      data.value = result;
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const mutate = (payload: T) => {
    data.value = payload;
  };

  const isQuery = !endpointConfig || !endpointConfig.mutation;
  if (isQuery) {
    fetchRequest();
  }

  return [
    // @ts-expect-error: we are sure of the type of data
    isQuery ? data : fetchRequest,
    {
      refresh: fetchRequest,
      execute: fetchRequest,
      mutate,
      isLoading,
      type: isQuery ? "query" : "mutation",
    },
  ];
}

interface IQueryConfig {
  query: (...args: any[]) => string;
}

export function createBuilder(baseUrl: string) {
  return {
    query: (config: IQueryConfig) => {
      return config.query();
    },
    mutation: (config: IQueryConfig) => {
      return config.query();
    },
  };
}

function RHC<T>(): ResourceResult<T> {
  return useResource<T>("");
}

export type ResourceHookCaller = typeof RHC;
