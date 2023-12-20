import { contextProps } from "@trpc/react-query/shared";
import { string, z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
const bgMechanicsSchema = z.array(
    z.object({
        id: z.number(),
        mechanicText: z.string(),
    })
);
const bgInfoSchema = z.object({
    title: z.string(),
    playTime: z.number(),
    minPlayers: z.number(),
    maxPlayers: z.number(),
    complexity: z.number(),
    image: z.string().nullable(),
    id: z.number(),
    mechanics: bgMechanicsSchema,
});



export const boardGamesRouter = createTRPCRouter({

    getUserGames: protectedProcedure
        .query(async ({ ctx }) => {
            const result = await ctx.db.game.findMany({
                where: {
                    users: {
                        some: {
                            id: ctx.session.user.id,
                        }
                    }
                },
                include: {
                    mechanics: true,
                },
            })

            return result || []

        }),
    getUserGameIds: protectedProcedure
        .query(async ({ ctx }) => {
            const result = await ctx.db.game.findMany({
                where: {
                    users: {
                        some: {
                            id: ctx.session.user.id,
                        }
                    }
                },
                select: {
                    id: true,
                },
            })

            return result

        }),

    addGame: protectedProcedure
        .input(z.object({
            bgInfo: bgInfoSchema,
            bgMechanics: bgMechanicsSchema,
        }))
        .mutation(async ({ ctx, input }) => {

            const existingGame = await ctx.db.game.findUnique({
                where: {
                    id: input.bgInfo.id,
                }
            })

            if (existingGame) {
                const connectUserToGame = await ctx.db.game.update({
                    where: {
                        id: existingGame.id,
                    },
                    data: {
                        users: {
                            connect: {
                                id: ctx.session.user.id,
                            }
                        }
                    }
                })

                return connectUserToGame
            };

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
                    users: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    }
                },
            })


            return addGame
        }),

    removeGameFromShelf: protectedProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {

            // console.log('\n\n\n***//', input.id)

            const disconnectGame = await ctx.db.game.update({

                where: {
                    id: input.id,
                },
                data: {
                    users: {
                        disconnect: [{
                            id: ctx.session.user.id,
                        }],
                    }
                }

            })

            console.log(disconnectGame)
            return disconnectGame
        }),

    updateGameImages: publicProcedure
        .input(z.object({
            id: z.number(),
            imageUrl: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.game.update({
                where: {
                    id: input.id,
                },
                data: {
                    image: input.imageUrl,
                },
            });
        })

});
