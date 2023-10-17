import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Layout from "~/components/layout/Layout";

import { useState } from "react"

import { api } from "~/utils/api";
import { type } from "os";

interface BoardGame {
    complexity: number;
    id: number;
    image: string;
    maxPlayers: number;
    minPlayers: number;
    playTime: number;
    title: string;
    mechanics: [];
}

interface Mechanic {
    id: number,
    mechanicText: string,
}

export default function Home() {

    const [boardGames, setBoardGames] = useState<BoardGame[]>([])

    const removeGame = api.boardGames.removeGameFromShelf.useMutation();

    const handleChangeSort = (e: React.ChangeEvent<HTMLInputElement>) => {

        let input = e.target.id

        if (input === "alphaAz") {
            setBoardGames([...boardGames].sort((a, b) => a.title.localeCompare(b.title)))
        }
        if (input === "alphaZa") {
            setBoardGames([...boardGames].sort((a, b) => b.title.localeCompare(a.title)))
        }
        if (input === "complexityAsc") {
            setBoardGames([...boardGames].sort((a, b) => a.complexity - b.complexity))
        }
        if (input === "complexityDesc") {
            setBoardGames([...boardGames].sort((a, b) => b.complexity - a.complexity))
        }

    }

    const { data: userGames } = api.boardGames.getUserGames.useQuery(undefined, {
        onSuccess: (data) => {
            setBoardGames(data)
        },
    });

    async function handleClick(e) {
        let deletedGameId: number = Number(e.target.value)
        setBoardGames([...boardGames].filter(g => g.id !== deletedGameId))
        const result = await removeGame.mutate({ id: deletedGameId })
    }

    console.log('the users games are: ', { boardGames })

    return (
        <>
            <Layout>
                <Head>
                    <title>MeepleMatch: Shelf</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className=" flex min-h-screen flex-col items-center bg-slate-300">
                    <h1 className="text-5xl">Library</h1>
                    <div>
                        {boardGames.length &&
                            <div className="dropdown dropdown-hover">
                                <label tabIndex={0} className="btn m-1">Sort By...</label>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><a onClick={handleChangeSort} id="alphaAz">Alpha &#40;A-Z&#41;</a></li>
                                    <li><a onClick={handleChangeSort} id="alphaZa">Alpha &#40;Z-A&#41;</a></li>
                                    <li><a onClick={handleChangeSort} id="complexityAsc">Complexity &#40;asc.&#41;</a></li>
                                    <li><a onClick={handleChangeSort} id="complexityDesc">Complexity &#40;desc.&#41;</a></li>
                                </ul>
                            </div>
                        }
                        <ul className="flex flex-wrap justify-start w-screen my-5  container mx-auto">

                            {boardGames && boardGames.map((game: BoardGame) => {
                                return <li className="card w-96 bg-base-100 shadow-xl p-5 m-5 text-center " key={game.id}>
                                    <h2 className="text-2xl font-bold">{game.title}</h2>
                                    <p>Players: {game.minPlayers} - {game.maxPlayers}</p>
                                    <img className='inline-block mx-auto' src={game.image} alt={`Box art for ${game.title}`} />
                                    <p>Play time: {game.playTime} min</p>
                                    <p>Complexity: {(game.complexity).toPrecision(3)} / 5</p>
                                    <details className="dropdown mb-10 mt-5">
                                        <summary className="m-1 btn">Mechanics</summary>
                                        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-64 mx-12">
                                            {game.mechanics.map((m: Mechanic) => {
                                                return <li key={m.id}>{m.mechanicText}</li>
                                            })}
                                        </ul>
                                    </details>
                                    <button
                                        onClick={handleClick}
                                        className="btn btn-error w-1/2 mx-auto"
                                        value={game.id}
                                    >Delete</button>
                                </li>
                            })}

                        </ul>
                    </div>
                </main>
            </Layout>
        </>
    );
}

function AuthShowcase() {
    const { data: sessionData } = useSession();
    //use the useSession function from nextAuth
    const { data: secretMessage } = api.example.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined }
    );

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
                {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
                {secretMessage && <span> - {secretMessage}</span>}
            </p>
            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
    );
}
