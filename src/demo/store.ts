import { defineStore } from "pinia";

import { piniaPath, siteApi } from "./features/sites";

export const useStore = defineStore(
  siteApi.piniaPath || "sites",
  siteApi.getStores<ISite[]>()
);
