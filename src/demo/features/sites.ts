import { EndpointMutatorConfig } from "./../../createResource";
import { ISite } from "./../interfaces";
import { config } from "./../config/index";
import { createResource, useResource } from "../../index";

export const siteApi = createResource<ISite[]>({
  baseUrl: config.sitesEndpoint,
  endpoints: (builder) => ({
    fetchSites: builder.query<ISite[], void>({
      query: () => `/sites`,
    }),
    storeSite: builder.mutation({
      query: (data: Record<string, any>) => ({
        method: "POST",
        url: `/sites/`,
        body: data,
      }),
    }),
    updateSite: builder.mutation({
      query: (id: string, data: Record<string, any>) => ({
        method: "PATCH",
        url: `/sites/${id}`,
        body: data,
      }),
    }),
    deleteSite: builder.mutation({
      query: (id: string) => ({
        method: "DELETE",
        url: `/sites/${id}`,
      }),
    }),
    runCheck: builder.mutation({
      mutator: true,
      method: "POST",
      query: () => ({
        url: `/sites/check`,
      }),
    }),
  }),
});

export const {
  useUpdateSiteResource,
  useRunCheckResource,
  useFetchSitesResource,
  useStoreSiteResource,
} = siteApi;
