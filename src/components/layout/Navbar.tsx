import Link from "next/link"
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";


export default function Navbar() {
    return (
        <div className="navbar bg-base-200">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-0 shadow bg-base-100 rounded-box w-52 font-semibold">
                        <li><Link href='/shelf'>My Shelf</Link></li>
                        <li><Link href='/gameMatcher'>Matcher</Link></li>
                        <li><Link href='/search'>Add Game</Link></li>
                    </ul>
                </div>
                <Link href='/shelf'><div className="btn btn-ghost normal-case text-sm lg:text-xl">
                    <Image alt='meeplematch logo' className="h-10" src="/3d-meeple-svgrepo-com.svg" /><span className="hidden md:inline">
                        MeepleMatch</span></div></Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-semibold">
                    <li><Link href='/shelf'>My Shelf</Link></li>
                    <li><Link href='/gameMatcher'>Matcher</Link></li>
                    <li><Link href='/search'>Add Game</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <AuthShowcase />
            </div>
        </div>
    )
}

function AuthShowcase() {
    const { data: sessionData } = useSession();
    //use the useSession function from nextAuth
    // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    //     undefined, // no input
    //     { enabled: sessionData?.user !== undefined }
    // );

    return (
        <div className="flex items-center justify-center max-w-min " >

            <button
                className="flex justify-between items-center rounded-full bg-slate-200 px-4 py-3 font-semibold text-black no-underline transition hover:bg-slate-400"
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData &&
                    <div className="avatar">
                        <div className="h-10 mr-5 rounded-full">
                            <Image alt='user profile picture' height={50} width={50} src={sessionData?.user.image ?? ''} />
                        </div>
                    </div>}
                {sessionData ? <p className="text-xs">Sign out</p> : <p className="text-xs">Sign in</p>}
            </button>
        </div >
    );
}

