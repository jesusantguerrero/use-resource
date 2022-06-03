import { rest } from "msw";
import { setupServer } from "msw/node";
import { sites } from ".";

export const server = setupServer(
  rest.get("https://example.com/api/sites", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sites));
  })
);
