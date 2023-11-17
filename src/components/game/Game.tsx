import React from 'react'
// import { api } from "~/utils/api";
import Image from 'next/image';

// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BoardGameProps {
    complexity: number;
    id: number;
    image: string | null;
    maxPlayers: number;
    minPlayers: number;
    playTime: number;
    title: string;
    mechanics: Mechanic[];
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isBeingDeleted: boolean;

}

interface Mechanic {
    id: number,
    mechanicText: string,
}

const Game = ({ id, title, image, minPlayers, maxPlayers, playTime, complexity, mechanics, handleClick, isBeingDeleted }: BoardGameProps) => {


    // console.log(handleClick)
    return (
        <>

            <li className="card w-96 bg-base-100 shadow-xl p-5 m-5 text-center  mx-2" key={id}>
                <h2 className="text-2xl font-bold truncate truncate-ellipsis mb-4">{title}</h2>
                <div className='h-32 relative'>
                    <Image fill className='inline-block mx-auto mb-4 h-auto w-auto rounded-md ' src={image ?? ''} alt={`Box art for ${title}`} />
                </div>
                {minPlayers === maxPlayers ?
                    minPlayers === 1 ? <p>1 player</p> : <p>{maxPlayers} players</p>
                    :
                    <p>Players: {minPlayers} - {maxPlayers}</p>}
                <p>Play time: {playTime} min</p>
                <p>Complexity: {(complexity).toPrecision(3)} / 5</p>
                <details className="dropdown mb-10 mt-5">
                    <summary className="m-1 btn">Mechanics</summary>
                    <ul className="p-2 shadow menu dropdown-content z-[1] rounded-box w-64 mx-12 bg-blue-200">
                        {mechanics.map((m: Mechanic) => {
                            return <li key={m.id}>{m.mechanicText}</li>
                        })}
                    </ul>
                </details>
                {
                    isBeingDeleted ?
                        <>
                            <span className="loading loading-spinner text-error mx-auto"></span>
                        </>
                        :
                        <button
                            onClick={handleClick}
                            className="btn btn-error w-1/2 mx-auto"
                            value={id}
                        >Delete</button>

                }
            </li>

        </>
    )
}

export default Game
