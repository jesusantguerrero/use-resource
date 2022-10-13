import { defineStore } from "pinia";

import { siteApi } from "./features/sites";
import type { ISite } from "./interfaces";
interface IState {
  sites: ISite[];
}
export const useStore = defineStore("sites", {
  state(): IState {
    return {
      sites: [],
    };
  },
});
