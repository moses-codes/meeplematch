// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Layout from "~/components/layout/Layout";

import Game from "~/components/game/Game";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState } from "react"

import { QueryCache } from "@tanstack/react-query";

import { api } from "~/utils/api";
// import Image from "next/image";

interface BoardGame {
    complexity: number;
    id: number;
    image: string | null;
    maxPlayers: number;
    minPlayers: number;
    playTime: number;
    title: string;
    mechanics: Mechanic[];
}

interface Mechanic {
    id: number,
    mechanicText: string,
}

export default function Home() {



    const removeGame = api.boardGames.removeGameFromShelf.useMutation({
        onSuccess: (removedGame) => {
            console.log(removedGame.title, ' has been removed from your shelf.')
            setBoardGames([...boardGames].filter(g => g.id !== removedGame.id))
            const notifyRemoved = () => {
                toast.info(`${removedGame.title} has been removed from your shelf.`, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            //toast notification
            notifyRemoved()
        },
    });

    const handleChangeSort = (e: React.MouseEvent<HTMLButtonElement>) => {

        const target = e.target as HTMLButtonElement
        const input = target.id

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

    const { isSuccess, data, error, isLoading } = api.boardGames.getUserGames.useQuery(undefined, {
        onSuccess: (data) => {
            // console.log(data)
            setBoardGames(data);
            // console.log('usergames are', data)
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: false,
    });

    const [boardGames, setBoardGames] = useState<BoardGame[]>(isSuccess ? data : [])

    const [deletedGameId, setDeletedGameId] = useState<number | null>(null)


    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        // console.log('clicked')
        const currGameId = Number(e.currentTarget.value);
        setDeletedGameId(currGameId)
        removeGame.mutate({ id: currGameId }, {
            onSuccess: () => {
                setDeletedGameId(null)
            }
        });
    }

    return (

        <>
            <Layout>
                <Head>
                    <title>MeepleMatch: Shelf</title>
                    <meta name="description" content="Created by moses-codes" />
                    <link rel="icon" href="/3d-meeple-svgrepo-com.svg" />
                </Head>
                <main className=" flex min-h-screen flex-col items-center bg-slate-800 text-white">
                    <h1 className="text-5xl pt-10 pb-4">Library</h1>
                    <div className="">

                        {boardGames?.length ?
                            <div className="dropdown dropdown-hover  w-full flex justify-center ">
                                <label tabIndex={0} className="btn w-52 bg-slate-800 text-white rounded-box">Sort By...</label>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-slate-200 text-black ">
                                    <li><button onClick={handleChangeSort} className="hover:bg-slate-500 bg-white-800" id="alphaAz">Alpha &#40;A-Z&#41;</button></li>
                                    <li><button onClick={handleChangeSort} className="hover:bg-slate-500 bg-white-800" id="alphaZa">Alpha &#40;Z-A&#41;</button></li>
                                    <li><button onClick={handleChangeSort} className="hover:bg-slate-500 bg-white-800" id="complexityAsc">Complexity &#40;asc.&#41;</button></li>
                                    <li><button onClick={handleChangeSort} className="hover:bg-slate-500 bg-white-800" id="complexityDesc">Complexity &#40;desc.&#41;</button></li>
                                </ul>
                            </div>
                            :
                            (isLoading) ? <span className=" block text-center mx-auto loading loading-dots loading-lg" /> :

                                <h2 className="text-center text-2xl">Your shelf is empty! Why not <Link href='/search'><span className="text-blue-500 hover:underline">add some games?</span></Link></h2>
                        }

                        {error && error?.message !== "UNAUTHORIZED" && <p className="text-center">Error fetching games!</p>}
                        {error?.message === "UNAUTHORIZED" && <p className="text-center">Log in to see your shelf!</p>}


                        <ul className="flex flex-wrap justify-around w-screen my-5  container mx-auto ">

                            {boardGames?.map(game => (
                                <Game id={game.id}
                                    key={game.id}
                                    title={game.title}
                                    image={game.image}
                                    minPlayers={game.minPlayers} maxPlayers={game.maxPlayers}
                                    playTime={game.playTime} complexity={game.complexity}
                                    mechanics={game.mechanics}
                                    handleClick={handleClick}
                                    isBeingDeleted={removeGame.isLoading && deletedGameId == game.id}
                                    isMatcher={false}
                                />
                            ))}


                        </ul>
                    </div>
                </main>
            </Layout>
        </>
    );
}
