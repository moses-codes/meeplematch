import Navbar from './Navbar'
import ReactNode from "react"

interface ChildrenProps {
    children: React.ReactNode,
}

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <Navbar />
            <main className='w-full'>{children}</main>
        </>
    )
}