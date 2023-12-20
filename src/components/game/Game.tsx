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
    isMatcher: boolean;

}

interface Mechanic {
    id: number,
    mechanicText: string,
}

const Game = ({ id, title, image, minPlayers, maxPlayers, playTime, complexity, mechanics, handleClick, isBeingDeleted, isMatcher }: BoardGameProps) => {


    // console.log(handleClick)
    return (
        <>
            <div className="group relative block  w-96 h-96 my-2 mx-2">

                <span className="absolute inset-0 border-2 border-dashed border-slate-400 rounded-xl"></span>

                <div
                    className="z-0 relative flex h-full transform items-end border-2 border-slate-400 bg-slate-800 transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2 rounded-xl"
                >
                    <div
                        className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8 w-full justify-around"
                    >

                        <div className='h-52 relative text-center border-1 border-white w-full rounded-2xl my-10'>
                            <Image
                                height={300}
                                width={300}
                                sizes=''
                                className='inline-block mx-auto mb-4 w-auto h-full rounded-sm'
                                src={image ?? ''}
                                alt={`Box art for ${title}`} />
                        </div>


                        <p className="text-2xl font-semibold mb-4 w-full z-20 relative line-clamp-1 text-center">{title}</p>
                    </div>

                    <div
                        className="absolute w-full h-full opacity-0 transition-opacity 
                        group-hover:relative group-hover:opacity-100 
                        overflow-scroll
                        "
                    >
                        <div className='fixed h-full w-full overflow-hidden'>
                            <Image
                                sizes='400px'
                                fill
                                className='blur-xl opacity-30'
                                src={image ?? ''}
                                alt={`Box art for ${title}`}
                            />
                        </div>

                        <div className='p-8 relative z-10   h-full'>
                            <h3 className="mb-4 text-xl font-bold sm:text-2xl">{title}</h3>

                            <div className="mt-4 text-sm sm:text-base relative pb-10">
                                {minPlayers === maxPlayers ?
                                    minPlayers === 1 ? <p>1 player</p> : <p>{maxPlayers} players</p>
                                    :
                                    <p className='my-2'><span className='font-semibold'>Players: </span>{minPlayers} - {maxPlayers}</p>}
                                <p className='my-2'><span className='font-semibold'>Play time: </span>{playTime} min</p>
                                <p className='my-2'><span className='font-semibold'>Complexity: </span>{(complexity).toPrecision(3)} / 5</p>



                                {mechanics?.length && <p><span className='font-semibold'>Mechanics: </span>
                                    {
                                        mechanics?.map((m, i, arr) => {
                                            if (i === arr.length - 1) return <span key={m.id}>{m.mechanicText} </span>
                                            return <span key={m.id}>{m.mechanicText}, </span>
                                        })}
                                </p>
                                }
                            </div>



                            {!isMatcher && <>
                                {
                                    isBeingDeleted ?
                                        <>
                                            <span className="loading loading-spinner text-error mx-auto"></span>
                                        </>
                                        :
                                        <button
                                            onClick={handleClick}
                                            className="btn btn-error mx-auto w-32 mb-10"
                                            value={id}
                                        >Delete</button>

                                }
                            </>}
                        </div>




                    </div>
                </div>
            </div>
            {/* 
            <li className="card w-96 bg-base-100 shadow-xl p-5 m-5 text-center  mx-2" key={id}>
                <h2 className="text-2xl font-bold truncate truncate-ellipsis mb-4">{title}</h2>
                <div className='h-32 relative'>
                    <Image
                        height={200}
                        width={200}
                        sizes=''
                        className='inline-block mx-auto mb-4 w-auto rounded-md h-full'
                        src={image ?? ''}
                        alt={`Box art for ${title}`} />
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
            </li> */}

        </>
    )
}

export default Game
