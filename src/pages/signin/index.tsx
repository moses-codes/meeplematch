import { GetServerSideProps, type NextPage } from "next";
import { type AppProps } from "next/app";
import { getProviders, signIn, signOut, useSession } from 'next-auth/react'

import React from 'react'
import Link from "next/link";

export default function SignIn({ providers }: { providers: AppProps }) {

    console.log(providers)
    return (
        <div className="h-screen w-screen bg-gradient-to-b from-blue-300 to-blue-700 flex items-center justify-center">

            <div className="card w-96 bg-base-100 shadow-xl h-96 py-5 px-5">
                <img className='h-1/4' src='/3d-meeple-svgrepo-com.svg' />
                <div className='cardBody flex flex-col items-center justify-around h-3/4'>
                    <h1 className="text-2xl text-center ">Welcome to Meeplematch!</h1>
                    {
                        Object.values(providers).map(provider => (
                            <button
                                className="btn btn-neutral rounded-xl w-60 flex "
                                key={provider.id}
                                onClick={() => {
                                    signIn(provider.id, {
                                        callbackUrl: `/shelf`
                                    });
                                }}
                            >
                                <img src={provider.id === 'discord' ? '/discordsvg.svg' : '/googlesvg.svg'} className="h-5" />
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const providers = await getProviders()

    return {
        props: { providers },
    };

};
