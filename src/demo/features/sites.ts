import { EndpointMutatorConfig } from "./../../createResource";
import { ISite } from "./../interfaces";
import { config } from "./../config/index";
import { createResource, useResource } from "../../index";

export const siteApi = createResource<ISite[]>({
  baseUrl: config.sitesEndpoint,
  endpoints: {
    fetchSites: {
      method: "GET",
      query: () => `/sites`,
    },
    storeSite: {
      mutator: true,
      method: "POST",
      query: (data: Record<string, any>) => ({
        url: `/sites/`,
        body: data,
      }),
    },
    updateSite: {
      mutator: true,
      method: "PATCH",
      query: (id: string, data: Record<string, any>) => ({
        url: `/sites/${id}`,
        body: data,
      }),
    },
    deleteSite: {
      mutator: true,
      method: "DELETE",
      query: (id: string) => ({
        url: `/sites/${id}`,
      }),
    },
    runCheck: {
      mutator: true,
      method: "POST",
      query: () => ({
        url: `/sites/check`,
      }),
    },
  },
});

export const {
  useUpdateSiteResource,
  useRunCheckResource,
  useFetchSitesResource,
  useStoreSiteResource,
} = siteApi;

const [data, { refresh }] = useResource<ISite[]>(config.sitesEndpoint, {
  method: "GET",
  query: () => `/sites`,
});
const configuration: EndpointMutatorConfig = {
  method: "POST",
  mutator: true,
  query: () => `/sites`,
};
const [addSite, { isLoading }] = useResource<ISite[]>(
  config.sitesEndpoint,
  configuration
);

addSite();
