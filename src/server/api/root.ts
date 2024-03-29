import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { boardGamesRouter } from "~/server/api/routers/boardGames"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  boardGames: boardGamesRouter,
  // learning: learningRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
