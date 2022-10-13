import { ISite } from "./../interfaces";
import { config } from "./../config/index";
import { createResource } from "../../index";

export const siteApi = createResource<ISite[]>({
  baseUrl: config.sitesEndpoint,
  endpoints: (builder) => ({
    fetchSites: builder.query<ISite[]>({
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
      query: () => ({
        method: "POST",
        url: `/sites/check`,
      }),
    }),
  }),
});

const { use } = createResource<ISite[]>({
  baseUrl: config.sitesEndpoint,
  endpoints: (builder) => ({
    test: builder.query({
      query: () => "/sites",
    }),
  }),
});

export const {
  useUpdateSiteResource,
  useRunCheckResource,
  useFetchSitesResource,
  useStoreSiteResource,
} = siteApi;
