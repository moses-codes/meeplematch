import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import React, { useState } from "react";
import Layout from "~/components/layout/Layout";

import SearchResult from "~/components/search/SearchResult";


import { api } from "~/utils/api";

type FormProps = {
    type: string
}

// interface GameInfo {
//     playTime: number;
//     minPlayers: number;
//     maxPlayers: number;
//     complexity: number;
//     image: string;
// }

export default function Search() {

    interface SearchResult {
        title: string;
        id: number;
        // Add more properties as needed
    }

    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        let results: SearchResult[] = await boardGameSearch(searchInput)
        setSearchResults(results)
    }

    let searchResultList = (
        <ul>
            {searchResults.map((result) => {
                return <SearchResult title={result.title} id={result.id}
                    key={result.id}
                />
            })}
        </ul>
    )

    return (
        <>
            <Layout>
                <Head>
                    <title>MeepleMatch: Add Game</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/3d-meeple-svgrepo-com.svg" />
                </Head>
                <main className=" flex min-h-screen flex-col items-center pt-12 bg-slate-300">
                    <h1>search</h1>
                    <form onSubmit={handleSubmit} className="flex ">
                        <input type="text"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
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


// function AuthShowcase() {
//     const { data: sessionData } = useSession();
//     //use the useSession function from nextAuth
//     const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//         undefined, // no input
//         { enabled: sessionData?.user !== undefined }
//     );

//     return (
//         <div className="flex flex-col items-center justify-center gap-4">
//             <p className="text-center text-2xl text-white">
//                 {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//                 {secretMessage && <span> - {secretMessage}</span>}
//             </p>
//             <button
//                 className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//                 onClick={sessionData ? () => void signOut() : () => void signIn()}
//             >
//                 {sessionData ? "Sign out" : "Sign in"}
//             </button>
//         </div>
//     );
// }

interface Cache {
    [id: string]: number;
}

interface SearchResult {
    title: string,
    id: number,
}

async function boardGameSearch(input: String) {
    const baseURLSearch = "https://boardgamegeek.com/xmlapi2/search?query="

    let idsCache: Cache = {}

    // let idSetter = 0



    const searchResults = await fetch(baseURLSearch + input + '&type=boardgame')
        .then(response => response.text())
        .then(data => {
            // console.log(data)
            return data
        })

    let xmlDocument = new DOMParser().parseFromString(searchResults, "text/xml")
    let boardGameResults = xmlDocument.querySelectorAll("item");

    let boardGames: SearchResult[] = []

    for (let game of boardGameResults) {
        let title: string = game.querySelector('name')?.getAttribute("value")!
        let id: number = Number(game.getAttribute('id'))

        if (idsCache[id]) {
            continue;
        } else {
            idsCache[id] = 1
            boardGames.push({
                title: title,
                id: id,
            })
        }
    }

    return boardGames
}