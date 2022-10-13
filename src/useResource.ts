import { ref, unref, type Ref } from "vue";
import type { EndpointConfig } from "./createResource";

export interface ResourceProperties<T> {
  refresh: () => Promise<void>;
  execute: () => Promise<void>;
  mutate: (data: T) => void;
  isLoading: Ref<boolean>;
  type: string;
}

export type ResourceQuery<T> = [Ref<T | null>, ResourceProperties<T>];

export type ResourceMutator<T> = [
  <T>(...args: any[]) => Promise<void | T>,
  ResourceProperties<T>
];

const getConfig = (args: any, baseUrl: string, config?: EndpointConfig) => {
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
      fetcherConfig.method = params.method || "GET";
      fetcherConfig.body = params.body;
    }
  }

  return fetcherConfig;
};

export function queryBuilder(baseUrl: string, config?: EndpointConfig) {
  return function (args: any): any {
    const fetcherConfig = getConfig(args, baseUrl, config);

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

export enum QueryType {
  query,
  mutator,
}
export interface useResourceArgs {
  baseUrl: string;
  endpointConfig?: EndpointConfig;
  type: QueryType;
  fetcher: ResourceFetcher;
}

export function useResource<T>(
  baseUrl: string,
  endpointConfig: EndpointConfig,
  type: QueryType.query,
  fetcher?: ResourceFetcher
): ResourceQuery<T>;

export function useResource<T>(
  baseUrl: string,
  endpointConfig: EndpointConfig,
  type: QueryType.mutator,
  fetcher?: ResourceFetcher
): ResourceMutator<T>;

export function useResource<T>(
  baseUrl: string,
  endpointConfig: EndpointConfig,
  type: QueryType.query | QueryType.mutator,
  fetcher: ResourceFetcher = queryBuilder
) {
  const localFetcher = fetcher || queryBuilder;
  const data = ref<T | null>(null) as Ref<T | null>;
  const isLoading = ref(false);
  const builder = localFetcher(baseUrl, endpointConfig);

  const fetchRequest = async <T>(...args: any[]): Promise<T | void> => {
    try {
      isLoading.value = true;
      data.value = null;
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

  const isQuery = type === QueryType.query;
  if (isQuery) {
    fetchRequest<T>();
  }

  return [
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

export type ResourceHook = typeof useResource;
