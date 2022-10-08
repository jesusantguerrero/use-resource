import { defineStore } from "pinia";

import { siteApi } from "./features/sites";
import type { ISite } from "./interfaces";

export const useStore = defineStore(
  siteApi.piniaPath,
  siteApi.getStores<ISite[]>()
);
