import Navbar from './Navbar'

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