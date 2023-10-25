import React, { ReactEventHandler } from 'react'

import { api } from "~/utils/api";

interface gameProps {
    title: string,
    minPlayers: number,
    maxPlayers: number,
    playTime: number,
    id: number,
    image: string,
    complexity: number,
}

const game = (props: gameProps) => {


    const removeGame = api.boardGames.removeGameFromShelf.useMutation();

    async function handleClick(e) {
        let deletedGameId = Number(e.target.value)
        const result = await removeGame.mutate({ id: deletedGameId })
    }

    return (<>
        <li className="card w-96 bg-base-100 shadow-xl p-5 m-5 text-center">
            <h2 className="text-2xl font-bold">{props.title}</h2>
            <p>Players: {props.minPlayers} - {props.maxPlayers}</p>
            <img className='inline-block mx-auto' src={props.image} alt={`Box art for ${props.title}`} />
            <p>Play time: {props.playTime} min</p>
            <p>Complexity: {(props.complexity).toPrecision(3)} / 5</p>
            <button
                onClick={handleClick}
                className="btn btn-error w-1/2 mx-auto"
                value={props.id}
            >Delete</button>
        </li>
    </>
    )
}

export default game
