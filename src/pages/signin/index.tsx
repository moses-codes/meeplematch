import { type GetServerSideProps } from "next";
// import { type AppProps } from "next/app";
import { getProviders, signIn } from 'next-auth/react'

import Image from "next/image";

import React from 'react'
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

interface CustomPageProps { // <--- your custom page props
    discord: {
        callbackUrl: "/api/auth/callback/discord",
        id: "discord",
        name: "Discord",
        signinUrl: "/api/auth/signin/discord",
        type: "oauth"
    },
    google: {
        callbackUrl: "/api/auth/callback/google",
        id: "google",
        name: "Google",
        signinUrl: "/api/auth/signin/google",
        type: "oauth"
    }
}

interface Provider {
    callbackUrl: string;
    id: string;
    name: string;
    signinUrl: string;
    type: string;
}

export default function SignIn({ providers }: { providers: CustomPageProps }) {

    return (
        <div className="h-screen w-screen bg-gradient-to-b from-blue-300 to-blue-700 flex items-center justify-center">

            <div className="card w-96 bg-base-100 shadow-xl h-96 py-5 px-5">
                <div className="mx-auto">
                    <Image alt='meeplematch logo' height={100} width={100} className='h-full' src='/3d-meeple-svgrepo-com.svg' />
                </div>
                <div className='cardBody flex flex-col items-center justify-around h-3/4'>
                    <h1 className="text-2xl text-center ">Welcome to Meeplematch!</h1>
                    {
                        Object.values(providers).map((provider: Provider) => (
                            <button
                                className="btn btn-neutral rounded-xl w-60 block "
                                key={provider.id}
                                onClick={() => {
                                    void signIn(provider.id, {
                                        callbackUrl: `${window.location.origin}/shelf`,
                                    });
                                }}
                            >
                                <p className="flex items-center">
                                    <Image alt={`${provider.name} logo`} height={25} width={25} src={provider.id === 'discord' ? '/discordsvg.svg' : '/googlesvg.svg'} className="h-5 mr-3 inline" />
                                    Sign in with {provider.name}
                                </p>
                            </button>

                        ))
                    }
                    <p className="text-xl font-semibold hover:underline"><Link href={`/`}>	&#60; Back </Link></p>
                </div>
            </div>
        </div >
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders()

    return {
        props: { providers },
    };

};
