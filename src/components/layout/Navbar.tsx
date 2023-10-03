import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "~/components/layout/Layout";

import { api } from "~/utils/api";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 flex px-24 py-5 items-center">
            <div className="flex-1 border-blue-500 border-2">
                <Link href='/' className="btn btn-ghost normal-case text-xl">MeepleMatch</Link>
            </div>
            <div className="flex-1 border-red-500 border-2">
                <ul className="menu menu-horizontal px-1 flex w-full justify-center">
                    <li><Link href='/shelf'>My Shelf</Link></li>
                    <li><Link href='/search'>Add Game</Link></li>
                </ul>
            </div>
            <AuthShowcase />
        </div>
    )
}

function AuthShowcase() {
    const { data: sessionData } = useSession();
    //use the useSession function from nextAuth
    const { data: secretMessage } = api.example.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined }
    );

    return (
        <div className="flex flex-col items-center justify-center w-1/4" >
            < p className="text-center text-2xl text-black bg-slate-400" >
                {sessionData && <span>Logged in as {sessionData.user?.name}</span>
                }
                {secretMessage && <span> - {secretMessage}</span>}
            </p >
            <button
                className="rounded-full bg-slate-200 px-10 py-3 font-semibold text-black no-underline transition hover:bg-slate-400"
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div >
    );
}

