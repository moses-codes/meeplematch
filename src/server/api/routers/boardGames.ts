import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const boardGamesRouter = createTRPCRouter({
    addGame: publicProcedure
        .input(z.object({
            playTime: z.number(),
            minPlayers: z.number(),
            maxPlayers: z.number(),
            complexity: z.number(),
            image: z.string(),
        }))
        .mutation(({ input }) => {
            console.log(input)
            return {
                greeting: `Hello ${input.playTime}`,
            };
        }),
});
