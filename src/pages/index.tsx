import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Layout from "~/components/layout/Layout";

import Image from "next/image";

export default function Home() {

  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        < title >MeepleMatch</title>
        <meta name="description" content="Created by moses-codes" />
        <link rel="icon" href="/3d-meeple-svgrepo-com.svg" />
      </Head >
      <Layout>
        <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-blue-700">

          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <div className='flex items-center flex-wrap justify-center'>
              <Image width={100} height={100} alt='MeepleMatch logo' className="h-20 lg:h-32 mr-5 block" src="/3d-meeple-svgrepo-com.svg" />
              <div>
                <h1 className="text-3xl lg:text-left text-center lg:text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                  <span className="text-black">Meeple</span>Match
                </h1>
                <h2 className="font-semibold text-lg lg:text-xl text-center mt-3"><span className="text-white">Guaranteed Fun </span><span className="text-black">&#40;For Everyone&#41;</span></h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white transition-all hover:-translate-y-2 hover:bg-white/20"
                href="/shelf"
              // target="_blank"
              >
                <h3 className="text-2xl font-bold">Track your board games</h3>
                <div className="text-lg">
                  Catalog your board game collection with ease!
                </div>
              </Link>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white transition-all hover:-translate-y-2 hover:bg-white/20"
                href={sessionData ? '/gameMatcher' : ''}
              // target="_blank"
              >
                <h3 className="text-2xl font-bold">Find the perfect game</h3>
                <div className="text-lg">
                  Find the perfect game to match the vibe!
                </div>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl text-white">
                {/* {hello.data ? hello.data.greeting : "Loading tRPC query..."} */}
              </p>
              <AuthShowcase />
              {/* /*The auth showcase lets the user login by using the Discord provider of NextAuth. */}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  //use the useSession function from nextAuth

  console.log(sessionData)

  return (

    <div className="flex flex-col items-center justify-center gap-4">

      {sessionData ? <button className="btn btn-primary" >Welcome back, {sessionData.user.name?.split(' ')[0]}!</button>

        :
        <button className="btn btn-primary"
          onClick={() => void signIn()}
        >Sign in to get started</button>

      }
    </div >

  );
}
