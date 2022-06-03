/* eslint-disable @typescript-eslint/no-empty-function */
// test-utils.js
import { createApp, type App } from "vue";

export function withSetup<T>(composable: any): [any: T, app: App<Element>] {
  let result: T;
  const app = createApp({
    setup() {
      result = composable();
      return () => {};
    },
  });
  app.mount(document.createElement("div"));
  // @ts-expect-error: we are sure of the type of result
  return [result, app];
}
