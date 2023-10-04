import { React, useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
import Burger from '../../../public/burger2.svg'
import Image from 'next/image'

// import 

import { api } from "~/utils/api";

interface GameInfo {
    playTime: number;
    minPlayers: number;
    maxPlayers: number;
    complexity: number;
    image: string;
}

const SearchResult = (props: { title: string; id: number; }) => {
    const { title, id } = props

    const bgInfo = api.boardGames.addGame.useMutation()
    const bgMechanics = api.boardGames.addMechanics.useMutation()

    async function handleClick(e) {
        // console.log(e.target.id)
        let boardGameInfo: {
            bgInfo: {
                playTime: number;
                minPlayers: number;
                maxPlayers: number;
                complexity: number;
                image: string;
                gameId: number
            };
            bgMechanics: {
                mechanicId: number;
                mechanicText: string;
            }[]
        } = await addGame(id, title)!
        // boardGameInfo = await addGame(id, title)
        // setGameInfo(boardGameInfo)
        bgInfo.mutate(boardGameInfo)
        // bgMechanics.mutate()
    }

    return (
        <li className="flex justify-between py-2" >
            {title}
            <button
                onClick={handleClick}
                className="btn-primary btn-xs rounded-md "
                id={id}>

                ADD

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
    gameId: number;
}> {

    const baseURLInfo = "https://boardgamegeek.com/xmlapi2/thing?id="

    // console.log('id equals', id)

    let bgInfo: {
        playTime: number;
        minPlayers: number;
        maxPlayers: number;
        complexity: number;
        image: string;
        gameId: number;
    } = {
        playTime: 0,
        minPlayers: 0,
        maxPlayers: 0,
        complexity: 0,
        image: "",
    };
    let mechanics: {
        mechanicText: string,
        mechanicId: number
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
                mechanics.push({ mechanicId: id, mechanicText: value! });
            });

            bgInfo = {
                playTime: playTime,
                minPlayers: minPlayers,
                maxPlayers: maxPlayers,
                complexity: complexity,
                image: image,
                gameId: id,
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
