import { useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import React, { useState } from "react";
import Layout from "~/components/layout/Layout";

// import Image from "next/image";

import Game from "~/components/game/Game";

import { api } from "~/utils/api";

interface FormData {
    numPlayers: number;
    complexity: number; // Assuming you want to store the selected value as a string
    playTime: number;
}

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

export default function GameMatcher() {
    const { data: sessionData } = useSession();

    const { data: userGames, isLoading: gamesLoading, isSuccess, isError } = api.boardGames.getUserGames.useQuery(undefined, {
        onSuccess: (data) => {
            setBoardGames(data)
            setMaxPlayerCount(findHighestPlayerCount(data, data.length)!)
        },
        refetchOnWindowFocus: false,
        retry: 0,
    });




    const [filteredGames, setFilteredGames] = useState<BoardGame[]>([])

    const [maxPlayerCount, setMaxPlayerCount] = useState<number>(0)


    const [boardGames, setBoardGames] = useState<BoardGame[]>(isSuccess ? userGames : [])

    // console.log(maxPlayerCount, userGames)

    const [formData, setFormData] = useState<FormData>({
        numPlayers: 3, // Initialize with default values
        complexity: 0,
        playTime: 120,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        // console.log(name, value)
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target;
        // console.log(name, value)
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleChangeSort = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {

        console.log(e)

        const input = ((e.target) as HTMLButtonElement).id

        if (input === "alphaAz") {
            setFilteredGames([...filteredGames].sort((a, b) => a.title.localeCompare(b.title)))
        }
        if (input === "alphaZa") {
            setFilteredGames([...filteredGames].sort((a, b) => b.title.localeCompare(a.title)))
        }
        if (input === "complexityAsc") {
            setFilteredGames([...filteredGames].sort((a, b) => a.complexity - b.complexity))
        }
        if (input === "complexityDesc") {
            setFilteredGames([...filteredGames].sort((a, b) => b.complexity - a.complexity))
        }
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // console.log(formData)

        const result = boardGames.filter(game => {
            return filterComplexity(game.complexity, formData.complexity) && filterNumPlayers(game.minPlayers, game.maxPlayers, formData.numPlayers) && filterPlayTime(game.playTime, formData.playTime)
        })
            .sort((a, b) => b.complexity - a.complexity)

        setFilteredGames(result)

        // console.log(result)
    };

    function handleClick() {
        console.log('clicked')
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>MeepleMatch: Add Game</title>
                    <meta name="description" content="Created by moses-codes" />
                    <link rel="icon" href="/3d-meeple-svgrepo-com.svg" />
                </Head>
                <main className=" flex min-h-screen flex-col items-center pt-12 bg-slate-800 text-slate-100 pb-36">
                    <div className="border-2 border-slate-300 rounded-xl p-10 bg-slate-800 mx-2">
                        <h1 className="text-3xl mb-12 text-center">Game Matcher</h1>

                        <form onSubmit={handleSubmit} className='flex flex-col justify-around h-80 w-full lg:w-96 '>

                            {

                                gamesLoading ? <>
                                    <p className="mx-auto">Loading</p>
                                    <span className="loading loading-dots loading-sm mx-auto"></span>

                                </> :
                                    <>
                                        <div className='flex flex-col h-8'>
                                            <div className="flex justify-between items-center">
                                                <label className='text-sm md:text-xl' htmlFor="numPlayers"># of players:</label>
                                                <input max={maxPlayerCount} className='text-slate-800 rounded-md pl-2 w-1/2 ml-5 text-sm md:text-xl' type="number" id="numPlayers" name="numPlayers" value={formData.numPlayers} onChange={handleChange} />
                                            </div>
                                            {maxPlayerCount ? <label className='mt-2 text-xs' htmlFor="numPlayers">*Max player count is currently {maxPlayerCount}.</label> : ""}
                                        </div>


                                        <div className="py-4 mt-6">
                                            <div className="flex justify-between items-center">
                                                <label className='text-sm md:text-xl' htmlFor="playTime">Play time &#40;min.&#41;: </label>
                                                <input className='text-slate-800 rounded-md pl-2 w-1/2 ml-5 text-sm md:text-xl' type='number' id="playTime" name="playTime" value={formData.playTime} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <label className='text-center text-sm md:text-xl ' htmlFor="complexity">Maximum complexity</label>
                                            <div className="flex  mt-2 justify-between h-16">
                                                <div className="form-control">
                                                    <label className="label cursor-pointer flex-col">
                                                        <input onChange={handleRadioChange} type="radio" name="complexity" className="border-white radio radio-sm checked:bg-green-500" value={2} />
                                                        <span className="label-text text-xs text-center text-white mt-2">More Simple</span>
                                                    </label>
                                                </div>
                                                <div className="form-control">
                                                    <label className="label cursor-pointer flex-col">
                                                        <input onChange={handleRadioChange} type="radio" name="complexity" className="border-white  radio radio-sm checked:bg-yellow-500 text-white" value={3} />

                                                        <span className="label-text text-xs text-center text-white mt-2">In the middle</span>
                                                    </label>
                                                </div>
                                                <div className="form-control">
                                                    <label className="label cursor-pointer flex-col">
                                                        <input onChange={handleRadioChange} type="radio" name="complexity" className="border-white radio radio-sm checked:bg-red-500" value={5} />
                                                        <span className="label-text text-xs text-center text-white mt-2">More Complex</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {

                                            <button type="submit" className={` w-48  mx-auto btn btn-primary mt-5
                                    ${boardGames.length === 0 && 'btn-disabled'}
                                    `}>MeepleMatch!</button>

                                        }
                                    </>
                            }
                            {
                                !gamesLoading && (boardGames.length === 0 && <label className="text-center pt-2">Your shelf is empty!</label>)
                            }
                        </form>
                    </div>

                    {filteredGames.length ?

                        <div className="dropdown dropdown-hover mt-5">
                            <label tabIndex={0} className="btn m-1">Sort By...</label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-slate-800 border-slate-200 border-2 rounded-box w-52">
                                <li className='cursor-pointer hover:bg-slate-500 pl-2 rounded-md' onClick={handleChangeSort} id="alphaAz">Alpha &#40;A-Z&#41;</li>
                                <li className='cursor-pointer hover:bg-slate-500 pl-2 rounded-md' onClick={handleChangeSort} id="alphaZa">Alpha &#40;Z-A&#41;</li>
                                <li className='cursor-pointer hover:bg-slate-500 pl-2 rounded-md' onClick={handleChangeSort} id="complexityAsc">Complexity &#40;asc.&#41;</li>
                                <li className='cursor-pointer hover:bg-slate-500 pl-2 rounded-md' onClick={handleChangeSort} id="complexityDesc">Complexity &#40;desc.&#41;</li>
                            </ul>
                        </div>
                        : <></>
                    }

                    <ul className="flex justify-center flex-wrap w-screen my-5">

                        {filteredGames?.map(game => {
                            return <Game
                                key={game.id}
                                id={game.id}
                                title={game.title}
                                image={game.image}
                                minPlayers={game.minPlayers}
                                maxPlayers={game.maxPlayers}
                                playTime={game.playTime}
                                complexity={game.complexity}
                                mechanics={game.mechanics}
                                handleClick={handleClick}
                                isBeingDeleted={false}
                                isMatcher={true}
                            />
                        })}

                    </ul>

                </main>
            </Layout>
        </>
    );
}

function filterComplexity(gameComplexity: number, input: number) {
    return Math.round(gameComplexity) <= input
}

function filterNumPlayers(gameMinPlayers: number, gameMaxPlayers: number, input: number) {
    return input >= gameMinPlayers && input <= gameMaxPlayers
}

function filterPlayTime(gamePlayTime: number, input: number) {
    if (Number(gamePlayTime) === 0) {
        console.log('zero')
    };
    return gamePlayTime <= input
}

function findHighestPlayerCount(boardGames: BoardGame[], length: number) {
    return Math.max(...boardGames.map(game => game.maxPlayers));
}

// function isMindMGMT(id: number) {
//     return id === 284653;
//     //set hidden if game is Mind MGMT
// }