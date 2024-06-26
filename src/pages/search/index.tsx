// import { Mechanic } from "@prisma/client";
// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import React, { useState } from "react";
// import { number } from "zod";
import Layout from "~/components/layout/Layout";

import SearchResult from "~/components/search/SearchResult";




import { api } from "~/utils/api";

// type FormProps = {
//     type: string
// }

// interface BoardGame {
//     complexity: number;
//     id: number;
//     image: string | null;
//     maxPlayers: number;
//     minPlayers: number;
//     playTime: number;
//     title: string;
//     mechanics: { id: number; mechanicText: string }[];
// }

export default function Search() {

    const [boardGames, setBoardGames] = useState<{ id: number }[]>([])

    const { data: games } = api.boardGames.getUserGameIds.useQuery(undefined, {
        onSuccess: (data) => {
            setBoardGames(data)
        },

    });

    interface SearchResult {
        title: string;
        id: number;
        yearPublished: number;
        isInLibrary: boolean;
    }

    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])

    function handleSubmit(e: React.FormEvent): void {
        e.preventDefault();

        boardGameSearch(searchInput)
            .then((results: SearchResult[]) => {
                setSearchResults(results);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function updateLibrary(newGame: { id: number }) {
        setBoardGames([...boardGames, newGame])
    }

    const searchResultList = (
        <ul>
            {searchResults.map((result) => {
                return <SearchResult title={result.title}
                    id={result.id}
                    key={result.id}
                    yearPublished={result.yearPublished}
                    isInLibrary={boardGames.find(g => g.id === result.id) ? true : false}
                    updateLibrary={updateLibrary}
                />
            })}
        </ul>
    )


    return (
        <>
            <Layout>
                <Head>
                    <title>MeepleMatch: Add Game</title>
                    <meta name="description" content="Created by moses-codes" />
                    <link rel="icon" href="/3d-meeple-svgrepo-com.svg" />
                </Head>
                <main className=" flex min-h-screen flex-col items-center pt-5 bg-slate-800 text-slate-100 ">
                    <h1 className="py-5 text-3xl">Search</h1>
                    <form onSubmit={handleSubmit} className="flex ">
                        <input type="text"
                            placeholder="Search by title"
                            className="input input-bordered w-full max-w-xs mb-5 mr-5 text-slate-800"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button className="btn btn-outline btn-primary"
                            type="submit"
                        >search</button>
                    </form>

                    {searchResults && searchResultList
                    }
                </main>
            </Layout>
        </>
    );
}

type Cache = Record<string, number>

interface SearchResult {
    title: string,
    id: number,
    yearPublished: number,
    isInLibrary: boolean,
}

async function boardGameSearch(input: string) {
    const baseURLSearch = "https://boardgamegeek.com/xmlapi2/search?query="

    const idsCache: Cache = {}

    // let idSetter = 0

    const searchResults = await fetch(baseURLSearch + input + '&type=boardgame')
        .then(response => response.text())
        .then(data => {
            // console.log(data)
            return data
        })

    const xmlDocument = new DOMParser().parseFromString(searchResults, "text/xml")
    const boardGameResults = xmlDocument.querySelectorAll("item");

    const boardGames: SearchResult[] = []

    for (const game of boardGameResults) {
        const title: string = game.querySelector('name')?.getAttribute("value") ?? "No title found"
        const id = Number(game.getAttribute('id'))
        const yearPublished = Number(game.querySelector('yearpublished')?.getAttribute("value")) ?? "No year found"
        // let isInLibrary: boolean = false

        if (idsCache[id]) {
            continue;
        } else {
            idsCache[id] = 1
            boardGames.push({
                title: title,
                id: id,
                yearPublished: yearPublished,
                isInLibrary: false
            })
        }

    }

    return boardGames
}

