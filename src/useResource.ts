import { ref, type Ref } from "vue";
import type { EndpointConfig, EndpointMutatorConfig } from "./createResource";

export interface ResourceProperties<T> {
  data?: Ref<T | null>;
  refresh: () => Promise<void>;
  execute: () => Promise<void>;
  mutate: (data: T) => void;
  isLoading: Ref<boolean>;
  type: string;
}

export type ResourceQuery<T> = [Ref<T | null>, ResourceProperties<T>];

export type ResourceMutator<T> = [Promise<void>, ResourceProperties<T>];

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
      fetcherConfig.method = config.method || "GET";
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

export function useResource<T>(
  baseUrl: string,
  endpointConfig: EndpointConfig,
  fetcher?: ResourceFetcher
): EndpointConfig extends EndpointMutatorConfig
  ? ResourceMutator<T>
  : ResourceQuery<T>;

export function useResource<T>(
  baseUrl: string,
  endpointConfig: EndpointConfig,
  fetcher: ResourceFetcher = queryBuilder
) {
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

  const isQuery = endpointConfig.method !== "GET";
  if (isQuery) {
    fetchRequest();
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
