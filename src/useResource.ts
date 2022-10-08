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

export type ResourceQueryResult<T> = [
  Ref<T | null>,
  ResourceResultProperties<T>
];

export type ResourceMutatorResult<T> = [
  Promise<void>,
  ResourceResultProperties<T>
];

export function queryBuilder(baseUrl: string, config?: EndpointConfig) {
  return function(args: any): any {
    const fetcherConfig = {
      url: baseUrl,
      body: null,
      method: "get",
    };

    if (config) {
      const params = config.query(...args);
      if (typeof params === "string") {
        fetcherConfig.url += params;
      } else {
        fetcherConfig.url += params.url;
        fetcherConfig.method = config.method || "GET";
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

export interface useResourceArgs {
  baseUrl: string;
  endpointConfig?: EndpointConfig;
  fetcher: ResourceFetcher;
}

export function useResource<T>(
  baseUrl: string,
  endpointConfig?: EndpointConfig,
  fetcher?: ResourceFetcher
): ResourceQueryResult<T>;

export function useResource<T>(
  baseUrl: string,
  endpointConfig?: EndpointConfig,
  fetcher: ResourceFetcher = queryBuilder
): ResourceQueryResult<T> | ResourceMutatorResult<T> {
  const localFetcher = fetcher || queryBuilder;
  const data = ref<T>();
  const isLoading = ref(false);
  const builder = localFetcher(baseUrl, endpointConfig);

  const fetchRequest = async (...args: any[]) => {
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

  const isQuery = !endpointConfig || endpointConfig.method == "GET";
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

export function RHC<T>(): ResourceQueryResult<T> | ResourceMutatorResult<T> {
  return useResource<T>("");
}

export type ResourceHookCaller = typeof RHC;
