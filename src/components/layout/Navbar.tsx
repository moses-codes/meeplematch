import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "~/components/layout/Layout";

import { api } from "~/utils/api";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href='/shelf'>My Shelf</Link></li>
                        <li><Link href='/gameMatcher'>Matcher</Link></li>
                        <li><Link href='/search'>Add Game</Link></li>
                    </ul>
                </div>
                <a className="btn btn-ghost normal-case text-xl">MeepleMatch</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href='/shelf'>My Shelf</Link></li>
                    <li><Link href='/gameMatcher'>Matcher</Link></li>
                    <li><Link href='/search'>Add Game</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <AuthShowcase />
            </div>
        </div>
        // <div className="navbar bg-base-100 flex px-24 py-5 items-center">
        //     <div className="flex-1 border-blue-500 border-2">
        //         <Link href='/' className="btn btn-ghost normal-case text-xl">MeepleMatch</Link>
        //     </div>
        //     <div className="flex-1 border-red-500 border-2">
        //         <ul className="menu menu-horizontal px-1 flex w-full justify-center">
        //             <li><Link href='/shelf'>My Shelf</Link></li>
        //             <li><Link href='/gameMatcher'>Matcher</Link></li>
        //             <li><Link href='/search'>Add Game</Link></li>
        //         </ul>
        //     </div>
        //     <AuthShowcase />
        // </div>
    )
}

function AuthShowcase() {
    const { data: sessionData } = useSession();
    //use the useSession function from nextAuth
    const { data: secretMessage } = api.example.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined }
    );

    console.log(sessionData)

    return (
        <div className="flex items-center justify-center w-1/2" >
            {/* < p className="text-center text-sm text-black bg-slate-400" >
                {sessionData && <span>Logged in as {sessionData.user?.name}</span>
                }
                {secretMessage && <span> - {secretMessage}</span>}
            </p > */}

            <button
                className="flex justify-between items-center rounded-full bg-slate-200 px-4 py-3 font-semibold text-black no-underline transition hover:bg-slate-400"
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData &&
                    <div className="avatar">
                        <div className="h-10 mr-5 rounded-full">
                            <img src={sessionData?.user.image} />
                        </div>
                    </div>}
                {sessionData ? <p className="text-xs">Sign out</p> : <p className="text-xs">Sign in</p>}
            </button>
        </div >
    );
}

