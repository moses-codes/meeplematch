import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

export const learningRouter = createTRPCRouter({
    gugu: publicProcedure
        .query(() => {
            console.log('hehe')
        }),

});
