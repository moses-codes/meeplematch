import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import React, { useState } from "react";
import Layout from "~/components/layout/Layout";

import dug from "../../../public/dug.png"

import SearchResult from "~/components/search/SearchResult";

import Image from "next/image";

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

    const [boardGames, setBoardGames] = useState<BoardGame[]>([])

    const [filteredGames, setFilteredGames] = useState<BoardGame[]>([])

    const [maxPlayerCount, setMaxPlayerCount] = useState<number>(0)

    const { data: userGames } = api.boardGames.getUserGames.useQuery(undefined, {
        onSuccess: (data) => {
            setBoardGames(data)
            setMaxPlayerCount(findHighestPlayerCount(data, data.length)!)
        },
    });

    console.log(maxPlayerCount)

    const [formData, setFormData] = useState<FormData>({
        numPlayers: 3, // Initialize with default values
        complexity: 0,
        playTime: 60,
    });

    // Your handleChange function (assuming it's something like this)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value)
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target;
        console.log(name, value)
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleChangeSort = (e: React.ChangeEvent<HTMLInputElement>) => {

        let input = e.target.id

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

    // Your handleSubmit function
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(formData)

        let result;

        result = boardGames.filter(game => {
            return filterComplexity(game.complexity, formData.complexity) && filterNumPlayers(game.minPlayers, game.maxPlayers, formData.numPlayers) && filterPlayTime(game.playTime, formData.playTime)
        })
            .sort((a, b) => b.complexity - a.complexity)

        setFilteredGames(result)

        console.log(result)
    };

    return (
        <>
            <Layout>
                <Head>
                    <title>MeepleMatch: Add Game</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/3d-meeple-svgrepo-com.svg" />
                </Head>
                <main className=" flex min-h-screen flex-col items-center pt-12 bg-slate-300 pb-36">
                    <div className="border-2 border-black rounded-lg p-10 bg-blue-100">
                        <h1 className="text-3xl mb-12 text-center">Game Matcher</h1>

                        <form onSubmit={handleSubmit} className='flex flex-col'>

                            <div className='flex flex-col h-16'>
                                <div className="flex justify-start items-center">
                                    <label className='' htmlFor="numPlayers">Number of players:</label>
                                    <input max={maxPlayerCount} className='rounded-md pl-2 w-16 ml-5' type="number" id="numPlayers" name="numPlayers" value={formData.numPlayers} onChange={handleChange} />
                                </div>
                                {maxPlayerCount ? <label className='mt-2 text-xs' htmlFor="numPlayers">*Max player count is currently {maxPlayerCount}.</label> : ""}
                            </div>

                            <label className='mt-5' htmlFor="complexity">What's your preferred maximum complexity?</label>
                            <div className="flex  justify-between h-16">
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">More Simple</span>
                                        <input onChange={handleRadioChange} type="radio" name="complexity" className="radio radio-sm checked:bg-green-500" value={2} />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">In the middle</span>
                                        <input onChange={handleRadioChange} type="radio" name="complexity" className="radio radio-sm checked:bg-yellow-500" value={3} />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">More Complex</span>
                                        <input onChange={handleRadioChange} type="radio" name="complexity" className="radio radio-sm checked:bg-red-500" value={5} />
                                    </label>
                                </div>
                            </div>
                            <div className="h-16 mt-4">
                                <div className="flex justify-start items-center">
                                    <label className='' htmlFor="playTime">Preferred play time* &#40;in minutes&#41;: </label>
                                    <input className='rounded-md pl-2 w-16 ml-5' type='number' id="playTime" name="playTime" value={formData.playTime} onChange={handleChange} />
                                </div>
                                <label className='mt-2 text-xs' htmlFor="numPlayers">*As shown on box.</label>
                            </div>
                            {

                                <button type="submit" className={` w-1/2  mx-auto btn btn-secondary mt-5
                                    ${boardGames.length === 0 && 'btn-disabled'}
                                    `}>MeepleMatch!</button>

                            }
                            {
                                boardGames.length === 0 && <label className="text-center pt-2">Your shelf is empty!</label>
                            }
                        </form>
                    </div>

                    {filteredGames.length ?

                        <div className="dropdown dropdown-hover mt-5">
                            <label tabIndex={0} className="btn m-1">Sort By...</label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li><a onClick={handleChangeSort} id="alphaAz">Alpha &#40;A-Z&#41;</a></li>
                                <li><a onClick={handleChangeSort} id="alphaZa">Alpha &#40;Z-A&#41;</a></li>
                                <li><a onClick={handleChangeSort} id="complexityAsc">Complexity &#40;asc.&#41;</a></li>
                                <li><a onClick={handleChangeSort} id="complexityDesc">Complexity &#40;desc.&#41;</a></li>
                            </ul>
                        </div>
                        : <></>
                    }

                    <ul className="flex justify-center flex-wrap w-screen my-5">

                        {filteredGames && filteredGames.map(game => {
                            return <li className="card w-96 bg-base-100 shadow-xl p-5 m-5 text-center" key={game.id}>
                                <h2 className="text-2xl font-bold truncate truncate-ellipsis">{game.title}</h2>
                                <p>Players: {game.minPlayers} - {game.maxPlayers}</p>
                                <img className='inline-block mx-auto mb-5' src={game.image} alt={`Box art for ${game.title}`} />
                                <p>Play time: {game.playTime} min</p>
                                <p>Complexity: {(game.complexity).toPrecision(3)} / 5</p>
                                <details className="dropdown mb-5">
                                    <summary className="m-1 btn">Mechanics</summary>
                                    <ul className="p-2 shadow menu dropdown-content z-[1] rounded-box w-64 mx-12 bg-blue-200">
                                        {game.mechanics.map((m: Mechanic) => {
                                            return <li key={m.id}>{m.mechanicText}</li>
                                        })}
                                    </ul>
                                </details>
                            </li>
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
    return gamePlayTime <= input
}

function findHighestPlayerCount(boardGames: BoardGame[], length: number) {
    return boardGames.sort((a, b) => a.maxPlayers - b.maxPlayers)[length - 1]?.maxPlayers
}

function isMindMGMT(id: number) {
    return id === 284653;
    //set hidden if game is Mind MGMT
}