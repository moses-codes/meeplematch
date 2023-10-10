import { contextProps } from "@trpc/react-query/shared";
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

    getUserGames: protectedProcedure.query(async ({ ctx }) => {
        const result = await ctx.db.game.findMany({
            where: {
                user: {
                    some: {
                        id: ctx.session.user.id,
                    }
                }
            }
        })

        return result

    }),

    addGame: protectedProcedure
        .input(z.object({
            bgInfo: bgInfoSchema,
            bgMechanics: bgMechanicsSchema,
        }))
        .mutation(async ({ ctx, input }) => {

            const { bgInfo, bgMechanics } = input

            //needs an array of mechanics with each id required.
            const bgMechanicsIds = bgMechanics.map(mechanic => {
                return {
                    id: mechanic.id
                }
            })

            console.log('\n\n\n\n\n/*************the current user is', ctx.session.user.id, '*************/\n\n\n\n\n')

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
                    user: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    }
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

    deleteGame: protectedProcedure
        .input(z.object({
            bgInfo: bgInfoSchema,
        }))
        .mutation(async ({ ctx, input }) => {

            const disconnectGame = ctx.db.user.update({

                where: {
                    id: ctx.session.user.id
                },
                data: {
                    games: {
                        disconnect: {
                            id: input.bgInfo.id
                        }
                    }
                }

            })

            // where: {
            //     id: 16,
            //   },
            //   data: {
            //     posts: {
            //       disconnect: [{ id: 12 }, { id: 19 }],
            //     },
            //   },
        })


});
