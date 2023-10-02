import React from 'react'
import Burger from '../../../public/burger2.svg'
import Image from 'next/image'

const SearchResult = (props) => {
    const { title, id } = props

    function handleClick(e) {
        // console.log(e.target.id)
        addGame(e.target.id, title)
    }

    return (
        <li className="flex justify-between py-2" key={id} >
            {title}
            <button
                onClick={handleClick}
                className="btn-primary btn-xs rounded-md "
                id={id}>

                <Image className='text-white' src={Burger} height={25} width={25} alt='click here to see more' aria-label='Click to see more' />

            </button>
        </li>
    )
}

async function addGame(id: number, title: string) {

    const baseURLInfo = "https://boardgamegeek.com/xmlapi2/thing?id="

    const gameInformation = await fetch(baseURLInfo + id + '&stats=1')
        .then(response => response.text())
        .then(data => {
            console.log(id, data)
            let xmlDocument = new DOMParser().parseFromString(data, "text/xml")
            let boardGameResults = xmlDocument.querySelectorAll("item");

            //pass in title & id from the parent component

            // let boardGameInfo: {
            //     playTime: number,
            //     minPlayers: number,
            //     maxPlayers: number,
            //     id: number,
            //     complexity: number,
            //     image: string,
            //     title: string,
            // } = {
            //     playTime: 0,
            // }

            let playTime: number = Number(xmlDocument.querySelector('playingtime')?.getAttribute('value'))
            let minPlayers: number = Number(xmlDocument.querySelector('minplayers')?.getAttribute('value'))
            let maxPlayers: number = Number(xmlDocument.querySelector('maxplayers')?.getAttribute('value'))
            let complexity: number = Number(xmlDocument.querySelector('averageweight')?.getAttribute('value'))
            let image: string = xmlDocument.querySelector('thumbnail')?.textContent!;

            let mechanics: { mechanicText: string, mechanicId: number }[] = []

            let links = xmlDocument.querySelectorAll('link[type="boardgamemechanic"]')

            links.forEach((link) => {
                const id = Number(link.getAttribute('id'));
                const value = link.getAttribute('value');
                mechanics.push({ mechanicId: id, mechanicText: value! });
            });

            console.log({ playTime: playTime, minPlayers: minPlayers, maxPlayers: maxPlayers, complexity: complexity, image: image })
            console.log(mechanics)

            //put all the info into this object & return it

        })
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
