# MeepleMatch
MeepleMatch is a game that lets board game nerds decide, once and for all, what to play.

**Link to project:** [Try it for yourself!](https://meeplematch-moses-codes.vercel.app/)

![screenshot of meeplematch](https://i.ibb.co/xmg0P5h/Screen-Shot-2023-12-08-at-2-26-40-PM.png)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, Next.js, Prisma, tRPC, TailwindCSS

Using the T3 stack, I was able to get a sense of how modern web development has been streamlined. REST APIs are taken over by tRPC, which offers a simple interface for querying databases (here with Prisma), as well as a simple client API for making changes to the front end. Next.js is a full-stack framework that utilizes server side generation to speed up performance and optimize SEO. 

## Optimizations

For the future, I would like to implement the ability to view friends' board game libraries, as well as record play sessions for board games. 

## Lessons Learned:

The T3 stack is useful for quickly generating a full-stack app by abstracting many aspects of full stack development. Prisma in particular translates SQL databases to a more JavaScript-friendly syntax (like MongoDB), and may suffer in larger-scale deployments.

No matter how modern a stack touts itself to be, there will always a learning curve. A stack like T3 seeks to streamline processes that are posed by other stacks (hence the use of tRPC). While the end result is fairly intuitive, the time it took to familiarize myself was a tradeoff. 

I enjoy the developer experience provided by tRPC. The navigability between server and client with a simple command-click is extremely useful and satisfying.
