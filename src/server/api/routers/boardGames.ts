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
    gameId: z.number(),
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
        .mutation(async ({ ctx, input }) => {
            //console.log(input)
            // input.bgMechanics.forEach(mechanic => {
            //     mechanic.mechanicId = mechanic.mechanicId
            //     const addMechanics = ctx.db.mechanic.create({
            //         data: {
            //             id: mechanic.mechanicId,
            //             mechanicText: mechanic.mechanicText,
            //             games: {
            //                 create: {

            //                 }
            //             }
            //         }
            //     })
            // })
            console.log('mee when i', input.bgMechanics, input.bgInfo)
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
