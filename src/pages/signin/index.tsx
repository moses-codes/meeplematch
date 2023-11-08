import { type GetServerSideProps } from "next";
// import { type AppProps } from "next/app";
import { getProviders, signIn } from 'next-auth/react'

import Image from "next/image";

import React from 'react'
import Link from "next/link";

interface CustomPageProps { // <--- your custom page props
    discord: {
        callbackUrl: "http://localhost:3000/api/auth/callback/discord",
        id: "discord",
        name: "Discord",
        signinUrl: "http://localhost:3000/api/auth/signin/discord",
        type: "oauth"
    },
    google: {
        callbackUrl: "http://localhost:3000/api/auth/callback/google",
        id: "google",
        name: "Google",
        signinUrl: "http://localhost:3000/api/auth/signin/google",
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

    console.log(providers)
    return (
        <div className="h-screen w-screen bg-gradient-to-b from-blue-300 to-blue-700 flex items-center justify-center">

            <div className="card w-96 bg-base-100 shadow-xl h-96 py-5 px-5">
                <Image alt='meeplematch logo' height={100} width={100} className='h-1/4' src='/3d-meeple-svgrepo-com.svg' />
                <div className='cardBody flex flex-col items-center justify-around h-3/4'>
                    <h1 className="text-2xl text-center ">Welcome to Meeplematch!</h1>
                    {
                        Object.values(providers).map((provider: Provider) => (
                            <button
                                className="btn btn-neutral rounded-xl w-60 flex "
                                key={provider.id}
                                onClick={() => {
                                    void signIn(provider.id, {
                                        callbackUrl: `/shelf`
                                    });
                                }}
                            >
                                <Image alt={`${provider.name} logo`} height={50} width={50} src={provider.id === 'discord' ? '/discordsvg.svg' : '/googlesvg.svg'} className="h-5 inline" />
                                Sign in with {provider.name}
                            </button>
                        ))
                    }
                    <p className="text-xl font-semibold"><Link href={`/`}>	&#60; Back </Link></p>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders()

    return {
        props: { providers },
    };

};
