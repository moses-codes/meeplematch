import { ReactEventHandler, useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
// import Burger from '../../../public/burger2.svg'
import Image from 'next/image'

import { getHTTPStatusCodeFromError } from '@trpc/server/http';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import 

import { api } from "~/utils/api";

interface GameInfo {
    playTime: number;
    minPlayers: number;
    maxPlayers: number;
    complexity: number;
    image: string;
    title: string;
    id: number;
}
interface BoardGame {
    complexity: number;
    id: number;
    image: string | null;
    maxPlayers: number;
    minPlayers: number;
    playTime: number;
    title: string;
    mechanics: { id: number; mechanicText: string }[];
}

const SearchResult = (props: { title: string; id: number; yearPublished: number; isInLibrary: boolean, updateLibrary: (newGame: { id: number }) => void; }) => {

    const { title, id, yearPublished, isInLibrary, updateLibrary } = props

    const [showInLibrary, setShowInLibrary] = useState<boolean>(isInLibrary)

    // console.log(title, isInLibrary)

    const bgInfo = api.boardGames.addGame.useMutation(({
        onSuccess: async (e) => {
            const notifyAdd = () => {
                toast.success(`${e.title} has been added to your library.`, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            notifyAdd()
            setShowInLibrary(!showInLibrary)
            updateLibrary({ id: e.id })
        },
        onError: (e) => {
            toast.error(`Error: could not add game`)
            console.log()
        },
    }))

    // const bgMechanics = api.boardGames.addMechanics.useMutation()

    async function handleClick() {
        console.log('clicked')
        let boardGameInfo = await addGame(id, title)!
        bgInfo.mutate(boardGameInfo)
    }

    return (
        <li className="flex items-center justify-between py-2 px-4 border-2 border-slate-400 rounded-md my-3 mx-2" >
            {`${title} (${yearPublished})`}
            <button
                onClick={handleClick}
                className={`btn-primary btn-xs rounded-md 
                ${showInLibrary && 'btn-disabled btn-neutral opacity-75'}
                `}
                id={`${id}`}
            >

                {showInLibrary ? "IN LIBRARY" : "ADD"}

            </button>
        </li>
    )
}

async function addGame(id: number, title: string) {

    const baseURLInfo = "https://boardgamegeek.com/xmlapi2/thing?id="

    // console.log('id equals', id)

    let bgInfo: BoardGame = {
        playTime: 0,
        minPlayers: 0,
        maxPlayers: 0,
        complexity: 0,
        image: "",
        title: title,
        id: id,
        mechanics: [],
    };
    let mechanics: {
        mechanicText: string,
        id: number
    }[] = []

    const gameInformation = await fetch(baseURLInfo + id + '&stats=1')
        .then(response => response.text())
        .then(data => {
            let xmlDocument = new DOMParser().parseFromString(data, "text/xml")
            let boardGameResults = xmlDocument.querySelectorAll("item");

            //pass in title & id from the parent component

            let playTime: number = Number(xmlDocument.querySelector('playingtime')?.getAttribute('value'))
            let minPlayers: number = Number(xmlDocument.querySelector('minplayers')?.getAttribute('value'))
            let maxPlayers: number = Number(xmlDocument.querySelector('maxplayers')?.getAttribute('value'))
            let complexity: number = Number(xmlDocument.querySelector('averageweight')?.getAttribute('value'))
            let image: string = xmlDocument.querySelector('thumbnail')?.textContent!;

            let links = xmlDocument.querySelectorAll('link[type="boardgamemechanic"]')

            links.forEach((link) => {
                const id = Number(link.getAttribute('id'));
                const value = link.getAttribute('value');
                mechanics.push({ id: id, mechanicText: value! });
            });

            bgInfo = {
                title: title,
                playTime: playTime,
                minPlayers: minPlayers,
                maxPlayers: maxPlayers,
                complexity: complexity,
                image: image,
                id: id,
                mechanics: []
            }

            console.log(mechanics, bgInfo)

            //put all the info into this object & return it


        })

    return { bgInfo: bgInfo, bgMechanics: mechanics }
}

export default SearchResult
