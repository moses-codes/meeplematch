import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

const bgInfoSchema = z.object({
    title: z.string(),
    playTime: z.number(),
    minPlayers: z.number(),
    maxPlayers: z.number(),
    complexity: z.number(),
    image: z.string(),
    id: z.number(),
});

const bgMechanicsSchema = z.array(
    z.object({
        id: z.number(),
        mechanicText: z.string(),
    })
);

export const boardGamesRouter = createTRPCRouter({

    addGame: protectedProcedure
        .input(z.object({
            bgInfo: bgInfoSchema,
            bgMechanics: bgMechanicsSchema,
        }))
        .mutation(async ({ ctx, input }) => {

            const { bgInfo, bgMechanics } = input

            // data: {
            //     email: 'vlad@prisma.io',
            //     posts: {
            //       connect: [{ id: 8 }, { id: 9 }, { id: 10 }],
            //     },
            //   },

            //needs an array of mechanics with each id required.
            const bgMechanicsIds = bgMechanics.map(mechanic => {
                return {
                    id: mechanic.id
                }
            })

            console.log(bgMechanicsIds)

            //add the mechanics into DB first
            const addMechanics = await ctx.db.mechanic.createMany({
                data: [...input.bgMechanics],
                skipDuplicates: true,
            })

            const addGame = await ctx.db.game.create({
                data: {
                    id: bgInfo.id,
                    title: bgInfo.title,
                    minPlayers: bgInfo.minPlayers,
                    maxPlayers: bgInfo.maxPlayers,
                    complexity: bgInfo.complexity,
                    image: bgInfo.image,
                    playTime: bgInfo.playTime,
                    mechanics: {
                        connect: [...bgMechanicsIds]
                    },

                    // posts: {
                    //     createMany: {
                    //       data: [{ title: 'My first post' }, { title: 'My second post' }],
                    //     },
                    //   },
                },
            })

            // model Game {
            //     id         String     @id @unique
            //     title      String
            //     image      String?
            //     playTime   Int
            //     maxPlayers Int
            //     minPlayers Int
            //     complexity Float
            //     user       User[]
            //     mechanics  Mechanic[]
            //     // gameSessions GameSession[]
            // }

            //connect the mechanics

            console.log(bgInfo)
        }),

});
