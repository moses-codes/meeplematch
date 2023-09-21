import Link from "next/link"

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 flex px-24 py-5">
            <div className="flex-1">
                <Link href='/' className="btn btn-ghost normal-case text-xl">gamingTime</Link>
            </div>
            <div className="w-1/4">
                <ul className="menu menu-horizontal px-1 flex w-full justify-between">
                    <li><Link href='/shelf'>My Shelf</Link></li>
                    <li><Link href='/search'>Add Game</Link></li>
                </ul>
            </div>
        </div>
    )
}