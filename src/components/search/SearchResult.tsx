import { React, useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
// import Burger from '../../../public/burger2.svg'
import Image from 'next/image'

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

const SearchResult = (props: { title: string; id: number; yearPublished: number; isInLibrary: boolean }) => {
    const { title, id, yearPublished, isInLibrary } = props

    console.log(title, isInLibrary)

    const bgInfo = api.boardGames.addGame.useMutation()
    // const bgMechanics = api.boardGames.addMechanics.useMutation()

    async function handleClick(e) {
        // console.log(e.target.id)
        let boardGameInfo: {
            bgInfo: {
                playTime: number;
                minPlayers: number;
                maxPlayers: number;
                complexity: number;
                image: string;
                id: number;
                title: string;
            };
            bgMechanics: {
                id: number;
                mechanicText: string;
            }[]
        } = await addGame(id, title)!
        // console.log(boardGameInfo)
        bgInfo.mutate(boardGameInfo)
        // isInLibrary = !isInLibrary
        // bgMechanics.mutate()
    }

    return (
        <li className="flex justify-between py-2" >
            {`${title} (${yearPublished})`}
            <button
                onClick={handleClick}
                className={`btn-primary btn-xs rounded-md 
                ${isInLibrary && 'btn-disabled btn-neutral'}
                `}
                id={id}
            >

                {isInLibrary ? "IN LIBRARY" : "ADD"}

            </button>
        </li>
    )
}

async function addGame(id: number, title: string): Promise<{
    playTime: number;
    minPlayers: number;
    maxPlayers: number;
    complexity: number;
    image: string;
    id: number;
}> {

    const baseURLInfo = "https://boardgamegeek.com/xmlapi2/thing?id="

    // console.log('id equals', id)

    let bgInfo: {
        playTime: number;
        minPlayers: number;
        maxPlayers: number;
        complexity: number;
        image: string;
        id: number;
        title: string;
    } = {
        playTime: 0,
        minPlayers: 0,
        maxPlayers: 0,
        complexity: 0,
        image: "",
        title: title,
        id: id,
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
            }

            console.log(mechanics, bgInfo)

            //put all the info into this object & return it


        })

    return { bgInfo: bgInfo, bgMechanics: mechanics }
}

// model Game {
//     id           String        @id
//     name         String
//     image        String?
//     playTime     Int
//     maxPlayers   Int
//     minPlayers   Int
//     complexity   Float
//     user         User[]
//     mechanics    Mechanic[]
//     gameSessions GameSession[]
// }

// //many mechanics bay be tied to many games.
// model Mechanic {
//     id           String @id
//     mechanicText String
//     games        Game[]
// }

export default SearchResult
