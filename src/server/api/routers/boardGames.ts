import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

const bgInfoSchema = z.object({
    playTime: z.number(),
    minPlayers: z.number(),
    maxPlayers: z.number(),
    complexity: z.number(),
    image: z.string(),
});

const bgMechanicsSchema = z.array(
    z.object({
        mechanicId: z.number(),
        mechanicText: z.string(),
    })
);

export const boardGamesRouter = createTRPCRouter({

    addGame: publicProcedure
        .input(z.object({
            bgInfo: bgInfoSchema,
            bgMechanics: bgMechanicsSchema,
        }))
        .mutation(({ input }) => {
            console.log(input)
            return {
                greeting: `Hello ${input.bgInfo}`,
            };
        }),

    // addMechanics: publicProcedure
    //     .input(z.array(z.object({ mechanicId: z.number(), mechanicText: z.string() })))
    //     .mutation(({ input }) => {
    //         console.log(input)
    //         return {
    //             greeting: input,
    //         }
    //     })
});
